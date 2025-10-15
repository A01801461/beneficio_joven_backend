=# 📱 Beneficio Joven – Repo 3: Servidor Backend

Este repositorio contiene el servidor backend del sistema de cupones para el programa **Beneficio Joven** del Gobierno Municipal de Atizapán de Zaragoza.  
El backend es el núcleo de la lógica de negocio, gestionando la conexión a la base de datos, autenticación de usuarios, creación y redención de cupones, y la interacción con la aplicación móvil y el panel de administración.

El proyecto busca impulsar la participación juvenil y facilitar el acceso a beneficios que promuevan el bienestar, la economía local y las oportunidades para los jóvenes de Atizapán.

---

## 🌟 Componentes principales del proyecto completo 

1. **Aplicación móvil (Kotlin – Android)**

   - Codigo: https://github.com/PeritiaCodex/BeneficioJoven
   - Registro e inicio de sesión de los jóvenes beneficiarios.
   - Consulta de cupones y promociones disponibles.
   - Canje digital mediante código QR o clave única.
   - Perfil personal con historial de cupones utilizados.

2. **Panel de administración (HTML, CSS, JS)**

   - Codigo: https://github.com/A01801461/beneficio_joven_paneles
   - Gestión de usuarios (jóvenes registrados).
   - Registro y administración de comercios participantes.
   - Creación, edición y seguimiento de cupones/promociones.
   - Reportes y estadísticas de uso para el municipio.
  
3. **Servidor Backend (API + lógica de negocio)**

   - Codigo: https://github.com/A01801461/beneficio_joven_backend
   - Alojado en https://bj-api.site
   - Se encarga de la autenticación de usuarios y roles.
   - Administra el ciclo de vida de los cupones (creación, validación, redención).
   - Expone un API REST para que lo consuman la aplicación móvil y los paneles web.

---

## 🚀 Detalles del Backend

El backend está construido con **Node.js** y **Express.js**, utilizando una base de datos **MySQL** para almacenar información sobre usuarios, comercios, cupones, redenciones, etc. Está diseñado con buenas prácticas para ser escalable, seguro y fácil de migrar a entornos como **AWS**, o un **VPS** de cualquier otro proveedor, como donde esta alojado actualmente en https://bj-api.site .

### **Características principales**
- **Autenticación segura**: Usa JSON Web Tokens (JWT) para autenticar usuarios y proteger endpoints sensibles. Soporta roles (`user`, `merchant`, `admin`, `super_admin`) con permisos diferenciados.
- **Gestión de usuarios**: Registro, login, creación y listado de usuarios (para admins).
- **Gestión de cupones**: Creación, listado y redención.
- **Base de datos optimizada**: Tablas con índices y claves foráneas para garantizar rendimiento y consistencia (e.g., `users`, `coupons`, `user_coupons`).
- **Acceso en red local**: Configurado para ser provado localmente facilmente con XAMMP.
- **Preparado para deploy**: Estructurado para migrar fácilmente a un VPS u otro entorno.

### **Endpoints principales**
| Método | Endpoint                  | Descripción                              |
|--------|---------------------------|------------------------------------------|
| GET    | `/beneficioJoven/stats`      | Estadistidisticas generales del sistema |
| POST   | `/beneficioJoven/auth/register`      | Registra un nuevo usuario (cualquier rol) |
| POST   | `/beneficioJoven/auth/login`         | Inicia sesión y devuelve un token JWT    |
| POST   | `/beneficioJoven/users`              | Crea un nuevo usuario      |
| GET    | `/beneficioJoven/users`              | Lista todos los usuarios   |
| GET    | `/beneficioJoven/allusers`           | Lista todos los usuarios   |
| GET    | `/beneficioJoven/jovenes`            | Lista los jovenes    |
| GET    | `/beneficioJoven/merchants`          | Lista los comercios  |
| GET    | `/beneficioJoven/admins`             | Lista los admins     |
| POST   | `/beneficioJoven/coupons`            | Crea un nuevo cupón           |
| GET    | `/beneficioJoven/coupons`            | Lista cupones válidos         |
| GET    | `/beneficioJoven/coupons`            | Lista cupones válidos         |
| GET    | `/beneficioJoven/coupons/merchant/:id` | Lista cupones por comercio    |
| GET    | `/beneficioJoven/users/:id/coupons`    | Lista cupones por usuario     |
| POST   | `/beneficioJoven/validar/:code`     | Validar existencia de un cupón   |
| POST   | `/beneficioJoven/coupons/redeem`     | Canjea un cupón                 |
| POST   | `/beneficioJoven/coupons/like`       | likear/Dislikear un cupón (Toggle)  |
| DELETE | `/beneficioJoven/coupons/:id`        | borra un cupón                  |

