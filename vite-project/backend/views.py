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