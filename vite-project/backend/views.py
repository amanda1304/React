# SeuApp/views.py

#from django.http import JsonResponse
#from rest_framework.decorators import api_view
#from rest_framework.response import Response

# @api_view é um decorator do DRF para criar funções de visualização simples
#@api_view(['GET'])
#def hello_world(request):
    #"""
    #"""
    #return Response({
     #   "message": "Conexão Django OK!",
      #  "status": "sucesso",
       # "timestamp": "2025-10-23" # Data atual simulada
    #})
# backend/views.py

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import authenticate # Função crítica de autenticação
from rest_framework.authtoken.models import Token 
from rest_framework import serializers
from rest_framework.permissions import AllowAny
from django.http import JsonResponse
from django.views import View
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated

# --- SERIALIZER DE LOGIN ---
# Define os campos que a View espera na requisição POST.
class LoginSerializer(serializers.Serializer):
    # CRÍTICO: O Serializer DEVE manter as chaves que o frontend envia
    cpf = serializers.CharField(max_length=11)
    password = serializers.CharField(max_length=128)

# --- VIEW DE LOGIN ---
class LoginView(APIView):
    """
    Recebe CPF e Senha e retorna um token de autenticação.
    Permite acesso a qualquer um (AllowAny) para poder logar.
    """
    permission_classes = [AllowAny]
    
    def post(self, request, format=None):
        # 1. Valida os dados usando o Serializer
        serializer = LoginSerializer(data=request.data)
        
        if not serializer.is_valid():
            # Retorna 400 Bad Request se os dados estiverem faltando ou incorretos
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        cpf = serializer.validated_data.get('cpf')
        password = serializer.validated_data.get('password')

        # 2. Tenta autenticar o usuário. 
        # CRÍTICO: O argumento deve ser 'username' para que o Django use o USERNAME_FIELD
        # (que você definiu como 'cpf' no seu modelo).
        user = authenticate(request, username=cpf, password=password) # <--- CORREÇÃO AQUI

        if user is not None:
            # 3. Se autenticado, obtém ou cria o token de autenticação
            token, created = Token.objects.get_or_create(user=user)
            
            # Retorna o token com sucesso (200 OK)
            return Response(
                {
                    'token': token.key,
                    'id_usuario': str(user.pk), # Use str(user.pk) ou user.id para compatibilidade
                    # Incluir o nome do usuário para que o frontend possa exibi-lo
                    'user_name': getattr(user, 'nome', '') or '',
                    # NÃO acessar user.is_staff diretamente: a tabela legacy não tem
                    # a coluna `is_staff` e isso provoca consultas que geram 1054.
                    'is_staff': False
                },
                status=status.HTTP_200_OK
            )
        else:
            # 4. Falha na autenticação (401 Unauthorized - Credenciais inválidas)
            return Response(
                {'detail': 'Credenciais inválidas. Verifique o CPF e a senha.'}, 
                status=status.HTTP_401_UNAUTHORIZED
            )

# Exemplo de uma view simples de teste
class TesteConexaoView(View):
    def get(self, request, *args, **kwargs):
        return JsonResponse({'message': 'Conexão Django OK!'})


class MeView(APIView):
    """
    Retorna os dados públicos do usuário autenticado (token).
    Usa TokenAuthentication para recuperar request.user e devolve campos seguros.
    """
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request, format=None):
        user = request.user
        # Evita acessar campos que não existem no banco. Usa getattr com fallback.
        data = {
            'id_usuario': str(getattr(user, 'pk', '')),
            'nome': getattr(user, 'nome', ''),
            'cpf': getattr(user, 'cpf', ''),
            'email': getattr(user, 'email', ''),
            'telefone_celular': getattr(user, 'telefone_celular', ''),
            'telefone_fixo': getattr(user, 'telefone_fixo', ''),
            'rg': getattr(user, 'rg', ''),
            'data_nascimento': (getattr(user, 'data_nascimento', None).isoformat() if getattr(user, 'data_nascimento', None) else ''),
            'nome_pai': getattr(user, 'nome_pai', ''),
            'nome_mae': getattr(user, 'nome_mae', ''),
        }
        return Response(data, status=status.HTTP_200_OK)


