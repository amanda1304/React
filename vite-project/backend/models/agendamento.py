from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager
from django.db.models import AutoField


# ===============================================
# 1. Custom Manager (Obrigatório para AbstractBaseUser)
# ===============================================
class CustomAgendaManager(BaseUserManager):

    def create_agendamento(self, paciente_nome, data_hora, **extra_fields):
        if not paciente_nome:
            raise ValueError('O campo nome do paciente deve ser definido para o agendamento.')
        
        agendamento = self.model(paciente_nome=paciente_nome, data_hora=data_hora, **extra_fields)
        agendamento.save(using=self._db)
        return agendamento
# ===============================================
# 2. Modelo de Agendamento
# ===============================================
class Agendamento(models.Model):
    """ Modelo de agendamento para consultas médicas.
    """
    id_agendamento = AutoField(primary_key=True, db_column='id_agendamento', verbose_name="ID Agendamento")
    paciente_nome = models.CharField(max_length=150, verbose_name="Nome do Paciente")
    horario = models.DateTimeField(verbose_name="Data e Hora do Agendamento")
    tipo_consulta = models.CharField(max_length=100, verbose_name="Especialidade Médica")
    status = models.DateTimeField(auto_now_add=True, verbose_name="status do agendamento")

    class Meta:
        # Garante que ele se conecta à tabela existente no MySQL
        db_table = 'agendamentos'
        verbose_name = 'agendamento'
        verbose_name_plural = 'agendamentos'