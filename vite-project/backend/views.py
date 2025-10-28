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

    def post(self, request, format=None):
        """Cria um novo agendamento. Espera JSON com pelo menos: id_tipo, id_subservico (opcional), data e hora (ou data_hora ISO)."""
        user = request.user
        data = request.data
        # aceitar tanto 'id_tipo_servico' quanto 'id_tipo' no payload
        id_tipo = data.get('id_tipo_servico') or data.get('id_tipo')
        id_sub = data.get('id_subservico') or data.get('id_subtipo')
        observacoes = data.get('observacoes', '')
        status_ag = data.get('status', 'Pendente')

        # construir data_hora
        data_hora = data.get('data_hora')
        if not data_hora:
            data_str = data.get('data')
            hora_str = data.get('hora')
            if data_str and hora_str:
                # assume ISO-like date and time
                data_hora = f"{data_str} {hora_str}"

        if not id_tipo or not data_hora:
            return Response({'detail': 'Campos obrigatórios faltando: id_tipo e data_hora (ou data+hora).'}, status=status.HTTP_400_BAD_REQUEST)

        from django.db import connection
        try:
            with connection.cursor() as cursor:
                # detecta se coluna id_subservico existe
                cursor.execute("SELECT column_name FROM information_schema.columns WHERE table_schema = DATABASE() AND table_name = %s", ['agendamentos'])
                cols_tbl = [r[0] for r in cursor.fetchall()]

                # escolhe o nome da coluna de tipo conforme o schema atual
                if 'id_tipo_servico' in cols_tbl:
                    tipo_col_name = 'id_tipo_servico'
                elif 'id_tipo' in cols_tbl:
                    tipo_col_name = 'id_tipo'
                else:
                    # fallback: usa id_tipo
                    tipo_col_name = 'id_tipo'

                fields = ['id_usuario', tipo_col_name, 'data_hora', 'status', 'observacoes']
                values = [user.pk, id_tipo, data_hora, status_ag, observacoes]

                # se existir coluna id_subservico e foi fornecido, insere-a antes de data_hora
                if 'id_subservico' in cols_tbl and id_sub:
                    fields.insert(2, 'id_subservico')
                    values.insert(2, id_sub)

                # se existir coluna id_horario e foi fornecido, insere na posição adequada
                id_horario = data.get('id_horario') or data.get('horario_id') or data.get('id_hora')
                if 'id_horario' in cols_tbl and id_horario:
                    # colocar id_horario logo após id_subservico se presente, senão após id_tipo_servico
                    if 'id_subservico' in fields:
                        pos = fields.index('id_subservico') + 1
                    else:
                        pos = fields.index(tipo_col_name) + 1
                    fields.insert(pos, 'id_horario')
                    values.insert(pos, id_horario)

                placeholders = ','.join(['%s'] * len(fields))
                fields_sql = ','.join(fields)
                sql = f"INSERT INTO agendamentos ({fields_sql}) VALUES ({placeholders})"
                cursor.execute(sql, values)
                # retorna o último id inserido
                cursor.execute("SELECT LAST_INSERT_ID()")
                last = cursor.fetchone()[0]

                # buscar registro criado
                cursor.execute("SELECT * FROM agendamentos WHERE id_agendamento = %s", [last])
                cols = [col[0] for col in cursor.description]
                row = cursor.fetchone()
                ag = dict(zip(cols, row)) if row else {}

            return Response(ag, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
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
        tipo_id = request.query_params.get('tipo_id') or request.query_params.get('id_tipo')

        # Tenta buscar por tipo quando fornecido; caso contrário retorna todos
        try:
            with connection.cursor() as cursor:
                # Primeiro, veja se existe uma tabela chamada exatamente 'subservicos'
                cursor.execute(
                    "SELECT table_name FROM information_schema.tables WHERE table_schema = DATABASE() AND table_name = %s",
                    ['subservicos']
                )
                exists = [r[0] for r in cursor.fetchall()]

                candidate_tables = []
                if exists:
                    candidate_tables = ['subservicos']
                else:
                    # Procura por qualquer tabela contendo 'sub' no nome
                    cursor.execute(
                        "SELECT table_name FROM information_schema.tables WHERE table_schema = DATABASE() AND table_name LIKE %s",
                        ["%sub%"]
                    )
                    candidate_tables = [r[0] for r in cursor.fetchall()]

                # Tente consultar cada tabela candidata até encontrar linhas
                found = False
                subservicos = []
                for tbl in candidate_tables:
                    try:
                        # pega colunas da tabela
                        cursor.execute(
                            "SELECT column_name FROM information_schema.columns WHERE table_schema = DATABASE() AND table_name = %s",
                            [tbl]
                        )
                        cols_tbl = [r[0] for r in cursor.fetchall()]

                        # decide coluna de tipo
                        tipo_col = None
                        if 'id_tipo_servico' in cols_tbl:
                            tipo_col = 'id_tipo_servico'
                        elif 'id_tipo' in cols_tbl:
                            tipo_col = 'id_tipo'

                        if tipo_id and tipo_col:
                            cursor.execute(f"SELECT * FROM {tbl} WHERE {tipo_col} = %s", [tipo_id])
                        else:
                            cursor.execute(f"SELECT * FROM {tbl}")

                        cols = [col[0] for col in cursor.description] if cursor.description else []
                        rows = cursor.fetchall()

                        if rows:
                            subservicos = [dict(zip(cols, row)) for row in rows]
                            found = True
                            break
                    except Exception:
                        # ignore e tenta próximo
                        continue

            # Normalize different schemas into common keys expected by frontend
            normalized = []
            for s in subservicos:
                norm = dict(s)  # shallow copy
                # map id_subservico
                if 'id_subservico' not in norm:
                    if 'id_subtipo' in norm:
                        norm['id_subservico'] = norm.get('id_subtipo')
                    elif 'id' in norm:
                        norm['id_subservico'] = norm.get('id')
                # map id_tipo_servico
                if 'id_tipo_servico' not in norm:
                    if 'id_tipo' in norm:
                        norm['id_tipo_servico'] = norm.get('id_tipo')
                # map nome_subservico
                if 'nome_subservico' not in norm:
                    if 'nome_servico' in norm:
                        norm['nome_subservico'] = norm.get('nome_servico')
                    elif 'nome' in norm:
                        norm['nome_subservico'] = norm.get('nome')

                normalized.append(norm)

            subservicos = normalized
            # Se não encontrou nada, tente inspecionar tabelas relacionadas para diagnóstico
            if not subservicos:
                diagnostic = []
                try:
                    with connection.cursor() as c2:
                        c2.execute(
                            "SELECT table_name FROM information_schema.tables WHERE table_schema = DATABASE() AND table_name LIKE %s",
                            ["%sub%"]
                        )
                        tables = [r[0] for r in c2.fetchall()]

                    for tbl in tables:
                        try:
                            with connection.cursor() as c3:
                                c3.execute(
                                    "SELECT column_name FROM information_schema.columns WHERE table_schema = DATABASE() AND table_name = %s",
                                    [tbl]
                                )
                                cols_tbl = [r[0] for r in c3.fetchall()]

                                # pega até 5 linhas de exemplo
                                try:
                                    c3.execute(f"SELECT * FROM {tbl} LIMIT 5")
                                    sample_cols = [col[0] for col in c3.description] if c3.description else []
                                    sample_rows = c3.fetchall()
                                except Exception:
                                    sample_cols = []
                                    sample_rows = []

                                diagnostic.append({
                                    'table': tbl,
                                    'columns': cols_tbl,
                                    'sample_rows': [dict(zip(sample_cols, r)) for r in sample_rows]
                                })
                        except Exception:
                            continue
                except Exception:
                    diagnostic = []

                # Retorna lista vazia mas com diagnóstico auxiliar para debug do schema
                return Response({'subservicos': [], '_diagnostic_tables': diagnostic}, status=status.HTTP_200_OK)

            return Response(subservicos, status=status.HTTP_200_OK)
        except Exception as e:
            # Fallback: se a tabela não existir ou outro erro, registra e retorna erro 500 com mensagem
            err = str(e)
            if '1146' in err or "doesn't exist" in err or 'does not exist' in err:
                return Response([], status=status.HTTP_200_OK)
            return Response({'error': err}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class HorariosDisponiveisView(APIView):
    """Retorna horários disponíveis relacionados a um subserviço (ou todos)."""
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request, format=None):
        from django.db import connection
        sub_id = request.query_params.get('subservico_id') or request.query_params.get('id_subtipo') or request.query_params.get('id_subservico')

        try:
            with connection.cursor() as cursor:
                # identifica tabelas candidatas: prefer 'horarios_disponiveis'
                cursor.execute(
                    "SELECT table_name FROM information_schema.tables WHERE table_schema = DATABASE() AND table_name = %s",
                    ['horarios_disponiveis']
                )
                exists = [r[0] for r in cursor.fetchall()]

                candidate_tables = []
                if exists:
                    candidate_tables = ['horarios_disponiveis']
                else:
                    # procurar tabelas com 'hora' ou 'dispon' no nome
                    cursor.execute(
                        "SELECT table_name FROM information_schema.tables WHERE table_schema = DATABASE() AND (table_name LIKE %s OR table_name LIKE %s)",
                        ["%hora%", "%dispon%"]
                    )
                    candidate_tables = [r[0] for r in cursor.fetchall()]

                horarios = []
                for tbl in candidate_tables:
                    try:
                        cursor.execute(
                            "SELECT column_name FROM information_schema.columns WHERE table_schema = DATABASE() AND table_name = %s",
                            [tbl]
                        )
                        cols_tbl = [r[0] for r in cursor.fetchall()]

                        # possíveis colunas que ligam ao subservico
                        rel_cols = [c for c in ['id_subservico', 'id_subtipo', 'id_sub', 'id_subserv'] if c in cols_tbl]

                        # possíveis colunas de horário/dia
                        dia_cols = [c for c in ['dia_semana', 'dia', 'weekday'] if c in cols_tbl]
                        inicio_cols = [c for c in ['hora_inicio', 'hora_inicio_str', 'inicio', 'start_time'] if c in cols_tbl]
                        fim_cols = [c for c in ['hora_fim', 'fim', 'end_time'] if c in cols_tbl]

                        if sub_id and rel_cols:
                            rel = rel_cols[0]
                            cursor.execute(f"SELECT * FROM {tbl} WHERE {rel} = %s", [sub_id])
                        else:
                            cursor.execute(f"SELECT * FROM {tbl}")

                        cols = [col[0] for col in cursor.description] if cursor.description else []
                        rows = cursor.fetchall()

                        if rows:
                            horarios = [dict(zip(cols, row)) for row in rows]
                            # normalize keys
                            normalized = []
                            for h in horarios:
                                n = dict(h)
                                if 'id_horario' not in n:
                                    if 'id' in n:
                                        n['id_horario'] = n.get('id')
                                if 'dia_semana' not in n:
                                    if 'dia' in n:
                                        n['dia_semana'] = n.get('dia')
                                if 'hora_inicio' not in n and inicio_cols:
                                    n['hora_inicio'] = n.get(inicio_cols[0])
                                if 'hora_fim' not in n and fim_cols:
                                    n['hora_fim'] = n.get(fim_cols[0])
                                # mapa relação para id_subservico
                                if 'id_subservico' not in n:
                                    for rc in rel_cols:
                                        if rc in n:
                                            n['id_subservico'] = n.get(rc)
                                            break
                                normalized.append(n)

                            return Response(normalized, status=status.HTTP_200_OK)
                    except Exception:
                        continue

            # se nada encontrado, retorna lista vazia
            return Response([], status=status.HTTP_200_OK)
        except Exception as e:
            err = str(e)
            if '1146' in err or "doesn't exist" in err or 'does not exist' in err:
                return Response([], status=status.HTTP_200_OK)
            return Response({'error': err}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)