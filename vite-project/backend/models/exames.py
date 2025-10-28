from django.db import models
from typing import Dict
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager
from django.db.models import AutoField

# ===============================================
# 1. Custom Manager (Obrigatório para AbstractBaseUser)
# ===============================================
class CustomExameManager(BaseUserManager):

    def create_exame(self, id_usuario, tipo_exame, data_exame, arquivo_resultado,
                     descricao, status, **extra_fields):
        if not id_usuario:
            raise ValueError('O campo ID do usuário deve ser definido para o exame.')
        
        exame = self.model(
            id_usuario=id_usuario,
            tipo_exame=tipo_exame,
            data_exame=data_exame,
            arquivo_resultado=arquivo_resultado,
            descricao=descricao,
            status=status,
            **extra_fields
        )
        exame.save(using=self._db)
        return exame
class Exame:
    """
    Representa um exame médico com todos os campos da tabela 'exames'.
    """
    def __init__(self, id_exame: int, id_usuario: int, tipo_exame: str,
                 data_exame: str, arquivo_resultado: str, descricao: str,
                 status: str):
        
        self.id_exame = id_exame
        self.id_usuario = id_usuario
        self.tipo_exame = tipo_exame
        self.data_exame = data_exame # Usando string no formato 'YYYY-MM-DD' para simplicidade
        self.arquivo_resultado = arquivo_resultado
        self.descricao = descricao
        self.status = status

    def __str__(self):
        """Retorna uma representação amigável do objeto."""
        return (f"Exame ID: {self.id_exame} | Usuário ID: {self.id_usuario}\n"
                f"  Tipo: {self.tipo_exame} | Data: {self.data_exame}\n"
                f"  Descricao: {self.descricao} | Status: {self.status}\n")

    def to_dict(self) -> Dict:
        """Converte o exame para um dicionário (útil para JSON/API)."""
        return {
            'id_exame': self.id_exame,
            'id_usuario': self.id_usuario,
            'tipo_exame': self.tipo_exame,
            'data_exame': self.data_exame,
            'arquivo_resultado': self.arquivo_resultado,
            'descricao': self.descricao,
            'status': self.status
        }
    
    class Meta:
        # Garante que ele se conecta à tabela existente no MySQL
        db_table = 'exames_laudos'
        verbose_name = 'exame_laudo'
        verbose_name_plural = 'exames_laudos'