from django.test import TestCase
from rest_framework.test import APIClient
from backend.models.usuario import UsuarioUnificado


class LoginAPITest(TestCase):
    def setUp(self):
        self.client = APIClient()
        # criar usuário de teste
        self.cpf = '55555555555'
        self.password = 'SenhaTeste@123'
        u, created = UsuarioUnificado.objects.get_or_create(
            cpf=self.cpf,
            defaults={'nome': 'Teste Unit', 'email': 'teste.unit@example.com'}
        )
        u.set_password(self.password)
        u.is_active = True
        u.save()

    def test_login_returns_token(self):
        resp = self.client.post('/api/login/', {'cpf': self.cpf, 'password': self.password}, format='json')
        self.assertEqual(resp.status_code, 200)
        data = resp.json()
        self.assertIn('token', data)
        self.assertIn('id_usuario', data)
