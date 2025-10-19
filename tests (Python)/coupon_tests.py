'''
-------------------------------------------
 coupon_tests.py

 pruebas unitarias para endpoint de validacion de cupones,
 utilizando el framework unittest de Python.

 2 casos de prueba:
    1. Validación exitosa de cupón existente.
    2. Validación fallida para cupón inexistente.

 Fecha: 18-Oct-2025
 Autores: Equipo 2 - Gpo 401
---------------------------------------------
'''

import unittest
import requests
import time
import json

# URL base de la API
BASE_URL = "https://bj-api.site"

# Códigos de cupones para pruebas
VALID_COUPON_CODE = "OXXO30HIELO"
INVALID_COUPON_CODE = "CUPONFAKE"

class TestCouponValidationEndpoints(unittest.TestCase):
    
    def setUp(self):
        """Configuración inicial antes de cada prueba."""
        self.validate_base_url = f"{BASE_URL}/beneficioJoven/validar"
        self.headers = {"Content-Type": "application/json"}
    
    def test_validate_coupon_success(self):
        """Prueba de validación exitosa de cupón existente."""
        time.sleep(0.5)  # Retraso de 0.5 segundos
        validate_url = f"{self.validate_base_url}/{VALID_COUPON_CODE}"
        response = requests.get(validate_url)
        self.assertEqual(response.status_code, 200, "Validación exitosa debe retornar código 200")
        result = response.json()
        self.assertIn('id', result, "Debe retornar detalles del cupón válido (al menos 'id')")
        print(f"Validación exitosa: {json.dumps(result, indent=2)}")
    
    def test_validate_coupon_failure(self):
        """Prueba de validación fallida para cupón inexistente."""
        time.sleep(0.5)  # Retraso de 0.5 segundos
        validate_url = f"{self.validate_base_url}/{INVALID_COUPON_CODE}"
        response = requests.get(validate_url)
        self.assertEqual(response.status_code, 404, "Validación fallida debe retornar código 404")
        result = response.json()
        self.assertIn("Cupón no encontrado", str(result.get('error', '')), "Debe retornar error de cupón no encontrado")
        print(f"Validación fallida: Status {response.status_code}, {json.dumps(result, indent=2)}")

if __name__ == "__main__":
    unittest.main(verbosity=2)