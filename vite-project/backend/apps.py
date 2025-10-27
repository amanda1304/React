from django.apps import AppConfig

class BackendConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'backend'
    # Adicione ou modifique o verbose_name se quiser um nome de exibição melhor
    verbose_name = 'backend' 
