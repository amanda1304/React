from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager
from django.db.models import AutoField

class CustomReceitaManager(BaseUserManager):

    def create_receita(self, id_usuario, medicamento, dosagem, instrucoes,
                       data_emissao, validade, status, **extra_fields):
        if not id_usuario:
            raise ValueError('O campo ID do usuário deve ser definido para a receita.')
        
        receita = self.model(
            id_usuario=id_usuario,
            medicamento=medicamento,
            dosagem=dosagem,
            instrucoes=instrucoes,
            data_emissao=data_emissao,
            validade=validade,
            status=status,
            **extra_fields
        )
        receita.save(using=self._db)
        return receita
class Receita:
    """
    Representa uma receita médica com todos os campos da tabela 'receitas'.
    """
    def __init__(self, id_receita: int, id_usuario: int, medicamento: str, dosagem: str,
                 instrucoes: str, data_emissao: str, validade: str, status: str):
        
        self.id_receita = id_receita
        self.id_usuario = id_usuario
        self.medicamento = medicamento
        self.dosagem = dosagem
        self.instrucoes = instrucoes
        self.data_emissao = data_emissao # Usando string no formato 'YYYY-MM-DD' para simplicidade
        self.validade = validade         # Usando string no formato 'YYYY-MM-DD' para simplicidade
        self.status = status

    def __str__(self):
        """Retorna uma representação amigável do objeto."""
        return (f"Receita ID: {self.id_receita} | Usuário ID: {self.id_usuario}\n"
                f"  Medicamento: {self.medicamento} ({self.dosagem})\n"
                f"  Emissão: {self.data_emissao} | Validade: {self.validade} | Status: {self.status}\n")

    def to_dict(self) -> Dict:
        """Converte a receita para um dicionário (útil para JSON/API)."""
        return {
            'id_receita': self.id_receita,
            'id_usuario': self.id_usuario,
            'medicamento': self.medicamento,
            'dosagem': self.dosagem,
            'instrucoes': self.instrucoes,
            'data_emissao': self.data_emissao,
            'validade': self.validade,
            'status': self.status
        }
    
    class Meta:
    # Garante que ele se conecta à tabela existente no MySQL
        db_table = 'receitas'
        verbose_name = 'receita'
        verbose_name_plural = 'receitas'