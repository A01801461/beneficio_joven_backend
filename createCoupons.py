import requests
import json

# Configuración base (sin auth para pruebas)
URL_BASE = "http://localhost:3000/beneficioJoven/coupons"
HEADERS = {
    "Content-Type": "application/json"
    # Sin Authorization por ahora
}

def crear_cupón(datos):
    response = requests.post(URL_BASE, headers=HEADERS, data=json.dumps(datos))
    if response.status_code == 201:
        print(f"✅ Cupón creado: {datos['code']} (ID: {response.json().get('couponId')})")
    else:
        print(f"❌ Error: {response.status_code} - {response.text}")
    return response

# Lista de cupones
cupones = [

    {
        "code": "PROMO20",
        "title": "20% off",
        "description": "20% off en tiendas",
        "discount_type": "Porcentaje",
        "merchant_id": 3,
        "valid_until": "2025-12-31",
        "usage_limit": 50
    },
    {
        "code": "PROMO30",
        "title": "30% off frutas",
        "description": "30% off en todas las frutas",
        "discount_type": "Porcentaje",
        "merchant_id": 3,
        "valid_until": "2025-12-31",
        "usage_limit": 50
    }
]

if __name__ == "__main__":
    print("Subiendo cupones (modo pruebas)...")
    for cupon in cupones:
        crear_cupón(cupon)
    print("¡Listo!")
