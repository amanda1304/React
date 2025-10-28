from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager
from django.db.models import AutoField

# ===============================================

class CustomTipoServiçosManager(BaseUserManager):
    def create_tipo_servico(self, nome_servico, descricao_servico, **extra_fields):
        if not nome_servico:
            raise ValueError('O campo nome do serviço deve ser definido para o tipo de serviço.')
        
        tipo_servico = self.model(
            nome_servico=nome_servico,
            descricao_servico=descricao_servico,
            **extra_fields
        )
        tipo_servico.save(using=self._db)
        return tipo_servico
# ===============================================

class TipoServicos(models.Model):
    """ Modelo de tipo de serviços oferecidos.
    """
    def __init__(self, id_tipo: int, nome_servico: str):
        
        self.id_tipo = id_tipo
        self.nome_servico = nome_servico
        
    def __str__(self):
        """Retorna uma representação amigável do objeto."""
        return (f"Tipo ID: {self.id_tipo} | Nome: {self.nome_servico}")
    def to_dict(self) -> Dict:
        """Converte para um dicionário (útil para JSON/API)."""
        return {
            'id_tipo': self.id_tipo,
            'nome_servico': self.nome_servico,
        }
    class Meta:
        # Garante que ele se conecta à tabela existente no MySQL
        db_table = 'tipo_servicos'
        verbose_name = 'tipo_servico'
        verbose_name_plural = 'tipo_servicos'