class ReceitasView(APIView):
    """Retorna a lista de receitas do usuário autenticado."""
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request, format=None):
        user = request.user
        from django.db import connection
        with connection.cursor() as cursor:
            cursor.execute(
                "SELECT id_receita, id_usuario, medicamento, dosagem, instrucoes, data_emissao, validade, status "
                "FROM receitas WHERE id_usuario = %s ORDER BY data_emissao DESC",
                [user.pk]
            )
            cols = [col[0] for col in cursor.description]
            rows = cursor.fetchall()

        receitas = [dict(zip(cols, row)) for row in rows]
        return Response(receitas, status=status.HTTP_200_OK)

class ExamesView(APIView):
    """Retorna a lista de exames do usuário autenticado."""
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request, format=None):
        user = request.user
        from django.db import connection
        try:
            with connection.cursor() as cursor:
                cursor.execute(
                    "SELECT * FROM exames_laudos WHERE id_usuario = %s ORDER BY data_exame DESC",
                    [user.pk]
                )
                cols = [col[0] for col in cursor.description]
                rows = cursor.fetchall()

            exames = [dict(zip(cols, row)) for row in rows]
            return Response(exames, status=status.HTTP_200_OK)
        except Exception as e:
            # Se a tabela 'exames' não existir no banco (legacy DB), devolve lista vazia
            err_msg = str(e)
            if "1146" in err_msg or "doesn't exist" in err_msg or "does not exist" in err_msg:
                return Response([], status=status.HTTP_200_OK)
            # Em modo DEBUG retornamos o erro para facilitar debug via curl.
            return Response({'error': err_msg}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
class AgendaView(APIView):
    """Retorna a lista de agendamentos do usuário autenticado."""
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request, format=None):
        user = request.user
        from django.db import connection
        with connection.cursor() as cursor:
            cursor.execute(
                "SELECT id_agendamento, id_usuario, id_tipo_servico, data_hora, status, observacoes "
                "FROM agendamentos WHERE id_usuario = %s ORDER BY data_hora DESC",
                [user.pk]
            )
            cols = [col[0] for col in cursor.description]
            rows = cursor.fetchall()

        agendamentos = [dict(zip(cols, row)) for row in rows]
        return Response(agendamentos, status=status.HTTP_200_OK)    
    
class TipoServicoView(APIView):
    """Retorna a lista de tipos de serviços disponíveis."""
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request, format=None):
        from django.db import connection
        try:
            with connection.cursor() as cursor:
                cursor.execute(
                    "SELECT * FROM tipo_servicos"
                )
                cols = [col[0] for col in cursor.description]
                rows = cursor.fetchall()

            tipos_servicos = [dict(zip(cols, row)) for row in rows]
            return Response(tipos_servicos, status=status.HTTP_200_OK)
        except Exception as e:
            err = str(e)
            # Se a tabela não existir, tente o nome alternativo 'tipos_servicos'
            if "1146" in err or "doesn't exist" in err or "does not exist" in err:
                try:
                    with connection.cursor() as cursor:
                        cursor.execute(
                            "SELECT * FROM tipos_servicos"
                        )
                        cols = [col[0] for col in cursor.description]
                        rows = cursor.fetchall()

                    tipos_servicos = [dict(zip(cols, row)) for row in rows]
                    return Response(tipos_servicos, status=status.HTTP_200_OK)
                except Exception as e2:
                    return Response({'error': str(e2)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            return Response({'error': err}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
class SubservicosView(APIView):
    """Retorna a lista de subserviços disponíveis."""
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request, format=None):
        from django.db import connection
        with connection.cursor() as cursor:
            cursor.execute(
                "SELECT id_subservico, id_tipo_servico, nome_subservico FROM subservicos ORDER BY nome_subservico ASC"
            )
            cols = [col[0] for col in cursor.description]
            rows = cursor.fetchall()

        subservicos = [dict(zip(cols, row)) for row in rows]
        return Response(subservicos, status=status.HTTP_200_OK)