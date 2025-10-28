from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager
from django.db.models import AutoField

class CustomsubservicoManager(BaseUserManager):
    def create_subservico(self, id_tipo, nome_subservico, **extra_fields):
        if not nome_subservico:
            raise ValueError('O campo nome do subserviço deve ser definido para o subserviço.')
        
        subservico = self.model(
            id_tipo=id_tipo,
            nome_subservico=nome_subservico,
            **extra_fields
        )
        subservico.save(using=self._db)
        return subservico
# ===============================================
class Subservico(models.Model):
    """ Modelo de subserviços oferecidos.
    """
    def __init__(self, id_subtipo, id_tipo: int, nome_servico: str):

        self.id_subtipo = id_subtipo
        self.id_tipo = id_tipo
        self.nome_servico = nome_servico
        
    def __str__(self):
        """Retorna uma representação amigável do objeto."""
        return (f" Subtipo ID{self.id_subtipo} Tipo ID: {self.id_tipo} | Nome: {self.nome_servico}")
    def to_dict(self) -> Dict:
        """Converte para um dicionário (útil para JSON/API)."""
        return {
            'id_subtipo': self.id_subtipo,
            'id_tipo': self.id_tipo,
            'nome_servico': self.nome_servico,
        }
    class Meta:
        # Garante que ele se conecta à tabela existente no MySQL
        db_table = 'subservicos'
        verbose_name = 'subservico'
        verbose_name_plural = 'subservicos'