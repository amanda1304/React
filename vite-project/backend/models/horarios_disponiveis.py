from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager
from django.db.models import AutoField

class CustomHorariosManager(BaseUserManager):
    def create_horario_disponivel(self, dia_semana, hora_inicio, hora_fim, **extra_fields):
        if not dia_semana:
            raise ValueError('O campo dia da semana deve ser definido para o horário disponível.')
        
        horario = self.model(
            dia_semana=dia_semana,
            hora_inicio=hora_inicio,
            hora_fim=hora_fim,
            **extra_fields
        )
        horario.save(using=self._db)
        return horario
# ===============================================   

class HorariosDisponiveis(models.Model):
    """ Modelo de horários disponíveis para agendamentos.
    """
    id_horario = AutoField(primary_key=True, db_column='id_horario', verbose_name="ID Horário")
    dia_semana = models.CharField(max_length=20, verbose_name="Dia da Semana")
    hora_inicio = models.TimeField(verbose_name="Hora de Início")
    hora_fim = models.TimeField(verbose_name="Hora de Fim")


    class Meta:
        # Garante que ele se conecta à tabela existente no MySQL
        db_table = 'horarios_disponiveis'
        verbose_name = 'horario_disponivel'
        verbose_name_plural = 'horarios_disponiveis'