### **Cómo probar el backend localmente **

1. **Requisitos**:
   - Instala **Node.js** (v18+).
   - Instala **XAMPP** con MySQL.
   - Crea la base de datos `beneficioJoven` en phpMyAdmin y ejecuta las queries SQL proporcionadas.

2. **Configuración**:
   - Clona este repositorio.
   - Instala dependencias: `npm install express mysql2 bcryptjs jsonwebtoken dotenv body-parser cors joi qrcode`.
   - Configura el archivo `.env` con las credenciales de MySQL (por default: `DB_USER=root`, `DB_PASSWORD=` en XAMPP).
   - Corre el servidor: `node app.js`.

3. **Pruebas**:
   - Usa el comando **curl** para probar los endpoints.
   - Ejemplo para listar cupones:
     ```bash
     curl http://localhost:3000/beneficioJoven/coupons
     ```
   - Accede desde la red local con la IP que aparece al correr el servidor para ver mas info del API.

### **Estructura del código**
- **`app.js`**: Inicia el servidor y configura rutas.
- **`config/db.js`**: Conexión a MySQL.
- **`routes/`**: Define las URLs del API.
- **`controllers/`**: Lógica de negocio para cada endpoint.
- **`middleware/auth.js`**: Verifica tokens JWT y roles.

---

## 🔒 Seguridad y Autenticación

El sistema cuenta con una infraestructura de autenticación y control de acceso completa, diseñada para garantizar la seguridad de los datos y la integridad de las operaciones.  
Sin embargo, **por motivos de pruebas y desarrollo**, las medidas de seguridad no se encuentran activas en todos los endpoints de la versión actualmente desplegada ni del repositorio público.  
Esto permite que las aplicaciones cliente (móvil y panel) puedan realizar pruebas funcionales sin requerir tokens válidos o usuarios reales.  

### ⚙️ Implementaciones de seguridad incluidas en el código

Aunque no todas estén activas, el backend **ya incluye la lógica completa** para:
- Autenticación basada en JWT (JSON Web Tokens)  
- Gestión de sesiones y expiración de tokens 
- Validación de roles (`user`, `merchant`, `admin` o `super_admin`)
- Encriptación de contraseñas (Todas las contraseñas se cifran con **bcrypt** antes de ir a la BD)
- Validación de datos y sanitización de entrada (Uso de **Joi** y middleware de validación para evitar inyecciones SQL y datos corruptos.) 
- Buenas prácticas de CORS y variables de entorno (Configuración segura mediante `.env`)

### ⚠️ Estado actual (versión de pruebas)

- Los endpoints en `https://bj-api.site` y el código del repositorio **usan datos ficticios** para proteger la información real.  
- La **verificación de tokens y roles** está desactivada temporalmente en la mayoría de rutas para facilitar la integración y pruebas con los clientes móviles y web.  
- En entornos de producción o cuando se migre a infraestructura oficial, **la capa de seguridad se puede reactivar muy fácilmente** habilitando el middleware `auth.js` en las rutas correspondientes.

---

## 📄 Licencia

Este proyecto es propiedad del **Gobierno Municipal de Atizapán de Zaragoza**.  
Su uso está limitado a fines institucionales y no puede ser distribuido ni comercializado sin autorización expresa.
