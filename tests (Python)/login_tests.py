import unittest
import requests
import json

# URL base de la API
BASE_URL = "https://bj-api.site"

# Credenciales correctas
CORRECT_EMAIL = "perezjuan@example.com"
CORRECT_PASSWORD = "Cupones123."

# Variación para email incorrecto (pequeño cambio para forzar error de email no existe)
WRONG_EMAIL = "perezjuan@ejemplo.com"  # Cambio en el dominio para que no exista
WRONG_PASSWORD = "Cupones123"  # Pequeño cambio: quitar el punto final para forzar error de contraseña inválida

class TestLoginEndpoints(unittest.TestCase):
    
    def setUp(self):
        """Configuración inicial antes de cada prueba."""
        self.login_url = f"{BASE_URL}/beneficioJoven/auth/login"
    
    # Test case: Login exitoso (credenciales correctas)
    def test_login_exitoso(self):
        """Prueba de login con credenciales correctas."""
        login_data = {
            "email": CORRECT_EMAIL,
            "password": CORRECT_PASSWORD
        }
        response = requests.post(self.login_url, json=login_data)
        self.assertEqual(response.status_code, 200, "El login exitoso debe retornar código 200")
        result = response.json()
        token = result.get('token')
        self.assertIsNotNone(token, "El login exitoso debe retornar un token")
        print(f"Login exitoso: Token recibido - {'Sí' if token else 'No'}")
    
    # Test case: cuenta inexistente (email incorrecto)
    def test_login_email_incorrecto(self):
        """Prueba de login con email incorrecto para forzar error 'no existe un cuenta asociada al Email'."""
        login_data = {
            "email": WRONG_EMAIL,
            "password": CORRECT_PASSWORD
        }
        response = requests.post(self.login_url, json=login_data)
        self.assertNotEqual(response.status_code, 200, "El login con email incorrecto no debe ser exitoso")
        result = response.json()
        error_msg = str(result.get('error', ''))
        self.assertIn("no existe un cuenta asociada al Email", error_msg, "Debe retornar el error esperado para email no existente")
        print(f"Error esperado: {error_msg}")
    
    # Test case: password incorrecto
    def test_login_contrasena_incorrecta(self):
        """Prueba de login con contraseña incorrecta para forzar error 'Contraseña inválida'."""
        login_data = {
            "email": CORRECT_EMAIL,
            "password": WRONG_PASSWORD
        }
        response = requests.post(self.login_url, json=login_data)
        self.assertNotEqual(response.status_code, 200, "El login con contraseña incorrecta no debe ser exitoso")
        result = response.json()
        error_msg = str(result.get('error', ''))
        self.assertIn("Contraseña inválida", error_msg, "Debe retornar el error esperado para contraseña inválida")
        print(f"Error esperado: {error_msg}")

# Flujo principal para ejecutar las pruebas
if __name__ == "__main__":
    unittest.main(verbosity=2)