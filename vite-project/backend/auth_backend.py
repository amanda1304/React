# Arquivo: backend/auth_backend.py

from django.contrib.auth.backends import BaseBackend
from django.db.models import Q
from .models.usuario import UsuarioUnificado # Importe o seu modelo de usuário

class CustomAuthBackend(BaseBackend):
    """
    Autentica usuários usando o campo CPF.
    """
    def authenticate(self, request, cpf=None, password=None, **kwargs):
        # Compatibilidade: Django normalmente passa o valor do USERNAME_FIELD
        # no argumento 'username'. Aceitamos ambos: 'cpf' ou 'username'.
        if cpf is None:
            cpf = kwargs.get('username') or kwargs.get('cpf')

        try:
            # Seleciona apenas os campos necessários para evitar que o ORM faça
            # um SELECT incluindo colunas inexistentes na tabela (ex: last_login).
            # Seleciona apenas os campos realmente presentes na sua tabela legacy
            # (id_usuario, cpf e password/`senha_hash`). Evitamos campos como
            # is_active/is_staff que não existem na tabela e causam SQL error 1054.
            user = UsuarioUnificado.objects.only(
                'id_usuario', 'cpf', 'password'
            ).get(cpf=cpf)

            # Verifica se a senha fornecida corresponde ao hash de senha do usuário
            if user.check_password(password):
                return user
        except UsuarioUnificado.DoesNotExist:
            # Usuário não encontrado
            return None

    def get_user(self, id_usuario):
        # Usado pelo sistema de sessão do Django para buscar o usuário pelo ID
        try:
            return UsuarioUnificado.objects.get(pk=id_usuario)
        except UsuarioUnificado.DoesNotExist:
            return None
