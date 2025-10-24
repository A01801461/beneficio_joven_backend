# 📱 Beneficio Joven – Repo 3: Servidor Backend

Este repositorio contiene el servidor backend del sistema de cupones para el programa **Beneficio Joven** del Gobierno Municipal de Atizapán de Zaragoza.  
El backend es el núcleo de la lógica de negocio, gestionando la conexión a la base de datos, autenticación de usuarios, creación y redención de cupones, y la interacción con la aplicación móvil y el panel de administración.

El proyecto busca impulsar la participación juvenil y facilitar el acceso a beneficios que promuevan el bienestar, la economía local y las oportunidades para los jóvenes de Atizapán.

----------

## 🌟 Componentes principales del proyecto completo

1.  **Aplicación móvil (Kotlin – Android)** ← _este repo_
    
    -   Código: [https://github.com/PeritiaCodex/BeneficioJoven](https://github.com/PeritiaCodex/BeneficioJoven)
        
    -   Registro e inicio de sesión.
        
    -   Consulta de cupones y promociones disponibles.
        
    -   Canje digital mediante **QR** o **clave única**.
        
    -   Perfil con preferencias básicas y **favoritos** locales.
        
2.  **Panel de administración (HTML, CSS, JS)**
    
    -   Código: [https://github.com/A01801461/beneficio_joven_paneles](https://github.com/A01801461/beneficio_joven_paneles)
        
    -   Gestión de usuarios (jóvenes registrados).
      
    -   Alojado en: [https://beneficiojoven.site](https://beneficiojoven.site)
        
    -   Alta/edición de comercios.
        
    -   Creación y seguimiento de cupones.
        
    -   Reportes para el municipio.
        
3.  **Servidor Backend (API + lógica de negocio)**
    
    -   Código: [https://github.com/A01801461/beneficio_joven_backend](https://github.com/A01801461/beneficio_joven_backend)
        
    -   Alojado en: [https://bj-api.site](https://bj-api.site/)
        
    -   Autenticación de usuarios y roles.
        
    -   Ciclo de vida de cupones (creación, validación, redención).
        
    -   API REST para app móvil y panel.
        

----------

## 👥 Autores

-   **Astrid Guadalupe Navarro Rojas** — [A01769650@tec.mx](mailto:A01769650@tec.mx)
    
-   **Daniel Díaz Romero** — [A01801486@tec.mx](mailto:A01801486@tec.mx)
    
-   **David Alejandro Pérez Tabarés** — [A01800971@tec.mx](mailto:A01800971@tec.mx)
    
-   **Isaac Abud León** — [A01801461@tec.mx](mailto:A01801461@tec.mx)
    
-   **Juan Manuel Torres Rottonda** — [A01800476@tec.mx](mailto:A01800476@tec.mx)
    
-   **Luis Ángel Godínez González** — [A01752310@tec.mx](mailto:A01752310@tec.mx)
    


----------

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
| GET    | `/beneficioJoven/merchants/:merchantType` | Lista los comercios por su tipo |
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
   - Instala dependencias: `npm install express mysql2 bcryptjs jsonwebtoken dotenv body-parser cors joi qrcode nodemailer @sendgrid/mail firebase-admin`.
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

### ⚙️ Implementaciones de seguridad incluidas en el código

Aunque no todas estén activas, el backend **ya incluye la lógica completa** para:
- Autenticación basada en JWT (JSON Web Tokens)  
- Gestión de sesiones y expiración de tokens 
- Validación de roles (`user`, `merchant`, `admin` o `super_admin`)
- Encriptación de contraseñas (Todas las contraseñas se cifran con **bcrypt** antes de ir a la BD)
- Validación de datos y sanitización de entrada (Uso de **Joi** y middleware de validación para evitar inyecciones SQL y datos corruptos.) 
- Buenas prácticas de CORS y variables de entorno (Configuración segura mediante `.env`)

---

## 📄 Licencia

Este proyecto es propiedad del **Gobierno Municipal de Atizapán de Zaragoza**.  
Su uso está limitado a fines institucionales y no puede ser distribuido ni comercializado sin autorización expresa.
