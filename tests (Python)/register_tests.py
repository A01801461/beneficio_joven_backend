import unittest
import requests
import time
from datetime import datetime, timedelta

# URL base de la API
BASE_URL = "https://bj-api.site"

# Credenciales duplicadas existentes
EXISTING_EMAIL = "perezjuan@example.com"  # Corregido de @ejemplo.com a @example.com
EXISTING_CURP = "PEMJ123456HDFRRN01"
EXISTING_PASSWORD = "Cupones123."

# Datos para registro duplicado de email (cualquier rol, pero usamos user para consistencia)
DUPLICATE_EMAIL_DATA = {
    "email": EXISTING_EMAIL,
    "password": "TestPass123",
    "role": "user",
    "profileData": {
        "full_name": "Test Duplicate",
        "curp": "NEWCURP123456HDFRRN01",
        "birth_date": "2000-01-01",
        "municipality": "CDMX"
    }
}

# Datos para registro duplicado de CURP (nuevo email, rol user)
DUPLICATE_CURP_DATA = {
    "email": "newtest2@example.com",  # Nuevo email para evitar conflictos
    "password": "TestPass123",
    "role": "user",
    "profileData": {
        "full_name": "Test Duplicate CURP",
        "curp": EXISTING_CURP,
        "birth_date": "2000-01-01",
        "municipality": "CDMX"
    }
}

# Calcular fecha de nacimiento para Ana Sofía de 20 años (aprox, basado en fecha actual 2025-10-18)
today = datetime(2025, 10, 18)
birth_date_20_years_ago = today.replace(year=today.year - 20).strftime('%Y-%m-%d')

# Datos para nuevo usuario Ana Sofía (nuevas credenciales)
NEW_USER_DATA = {
    "email": "anasofiaramz@example.com",  # Nuevo email
    "password": "SofiaPass123!",
    "role": "user",
    "profileData": {
        "full_name": "Ana Sofía Ramírez",
        "curp": "RASA050101HNEWMM01",  # Nuevo CURP ficticio
        "birth_date": birth_date_20_years_ago,
        "municipality": "Atizapan"
    }
}

# Datos para nuevo comercio ficticio (nuevas credenciales)
NEW_MERCHANT_DATA = {
    "email": "comercio.nuevo@example.com",  # Nuevo email
    "password": "NewMerchant123",
    "role": "merchant",
    "profileData": {
        "merchant_name": "Comercio Nuevo S.A.",
        "description": "Un nuevo comercio para pruebas",
        "logo_url": "https://example.com/newlogo.png",
        "merchant_type": "tienda"
    }
}

# Datos para nuevo admin (nuevas credenciales, evitando correos prohibidos)
NEW_ADMIN_DATA = {
    "email": "admin.nuevo2@example.com",  # Nuevo email
    "password": "NewAdmin123",
    "role": "admin",
    "profileData": {
        "full_name": "Admin Nuevo Dos",
        "is_super_admin": False
    }
}

# Clase de pruebas para endpoint de registro
class TestRegisterEndpoints(unittest.TestCase):
    
    def setUp(self):
        """Configuración inicial antes de cada prueba."""
        self.register_url = f"{BASE_URL}/beneficioJoven/auth/register"
        self.headers = {"Content-Type": "application/json"}
    
    # Test case: registro fallido por email duplicado
    def test_register_duplicate_email(self):
        """Prueba de registro con email duplicado."""
        time.sleep(0.5)  # Retraso de 0.5 segundos
        response = requests.post(self.register_url, json=DUPLICATE_EMAIL_DATA, headers=self.headers)
        if response.status_code != 409:
            print(f"Respuesta completa del servidor: {response.text}")
        self.assertEqual(response.status_code, 409, "El registro con email duplicado debe retornar código 409")
        result = response.json()
        self.assertIn("Email ya registrado", str(result.get('error', '')), "Debe retornar el error esperado para email duplicado")
        print(f"Error esperado en email duplicado: {result.get('error', '')}")
    
    # Test case: registro fallido por CURP duplicado
    def test_register_duplicate_curp(self):
        """Prueba de registro con CURP duplicado para rol user."""
        time.sleep(0.5)  # Retraso de 0.5 segundos
        response = requests.post(self.register_url, json=DUPLICATE_CURP_DATA, headers=self.headers)
        self.assertEqual(response.status_code, 409, "El registro con CURP duplicado debe retornar código 409")
        result = response.json()
        self.assertIn("CURP ya registrado", str(result.get('error', '')), "Debe retornar el error esperado para CURP duplicado")
        print(f"Error esperado en CURP duplicado: {result.get('error', '')}")
    
    # Test case: registro exitoso para nuevo usuario
    def test_register_new_user(self):
        """Prueba de registro exitoso para nuevo usuario Ana Sofía."""
        time.sleep(0.5)  # Retraso de 0.5 segundos
        response = requests.post(self.register_url, json=NEW_USER_DATA, headers=self.headers)
        self.assertEqual(response.status_code, 201, "El registro exitoso debe retornar código 201")
        result = response.json()
        self.assertIn("Usuario registrado", str(result.get('message', '')), "Debe retornar mensaje de éxito")
        user_id = result.get('userId')
        self.assertIsNotNone(user_id, "El registro exitoso debe retornar un userId")
        print(f"Registro exitoso para usuario: userId = {user_id}")
    
    # Test case: registro exitoso para nuevo comercio
    def test_register_new_merchant(self):
        """Prueba de registro exitoso para nuevo comercio ficticio."""
        time.sleep(0.5)  # Retraso de 0.5 segundos
        response = requests.post(self.register_url, json=NEW_MERCHANT_DATA, headers=self.headers)
        self.assertEqual(response.status_code, 201, "El registro exitoso debe retornar código 201")
        result = response.json()
        self.assertIn("Usuario registrado", str(result.get('message', '')), "Debe retornar mensaje de éxito")
        user_id = result.get('userId')
        self.assertIsNotNone(user_id, "El registro exitoso debe retornar un userId")
        print(f"Registro exitoso para comercio: userId = {user_id}")
    
    # Test case: registro exitoso para nuevo admin
    def test_register_new_admin(self):
        """Prueba de registro exitoso para nuevo admin."""
        time.sleep(0.5)  # Retraso de 0.5 segundos
        response = requests.post(self.register_url, json=NEW_ADMIN_DATA, headers=self.headers)
        self.assertEqual(response.status_code, 201, "El registro exitoso debe retornar código 201")
        result = response.json()
        self.assertIn("Usuario registrado", str(result.get('message', '')), "Debe retornar mensaje de éxito")
        user_id = result.get('userId')
        self.assertIsNotNone(user_id, "El registro exitoso debe retornar un userId")
        print(f"Registro exitoso para admin: userId = {user_id}")

# Flujo principal para ejecutar las pruebas
if __name__ == "__main__":
    unittest.main(verbosity=2)