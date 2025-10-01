# 📱 Beneficio Joven – Repo 3: Servidor Backend

Este repositorio contiene el servidor backend del sistema de cupones para el programa **Beneficio Joven** del Gobierno Municipal de Atizapán de Zaragoza.  
El backend es el núcleo de la lógica de negocio, gestionando la conexión a la base de datos, autenticación de usuarios, creación y redención de cupones, y la interacción con la aplicación móvil y el panel de administración.

El proyecto busca impulsar la participación juvenil y facilitar el acceso a beneficios que promuevan el bienestar, la economía local y las oportunidades para los jóvenes de Atizapán.

---

## 🌟 Componentes principales del proyecto completo 

1. **Aplicación móvil (Kotlin – Android)**

   - Registro e inicio de sesión de los jóvenes beneficiarios.
   - Consulta de cupones y promociones disponibles.
   - Canje digital mediante código QR o clave única.
   - Perfil personal con historial de cupones utilizados.

2. **Panel de administración (HTML, CSS, JS)**

   - Gestión de usuarios (jóvenes registrados).
   - Registro y administración de comercios participantes.
   - Creación, edición y seguimiento de cupones/promociones.
   - Reportes y estadísticas de uso para el municipio.
  
3. **Servidor Backend (API + lógica de negocio)**

   - Se encarga de la autenticación de usuarios y roles.
   - Administra el ciclo de vida de los cupones (creación, validación, redención).
   - Expone un API REST para que lo consuman la aplicación móvil y los paneles web.

---

## 🚀 Detalles del Backend

El backend está construido con **Node.js** y **Express.js**, utilizando una base de datos **MySQL** (compatible con XAMPP para desarrollo local) para almacenar información sobre usuarios, comercios, cupones y redenciones. Está diseñado con buenas prácticas para ser escalable, seguro y fácil de migrar a entornos como **AWS** (usando RDS para la base de datos y EC2/Lambda para el servidor).

### **Características principales**
- **Autenticación segura**: Usa JSON Web Tokens (JWT) para autenticar usuarios y proteger endpoints sensibles. Soporta roles (`user`, `merchant`, `admin`, `super_admin`) con permisos diferenciados.
- **Gestión de usuarios**: Registro, login, creación y listado de usuarios (para admins).
- **Gestión de cupones**: Creación (por comercios), listado (público) y redención (por usuarios).
- **Base de datos optimizada**: Tablas con índices y claves foráneas para garantizar rendimiento y consistencia (e.g., `users`, `coupons`, `user_coupons`).
- **Acceso en red local**: Configurado para ser accesible desde cualquier dispositivo en la red WiFi local, ideal para pruebas colaborativas.
- **Preparado para AWS**: Estructurado para migrar fácilmente a AWS RDS (base de datos) y S3 (para subir QR codes o logos).

### **Endpoints principales**
| Método | Endpoint                  | Descripción                              | Requiere autenticación? |
|--------|---------------------------|------------------------------------------|------------------------|
| POST   | `/beneficioJoven/auth/register`      | Registra un nuevo usuario (cualquier rol) | No                    |
| POST   | `/beneficioJoven/auth/login`         | Inicia sesión y devuelve un token JWT    | No                     |
| POST   | `/beneficioJoven/users`              | Crea un nuevo usuario (solo admins)      | Sí (admin)             |
| GET    | `/beneficioJoven/users`              | Lista todos los usuarios (solo admins)   | Sí (admin)             |
| GET    | `/beneficioJoven/allusers`           | Lista todos los usuarios (publico - pruebas)   | No               |
| GET    | `/beneficioJoven/jovenes`            | Lista los jovenes (publico - pruebas)    | No                     |
| GET    | `/beneficioJoven/merchants`          | Lista los comercios (publico - pruebas)  | No                     |
| GET    | `/beneficioJoven/admins`             | Lista los admins (publico - pruebas)     | No                     |
| POST   | `/beneficioJoven/coupons`            | Crea un nuevo cupón (solo admins)        | Sí (admin)             |
| GET    | `/beneficioJoven/coupons`            | Lista cupones válidos (público)          | No                     |
| GET    | `/beneficioJoven/coupons`            | Lista cupones válidos (público)          | No                     |
| GET    | `/beneficioJoven/coupons/merchant/:id` | Lista cupones por comercio             | No                     |
| GET    | `/beneficioJoven/users/:id/coupons`    | Lista cupones por usuario (pertenencia)     | No                |
| POST   | `/beneficioJoven/coupons/redeem`     | Canjea un cupón (solo merchant)          | Sí (merchant)          |

### **Cómo probar el backend localmente**
1. **Requisitos**:
   - Instala **Node.js** (v18+).
   - Instala **XAMPP** con MySQL.
   - Crea la base de datos `beneficioJoven` en phpMyAdmin y ejecuta las queries SQL proporcionadas.

2. **Configuración**:
   - Clona este repositorio.
   - Instala dependencias: `npm install express mysql2 bcryptjs jsonwebtoken dotenv body-parser cors`.
   - Configura el archivo `.env` con las credenciales de MySQL (por default: `DB_USER=root`, `DB_PASSWORD=` en XAMPP).
   - Corre el servidor: `node app.js`.

3. **Pruebas**:
   - Usa **Postman** o **curl** para probar los endpoints.
   - Ejemplo para listar cupones:
     ```bash
     curl http://localhost:3000/beneficioJoven/coupons
     ```
   - Ejemplo para crear un cupón (requiere token de merchant):
     ```bash
     curl -X POST http://localhost:3000/beneficioJoven/coupons \
     -H "Content-Type: application/json" \
     -H "Authorization: Bearer <tu_token>" \
     -d '{"code":"PROMO20","title":"20% off","description":"Válido en tiendas","discount_type":"Porcentaje","valid_until":"2025-12-31","usage_limit":50,"qr_code_url":"http://example.com/qr2.png"}'
     ```
   - Accede desde la red local con la IP que aparece al correr el servidor (e.g., `http://192.168.1.100:3000`).

### **Estructura del código**
- **`app.js`**: Inicia el servidor y configura rutas.
- **`config/db.js`**: Conexión a MySQL.
- **`routes/`**: Define las URLs del API.
- **`controllers/`**: Lógica de negocio para cada endpoint.
- **`middleware/auth.js`**: Verifica tokens JWT.

### **Próximos pasos**
- **Integración con AWS**: Migrar la base de datos a RDS y usar S3 para almacenar QR codes y logos.
- **Expansión de endpoints**: Agregar filtros para cupones (por comercio o tipo) y reportes avanzados.
- **Pruebas colaborativas**: Usar la homepage del API (ver abajo) para que los colaboradores exploren los endpoints.

---

## 📄 Licencia

Este proyecto es propiedad del **Gobierno Municipal de Atizapán de Zaragoza**.  
Su uso está limitado a fines institucionales y no puede ser distribuido ni comercializado sin autorización expresa.