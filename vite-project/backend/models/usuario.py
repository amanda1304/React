from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager
from django.db.models import AutoField # Necessário para o mapeamento da PK

# ===============================================
# 1. Custom Manager (Obrigatório para AbstractBaseUser)
# ===============================================
class CustomUserManager(BaseUserManager):
    """
    Gerenciador de modelos para o Custom User Model.
    Define como criar usuários e superusuários (garantindo o hashing da senha).
    """
    def create_user(self, cpf, password=None, **extra_fields):
        if not cpf:
            raise ValueError('O campo CPF deve ser definido para login.')
        
        user = self.model(cpf=cpf, **extra_fields)
        # set_password CRIPTOGRAFA a senha ANTES de salvar no banco de dados.
        user.set_password(password) 
        user.save(using=self._db)
        return user

    def create_superuser(self, cpf, password=None, **extra_fields):
        # NOTA: O superuser ainda precisa ter is_superuser=True para a CLI e Admin
        extra_fields.setdefault('is_active', True) 
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True) # Apenas um campo Boolean, não está mapeado no BD

        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')
        
        return self.create_user(cpf, password, **extra_fields)

# ===============================================
# 2. Modelo de Usuário Personalizado ÚNICO (UsuarioUnificado)
# ===============================================

# CORREÇÃO CRÍTICA: Não herda mais de PermissionsMixin para evitar 
# que o Django procure por grupos, permissoes e is_superuser no BD.
class UsuarioUnificado(AbstractBaseUser): 
    """
    Modelo de usuário que utiliza o campo 'cpf' para login e mapeia sua tabela 'usuarios'.
    """
    
    # ------------------------------------------------------------------
    # CAMPOS CRÍTICOS DO DJANGO (APENAS AbstractBaseUser)
    # ------------------------------------------------------------------
    # CORREÇÃO: last_login deve ser null=True, blank=True (como estava) 
    # e agora adicionamos db_column=None para tentar evitar a consulta SQL.
    last_login = models.DateTimeField(null=True, blank=True, db_column=None)
    
    # is_superuser: Não mapeado para BD (db_column=None) para evitar o erro 1054
    is_superuser = models.BooleanField(default=False, db_column=None)
    
    # ------------------------------------------------------------------
    # CAMPO CRÍTICO DE CHAVE PRIMÁRIA
    # ------------------------------------------------------------------
    id_usuario = AutoField(primary_key=True, db_column='id_usuario', verbose_name="ID")
    
    # ------------------------------------------------------------------
    # CAMPOS CRÍTICOS PARA AUTENTICAÇÃO
    # ------------------------------------------------------------------
    # Seu campo de login principal
    cpf = models.CharField(max_length=11, unique=True, verbose_name="CPF")
    
    # O campo password deve ter este nome, se conecta à sua coluna 'senha_hash'
    password = models.CharField(
        max_length=128, 
        db_column='senha_hash', # Ponto crítico de correção!
        verbose_name="HashSenha"
    ) 
    
    # Campos de status necessários para autenticação e administração do Django
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    
    # ------------------------------------------------------------------
    # DEMAIS CAMPOS (Mapeados da sua tabela original)
    # ------------------------------------------------------------------
    nome = models.CharField(max_length=150, verbose_name="NomeCompleto")
    email = models.EmailField(max_length=50, unique=True, verbose_name="Email")
    
    rg = models.CharField(max_length=10, blank=True, null=True, verbose_name="RG")
    data_nascimento = models.DateField(blank=True, null=True, verbose_name="Data de Nascimento")
    telefone_celular = models.CharField(max_length=20, verbose_name="Telefone Celular")
    telefone_fixo = models.CharField(max_length=20, blank=True, null=True, verbose_name="Telefone Fixo")
    endereco_atual = models.CharField(max_length=255, blank=True, null=True, verbose_name="Endereço Atual")

    nome_pai = models.CharField(max_length=150, blank=True, null=True, verbose_name="Nome do Pai")
    nome_mae = models.CharField(max_length=150, blank=True, null=True, verbose_name="Nome da Mãe")
    
    peso = models.DecimalField(max_digits=5, decimal_places=2, blank=True, null=True, verbose_name="Peso (kg)")
    altura = models.DecimalField(max_digits=5, decimal_places=2, blank=True, null=True, verbose_name="Altura (m)")
    doenca_cronica = models.CharField(max_length=150, blank=True, null=True, verbose_name="Doença Crônica")
    # Corrige mapeamento para a coluna existente no banco 'deficiencia' (sem 'c' extra)
    deficencia = models.CharField(max_length=150, blank=True, null=True, db_column='deficiencia', verbose_name="Deficiência")
    
    data_criacao = models.DateTimeField(auto_now_add=True)
    data_atualizacao = models.DateTimeField(auto_now=True)
    
    # ------------------------------------------------------------------
    # CONFIGURAÇÕES DE AUTENTICAÇÃO (Obrigatórias)
    # ------------------------------------------------------------------
    USERNAME_FIELD = 'cpf'
    REQUIRED_FIELDS = ['nome', 'email'] 

    # Conecta o modelo ao nosso Custom Manager
    objects = CustomUserManager()

    # Métodos de permissão necessários (se você quiser usar o `has_perm` ou `has_module_perms`)
    def has_perm(self, perm, obj=None):
        return self.is_superuser # Implementação simplificada

    def has_module_perms(self, app_label):
        return self.is_superuser # Implementação simplificada
    
    def __str__(self):
        return self.cpf
    
    class Meta:
        # Garante que ele se conecta à tabela existente no MySQL
        db_table = 'usuarios'
        verbose_name = 'usuario'
        verbose_name_plural = 'usuarios'