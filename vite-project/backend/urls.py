"""
URL configuration for backend project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
#from django.urls import path
from django.urls import path, include, re_path
from django.views.generic import TemplateView
from . import views
#urlpatterns = [
   # path('admin/', admin.site.urls),
#]

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api-auth/', include ('rest_framework.urls')),
    # Mude: Remova o "include" e defina o caminho completo da API.
    # O caminho será agora http://localhost:8000/api/teste/
   path('api/login/', views.LoginView.as_view(), name='login'),
    
    # Exemplo da sua View de Teste
    path('api/teste/', views.TesteConexaoView.as_view(), name='teste_conexao'),
]
re_path(r'^(?!api/).*$', TemplateView.as_view(template_name='index.html')),