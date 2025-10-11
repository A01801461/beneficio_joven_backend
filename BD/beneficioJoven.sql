-- -----------------------------------------------------------
-- beneficioJoven.sql
--
-- Codigo SQL para la creacion de las tablas de la BD del sistema de Beneficio Joven
-- Total (7): users, user_profiles, merchant_profiles, admin_profiles, coupons, user_coupons, coupon_redemptions
--
-- Fecha: 11-Oct-2025
-- Autores: Equipo 2 - Gpo 401
-- ----------------------------------------------------------

-- Tabla central de usuarios para autenticación
-- Datos generales de todos los usuarios (todos los roles)
-- Para hacer login de una sola tabla
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL, -- Hash desde API (con bcrypt)
    role ENUM('user', 'merchant', 'admin', 'super_admin') NOT NULL, -- rol
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email) -- para facilitar busquedas
);

-- Tabla de perfiles para usuarios finales (clientes de la app)
-- tabla de 'jovenes'
CREATE TABLE user_profiles (
    user_id INT PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    curp VARCHAR(18) UNIQUE NOT NULL,
    birth_date DATE,
    municipality VARCHAR(100),
    FOREIGN KEY (user_id) REFERENCES users(id) -- llave foranea desde 'users'
);

-- Tabla de perfiles comercios
CREATE TABLE merchant_profiles (
    user_id INT PRIMARY KEY,
    merchant_name VARCHAR(100) NOT NULL,
    description TEXT,
    logo_url VARCHAR(255), -- 
    merchant_type VARCHAR(50),
    FOREIGN KEY (user_id) REFERENCES users(id) -- llave foranea desde 'users'
);

-- Tabla de perfiles administradores
CREATE TABLE admin_profiles (
    user_id INT PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    is_super_admin BOOLEAN DEFAULT false,
    FOREIGN KEY (user_id) REFERENCES users(id) -- llave foranea desde 'users'
);

-- Tabla de cupones
CREATE TABLE coupons (
    id INT AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(50) UNIQUE NOT NULL,
    title VARCHAR(100) NOT NULL,
    description TEXT,
    discount_type VARCHAR(50), -- texto libre o catálogo simple
    merchant_id INT NOT NULL,
    valid_from DATE DEFAULT CURRENT_DATE,
    valid_until DATE,
    usage_limit INT DEFAULT NULL,
    qr_code_url VARCHAR(255),
    FOREIGN KEY (merchant_id) REFERENCES users(id),  -- llave foranea desde 'comercios'
    INDEX idx_coupon_code (code),  -- para facilitar busquedas
    INDEX idx_merchant_id (merchant_id),  -- para facilitar busquedas
    INDEX idx_valid_dates (valid_from, valid_until)  -- para facilitar busquedas
);

-- Tabla de relación usuario-cupón (cupones obtenidos o cupones 'favoritos')
CREATE TABLE user_coupons (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL, -- Referencia users(id) con role='user'
    coupon_id INT NOT NULL,
    obtained_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),  -- llave foranea desde 'users'
    FOREIGN KEY (coupon_id) REFERENCES coupons(id),  -- llave foranea desde 'cupones'
    UNIQUE KEY unique_user_coupon (user_id, coupon_id)
);

-- Tabla de redenciones de cupones
CREATE TABLE coupon_redemptions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL, -- Referencia users(id) con role='user'
    coupon_id INT NOT NULL,
    redeemed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id), -- llave foranea desde 'users'
    FOREIGN KEY (coupon_id) REFERENCES coupons(id), -- llave foranea desde 'cupones'
    INDEX idx_redemption_date (redeemed_at),
    INDEX idx_user_redemptions (user_id, redeemed_at)
);