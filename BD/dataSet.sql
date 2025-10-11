-- -----------------------------------------------------------
-- qualityData.sql
--
-- Generación de datos (falsos) de calidad para pruebas del sistema de Beneficio Joven
-- Total: 35 Usuarios (5 Admins, 10 Comercios, 20 Clientes), 30 Cupones, 60 Cupones Obtenidos, 40 Redenciones.
--
-- Fecha: 11-Oct-2025
-- Autores: Equipo 2 - Gpo 401
-- ----------------------------------------------------------

-- Deshabilitar la verificación de claves foráneas para permitir la inserción de datos en orden no estricto (especialmente para IDs fijos en 'users').
SET FOREIGN_KEY_CHECKS = 0;

-- =========================================================
-- 1. Tabla: users (35 Registros)
--    IDs 1-5: Admins
--    IDs 6-15: Merchants (Comercios)
--    IDs 16-35: Users (Clientes)
-- =========================================================

INSERT INTO users (id, email, password, role) VALUES
-- Administradores (IDs 1-5)
(1, 'super@cupones.mx', '$2a$10$hashed_password_super', 'super_admin'),
(2, 'admin1@cupones.mx', '$2a$10$hashed_password_admin1', 'admin'),
(3, 'admin2@cupones.mx', '$2a$10$hashed_password_admin2', 'admin'),
(4, 'admin3@cupones.mx', '$2a$10$hashed_password_admin3', 'admin'),
(5, 'admin4@cupones.mx', '$2a$10$hashed_password_admin4', 'admin'),

-- Comercios (IDs 6-15)
(6, 'oxxo@corp.mx', '$2a$10$hashed_password_oxxo', 'merchant'), -- OXXO (id original 7)
(7, 'sixflags@corp.mx', '$2a$10$hashed_password_sixflags', 'merchant'), -- Six Flags México (id original 8)
(8, 'cinepolis@corp.mx', '$2a$10$hashed_password_cinepolis', 'merchant'), -- Cinépolis (id original 9)
(9, 'soriana@corp.mx', '$2a$10$hashed_password_soriana', 'merchant'), -- Soriana (id original 10)
(10, 'liverpool@corp.mx', '$2a$10$hashed_password_liverpool', 'merchant'), -- Liverpool (id original 11)
(11, 'gandhi@corp.mx', '$2a$10$hashed_password_gandhi', 'merchant'), -- Librerías Gandhi
(12, 'vips@corp.mx', '$2a$10$hashed_password_vips', 'merchant'), -- Vips
(13, 'telcel@corp.mx', '$2a$10$hashed_password_telcel', 'merchant'), -- Telcel
(14, 'innovasport@corp.mx', '$2a$10$hashed_password_innovasport', 'merchant'), -- Innovasport
(15, 'toxico@corp.mx', '$2a$10$hashed_password_toxico', 'merchant'), -- El Palacio de Hierro

-- Clientes (IDs 16-35)
(16, 'isaac.a@mail.com', '$2a$10$hashed_password_isaac', 'user'),
(17, 'astrid.n@mail.com', '$2a$10$hashed_password_astrid', 'user'),
(18, 'karen.s@mail.com', '$2a$10$hashed_password_karen', 'user'),
(19, 'luis.m@mail.com', '$2a$10$hashed_password_luis', 'user'),
(20, 'sofia.p@mail.com', '$2a$10$hashed_password_sofia', 'user'),
(21, 'javier.r@mail.com', '$2a$10$hashed_password_javier', 'user'),
(22, 'elena.g@mail.com', '$2a$10$hashed_password_elena', 'user'),
(23, 'diego.f@mail.com', '$2a$10$hashed_password_diego', 'user'),
(24, 'paola.h@mail.com', '$2a$10$hashed_password_paola', 'user'),
(25, 'andres.z@mail.com', '$2a$10$hashed_password_andres', 'user'),
(26, 'valeria.x@mail.com', '$2a$10$hashed_password_valeria', 'user'),
(27, 'hector.c@mail.com', '$2a$10$hashed_password_hector', 'user'),
(28, 'mariana.v@mail.com', '$2a$10$hashed_password_mariana', 'user'),
(29, 'ricardo.b@mail.com', '$2a$10$hashed_password_ricardo', 'user'),
(30, 'sandra.n@mail.com', '$2a$10$hashed_password_sandra', 'user'),
(31, 'juan.p@mail.com', '$2a$10$hashed_password_juan', 'user'),
(32, 'ana.l@mail.com', '$2a$10$hashed_password_ana', 'user'),
(33, 'oscar.q@mail.com', '$2a$10$hashed_password_oscar', 'user'),
(34, 'brenda.w@mail.com', '$2a$10$hashed_password_brenda', 'user'),
(35, 'daniel.e@mail.com', '$2a$10$hashed_password_daniel', 'user');


-- =========================================================
-- 2. Tabla: admin_profiles (5 Registros)
-- =========================================================

INSERT INTO admin_profiles (user_id, full_name, is_super_admin) VALUES
(1, 'Andrea Flores', true),
(2, 'Mauricio Lopez', false),
(3, 'Laura Jiménez', false),
(4, 'Jorge Castillo', false),
(5, 'Karla Velazquez', false);


-- =========================================================
-- 3. Tabla: merchant_profiles (10 Registros)
-- =========================================================

INSERT INTO merchant_profiles (user_id, merchant_name, description, logo_url, merchant_type) VALUES
(6, 'OXXO', 'Tienda de conveniencia con más de 21,000 sucursales en México. Paga servicios, recarga tu celular y más.', 'https://es.wikipedia.org/wiki/Oxxo#/media/Archivo:Oxxo_Logo.svg', 'Conveniencia'),
(7, 'Six Flags México', 'Parque de diversiones más grande de Latinoamérica. Montañas rusas, shows y experiencias únicas.', 'https://en.wikipedia.org/wiki/Six_Flags#/media/File:Six_Flags_logo.svg', 'Entretenimiento'),
(8, 'Cinépolis', 'La Capital del Cine. Funciones premium, butacas reclinables y snacks exclusivos.', 'https://es.wikipedia.org/wiki/Cin%C3%A9polis#/media/Archivo:Cin%C3%A9polis.svg', 'Entretenimiento'),
(9, 'Soriana', 'Supermercado y tienda departamental con precios bajos todos los días. Más de 800 tiendas en México.', 'https://es.wikipedia.org/wiki/Organizaci%C3%B3n_Soriana#/media/Archivo:LogoSorianaSVG.svg', 'Supermercado'),
(10, 'Liverpool', 'Tienda departamental con moda, electrónicos, hogar y más. Calidad y servicio desde 1847.', 'https://en.wikipedia.org/wiki/Liverpool_(department_store)#/media/File:Liverpool_logo_2023.png', 'Departamental'),
(11, 'Librerías Gandhi', 'El lugar de tus libros. Gran variedad de títulos, cafetería y ambiente cultural.', 'https://en.wikipedia.org/wiki/Gandhi_(bookstore)#/media/File:Librer%C3%ADas_Gandhi_logo.png', 'Librería'),
(12, 'Vips', 'Restaurante familiar mexicano con desayunos, comidas y cenas. Un clásico de la gastronomía nacional.', 'https://es.wikipedia.org/wiki/Vips#/media/Archivo:VIPS_Logo_Mexico_01.2024.svg', 'Restaurante'),
(13, 'Telcel', 'Líder en telecomunicaciones móviles en México. Planes y equipos de última generación.', 'https://es.wikipedia.org/wiki/Telcel#/media/Archivo:Telcel_logo.svg', 'Telecomunicaciones'),
(14, 'Innovasport', 'Tu tienda de deportes. Ropa, calzado y accesorios de las mejores marcas para atletas.', 'https://kajabi-storefronts-production.kajabi-cdn.com/kajabi-storefronts-production/file-uploads/themes/2148572078/settings_images/715a2-400-ac48-3dbc-5d2ee4b0d14_logo-INNOVA.png', 'Deportes'),
(15, 'El Palacio de Hierro', 'Soy Totalmente Palacio. Tienda departamental de lujo con las mejores marcas internacionales.', 'https://es.wikipedia.org/wiki/El_Palacio_de_Hierro#/media/Archivo:El_Palacio_de_Hierro_logo.svg', 'Departamental');


-- =========================================================
-- 4. Tabla: user_profiles (20 Registros)
--    Todos de Atizapán y edad 14-22 (Nacidos 2003-2011)
-- =========================================================

INSERT INTO user_profiles (user_id, full_name, curp, birth_date, municipality) VALUES
(16, 'Isaac Abud Leon', 'AULI040414HDFBNSA4', '2004-04-14', 'Atizapán'), -- 21 años
(17, 'Astrid Guadalupe Navarro Rojas', 'GUNAG051018TOLABC1', '2005-10-18', 'Atizapán'), -- 19 años
(18, 'Karen Sofia Domínguez', 'SDKA070101MDFABC01', '2007-01-01', 'Atizapán'), -- 18 años
(19, 'Luis Martínez Garcia', 'MGLU030925HDFMN01', '2003-09-25', 'Atizapán'), -- 22 años
(20, 'Sofia Pérez Hernández', 'PEHS060512MDFWM02', '2006-05-12', 'Atizapán'), -- 19 años
(21, 'Javier Ramírez Cruz', 'RUCJ090303HDFMS03', '2009-03-03', 'Atizapán'), -- 16 años
(22, 'Elena Gómez Flores', 'GOFE101120MDFWS04', '2010-11-20', 'Atizapán'), -- 14 años
(23, 'Diego Fernández Vazquez', 'FIVD110715HDFMS05', '2011-07-15', 'Atizapán'), -- 14 años
(24, 'Paola Herrera López', 'HELP080228MDFWS06', '2008-02-28', 'Atizapán'), -- 17 años
(25, 'Andrés Zúñiga Mora', 'ZUMA041201HDFMN07', '2004-12-01', 'Atizapán'), -- 20 años
(26, 'Valeria Ximena Torres', 'TOXV070605MDFWM08', '2007-06-05', 'Atizapán'), -- 18 años
(27, 'Héctor Carrillo Rivas', 'CARH050817HDFMS09', '2005-08-17', 'Atizapán'), -- 20 años
(28, 'Mariana Velez Ochoa', 'VEOK060422MDFWS10', '2006-04-22', 'Atizapán'), -- 19 años
(29, 'Ricardo Beltrán Sosa', 'BSRS031001HDFMN11', '2003-10-01', 'Atizapán'), -- 22 años
(30, 'Sandra Núñez Pineda', 'NUSP090119MDFWM12', '2009-01-19', 'Atizapán'), -- 16 años
(31, 'Juan Pablo Alarcón', 'ALAP100530HDFMS13', '2010-05-30', 'Atizapán'), -- 15 años
(32, 'Ana Laura Mendoza', 'MEAA080311MDFWS14', '2008-03-11', 'Atizapán'), -- 17 años
(33, 'Oscar Quijano Islas', 'QIJO070907HDFMN15', '2007-09-07', 'Atizapán'), -- 18 años
(34, 'Brenda Wong Sánchez', 'WOSB040129MDFWM16', '2004-01-29', 'Atizapán'), -- 21 años
(35, 'Daniel Escamilla Salas', 'EASD030808HDFMS17', '2003-08-08', 'Atizapán'); -- 22 años


-- =========================================================
-- 5. Tabla: coupons (30 Registros)
--    merchant_id se refiere a los IDs 6-15
--    IMPORTANTE: insertar desde endpoint con 'curl' o panel de admins
--                de admins, para garantizar generacion de QRs, pues
--                los URLs de estos inserts son del API deployeada.
-- =========================================================

INSERT INTO coupons (code, title, description, discount_type, merchant_id, valid_from, valid_until, usage_limit, qr_code_url) VALUES
-- Cupones Cinépolis (ID 8)
('MIERCOLES2X1', '2x1 en salas regulares, el miercoles', '2x1 en boletos de salas regulares, solo aplica los miércoles y no es válido en festivos.', 'boleto_2x1', 8, '2025-01-01', '2025-12-31', 50, 'https://bj-api.site/qrcodes/MIERCOLES2X1.png'),
('CINE30SNACK', '30% en Palomitas y Refresco grandes', 'Aplica en combo palomitas y refresco grandes. No incluye upgrades.', 'Porcentaje', 8, '2025-10-01', '2026-03-31', 25, 'https://bj-api.site/qrcodes/CINE30SNACK.png'),
('CINEROMANCE', 'Boleto + Hot-Dog por $100', 'Válido para funciones de lunes a viernes antes de las 5 PM.', 'Precio fijo', 8, '2025-11-01', '2025-12-31', 10, 'https://bj-api.site/qrcodes/CINEROMANCE.png'),

-- Cupones OXXO (ID 6)
('OXXO30HIELO', '30% de descuento en Hielo Fiesta', '30% de descuento en Hielo Fiesta, aplicable hasta 4 bolsas por cupón.', 'Porcentaje', 6, '2025-01-01', '2025-12-31', 4, 'https://bj-api.site/qrcodes/OXXO30HIELO.png'),
('COFFEEAM', 'Café Americano 12oz gratis', 'Válido solo de 6:00 AM a 10:00 AM. Un cupón por persona.', 'Regalo', 6, '2025-09-01', '2026-02-28', 1, 'https://bj-api.site/qrcodes/COFFEEAM.png'),
('PAPA2X1', '2x1 en Papas Sabritas', 'Válido en cualquier sabor de bolsa pequeña/mediana. El de menor precio es gratis.', 'Producto_2x1', 6, '2025-10-01', '2026-01-31', 10, 'https://bj-api.site/qrcodes/PAPA2X1.png'),

-- Cupones Six Flags (ID 7)
('ADRENALINA40', '40% de descuento en Entrada General', 'No aplica en boletos Flash Pass. Válido solo de martes a jueves.', 'Porcentaje', 7, '2025-01-01', '2025-12-15', 3, 'https://bj-api.site/qrcodes/ADRENALINA40'),
('SIXCOMBOFAM', 'Combo Familiar (4 personas) por $1200', 'Incluye 4 entradas y un combo de alimentos.', 'Precio fijo', 7, '2025-11-01', '2026-03-01', 5, 'https://bj-api.site/qrcodes/SIXCOMBOFAM'),
('PASSGRATIS', 'Segundo Visitante GRATIS', 'Paga una entrada y la segunda es cortesía (de igual o menor valor).', 'boleto_2x1', 7, '2026-01-01', '2026-06-30', NULL, 'https://bj-api.site/qrcodes/PASSGRATIS'),

-- Cupones Soriana (ID 9)
('DESPENSA10', '10% de descuento en Abarrotes', 'Mínimo de compra $500 pesos. No aplica en perecederos.', 'Porcentaje', 9, '2025-11-15', '2025-12-31', NULL, 'https://bj-api.site/qrcodes/DESPENSA10'),
('FRUTAYVERD', 'Envío Gratis en Tu Primer Compra', 'Solo aplica para compras en línea mayores a $800 en frutas y verduras.', 'Envio Gratis', 9, '2025-10-01', '2026-04-30', 1, 'https://bj-api.site/qrcodes/FRUTAYVERD'),
('ELECTRO200', '$200 de descuento en Electrónica', 'Válido en compras mayores a $2,000 en el departamento de electrónica.', 'Monto Fijo', 9, '2025-10-10', '2026-01-10', 5, 'https://bj-api.site/qrcodes/ELECTRO200'),

-- Cupones Liverpool (ID 10)
('MODA20NEW', '20% de descuento en Ropa de Temporada', 'Válido en marcas seleccionadas de ropa de mujer y hombre.', 'Porcentaje', 10, '2025-10-01', '2026-01-31', 2, 'https://bj-api.site/qrcodes/MODA20NEW'),
('PERFUMELVP', 'Set de muestras de Perfumes Gratis', 'Muestra exclusiva en la compra de cualquier fragancia.', 'Regalo', 10, '2025-01-01', '2026-12-31', 1, 'https://bj-api.site/qrcodes/PERFUMELVP'),
('12MSI', '12 Meses Sin Intereses Adicionales', 'Aplica para compras con tarjeta Liverpool mayores a $5,000.', 'Financiamiento', 10, '2025-12-01', '2026-02-28', NULL, 'https://bj-api.site/qrcodes/12MSI'),

-- Cupones Librerías Gandhi (ID 11)
('LECTOR15', '15% de descuento en Libros', 'No aplica en textos escolares o revistas.', 'Porcentaje', 11, '2025-01-01', '2026-01-01', NULL, 'https://bj-api.site/qrcodes/LECTOR15'),
('CAFEGRATIS', 'Café Americano GRATIS', 'Solo aplica al presentar el cupón, sin compra mínima.', 'Regalo', 11, '2025-08-01', '2025-12-31', 1, 'https://bj-api.site/qrcodes/CAFEGRATIS'),
('NOVELA3X2', '3x2 en Novelas de Ficción', 'El libro de menor costo es gratis.', 'Producto_3x2', 11, '2025-11-01', '2026-02-29', 1, 'https://bj-api.site/qrcodes/NOVELA3X2'),

-- Cupones Vips (ID 12)
('VIPS_DESAYUNO', 'Desayuno Clásico por $99', 'Elige entre Hotcakes o Huevos al gusto. Incluye café.', 'Precio fijo', 12, '2025-01-01', '2026-06-30', 15, 'https://bj-api.site/qrcodes/VIPS_DESAYUNO'),
('LUNCH15', '15% de descuento en Comidas', 'Válido de 1:00 PM a 5:00 PM, de lunes a viernes.', 'Porcentaje', 12, '2025-11-01', '2026-01-31', 10, 'https://bj-api.site/qrcodes/LUNCH15'),
('PASTELPOSTRE', 'Postre GRATIS en la compra de un platillo fuerte', 'Válido en la rebanada de pastel de la semana.', 'Regalo', 12, '2025-10-01', '2026-01-01', 5, 'https://bj-api.site/qrcodes/PASTELPOSTRE'),

-- Cupones Telcel (ID 13)
('RECARGA50', '50% de Bonificación en tu Recarga', 'Recarga mínima de $100 pesos. Bonificación aplica a tiempo aire.', 'Porcentaje', 13, '2025-11-20', '2026-01-20', 1, 'https://bj-api.site/qrcodes/RECARGA50'),
('CHIPGRATIS', 'Chip Telcel con $50 de saldo GRATIS', 'Solo para nuevos clientes.', 'Regalo', 13, '2025-10-01', '2026-03-31', 1, 'https://bj-api.site/qrcodes/CHIPGRATIS'),
('PLAN_ESTUDIANTE', '2 Meses Gratis en Plan Postpago', 'Contrata un plan de 18 meses y recibe 2 meses de servicio gratis.', 'Meses Gratis', 13, '2025-01-01', '2026-12-31', NULL, 'https://bj-api.site/qrcodes/PLAN_ESTUDIANTE'),

-- Cupones Innovasport (ID 14)
('SNEAKER10', '10% de descuento en Tenis Nuevos', 'Válido en la colección de la semana.', 'Porcentaje', 14, '2025-10-01', '2026-02-29', 3, 'https://bj-api.site/qrcodes/SNEAKER10'),
('ENVIOFREE', 'Envío Estándar GRATIS', 'Sin monto mínimo de compra en línea.', 'Envio Gratis', 14, '2025-10-01', '2025-12-31', 5, 'https://bj-api.site/qrcodes/ENVIOFREE'),
('INNOVA500', '$500 de Regalo en tu Compra', 'Mínimo de compra $2,500. Aplica en toda la tienda.', 'Monto Fijo', 14, '2025-12-01', '2026-01-15', 1, 'https://bj-api.site/qrcodes/INNOVA500'),

-- Cupones El Palacio de Hierro (ID 15)
('JOYAS15', '15% de descuento en Joyería', 'Aplica en marcas seleccionadas.', 'Porcentaje', 15, '2025-11-01', '2026-01-31', NULL, 'https://bj-api.site/qrcodes/JOYAS15'),
('PRIMERACOMPRA', '10% Adicional en tu Primera Compra', 'Solo para clientes nuevos.', 'Porcentaje', 15, '2025-01-01', '2026-12-31', 1, 'https://bj-api.site/qrcodes/PRIMERACOMPRA'),
('BEAUTYSET', 'Set de Muestras de Belleza', 'Gratis al visitar el mostrador de perfumería.', 'Regalo', 15, '2025-10-10', '2026-03-10', NULL, 'https://bj-api.site/qrcodes/BEAUTYSET');


-- =========================================================
-- 6. Tabla: user_coupons (60 Registros)
--    Simula que los usuarios (16-35) han obtenido cupones (1-30)
-- =========================================================

INSERT INTO user_coupons (user_id, coupon_id, obtained_at) VALUES
(16, 1, '2025-11-01 10:00:00'), -- Cinepolis 2x1
(16, 4, '2025-11-02 11:00:00'), -- OXXO Hielo
(16, 13, '2025-11-03 12:00:00'), -- Liverpool Moda
(16, 16, '2025-11-04 13:00:00'), -- Gandhi Lector

(17, 1, '2025-11-01 10:30:00'), -- Cinepolis 2x1
(17, 7, '2025-11-05 14:00:00'), -- Six Flags 40%
(17, 11, '2025-11-06 15:00:00'), -- Soriana Envío
(17, 19, '2025-11-07 16:00:00'), -- Vips Desayuno

-- Otros 18 usuarios tienen 3 cupones c/u (54 registros)
(18, 2, '2025-11-01 17:00:00'), (18, 5, '2025-11-02 18:00:00'), (18, 8, '2025-11-03 19:00:00'),
(19, 3, '2025-11-04 09:00:00'), (19, 6, '2025-11-05 10:00:00'), (19, 9, '2025-11-06 11:00:00'),
(20, 10, '2025-11-07 12:00:00'), (20, 11, '2025-11-08 13:00:00'), (20, 12, '2025-11-09 14:00:00'),
(21, 1, '2025-11-10 15:00:00'), (21, 14, '2025-11-11 16:00:00'), (21, 15, '2025-11-12 17:00:00'),
(22, 17, '2025-11-13 18:00:00'), (22, 18, '2025-11-14 19:00:00'), (22, 19, '2025-11-15 09:00:00'),
(23, 20, '2025-11-16 10:00:00'), (23, 21, '2025-11-17 11:00:00'), (23, 22, '2025-11-18 12:00:00'),
(24, 23, '2025-11-19 13:00:00'), (24, 24, '2025-11-20 14:00:00'), (24, 25, '2025-11-21 15:00:00'),
(25, 26, '2025-11-22 16:00:00'), (25, 27, '2025-11-23 17:00:00'), (25, 28, '2025-11-24 18:00:00'),
(26, 29, '2025-11-25 19:00:00'), (26, 30, '2025-11-26 09:00:00'), (26, 1, '2025-11-27 10:00:00'),
(27, 2, '2025-11-28 11:00:00'), (27, 4, '2025-11-29 12:00:00'), (27, 6, '2025-11-30 13:00:00'),
(28, 8, '2025-12-01 14:00:00'), (28, 10, '2025-12-02 15:00:00'), (28, 12, '2025-12-03 16:00:00'),
(29, 14, '2025-12-04 17:00:00'), (29, 16, '2025-12-05 18:00:00'), (29, 18, '2025-12-06 19:00:00'),
(30, 20, '2025-12-07 09:00:00'), (30, 22, '2025-12-08 10:00:00'), (30, 24, '2025-12-09 11:00:00'),
(31, 26, '2025-12-10 12:00:00'), (31, 28, '2025-12-11 13:00:00'), (31, 30, '2025-12-12 14:00:00'),
(32, 3, '2025-12-13 15:00:00'), (32, 5, '2025-12-14 16:00:00'), (32, 7, '2025-12-15 17:00:00'),
(33, 9, '2025-12-16 18:00:00'), (33, 11, '2025-12-17 19:00:00'), (33, 13, '2025-12-18 09:00:00'),
(34, 15, '2025-12-19 10:00:00'), (34, 17, '2025-12-20 11:00:00'), (34, 19, '2025-12-21 12:00:00'),
(35, 21, '2025-12-22 13:00:00'), (35, 23, '2025-12-23 14:00:00'), (35, 25, '2025-12-24 15:00:00');

-- =========================================================
-- 7. Tabla: coupon_redemptions (40 Registros)
--    Simula redenciones de los cupones obtenidos.
-- =========================================================

INSERT INTO coupon_redemptions (user_id, coupon_id, redeemed_at) VALUES

(16, 1, '2025-11-06 10:30:00'),
(16, 4, '2025-11-10 11:30:00'),
(16, 13, '2025-11-20 12:30:00'),
(17, 1, '2025-11-06 11:00:00'),
(17, 19, '2025-11-15 17:00:00'),

(18, 2, '2025-11-05 17:30:00'),
(18, 5, '2025-11-10 18:30:00'),
(19, 3, '2025-11-08 09:30:00'),
(19, 6, '2025-11-12 10:30:00'),
(20, 10, '2025-11-15 12:30:00'),
(20, 11, '2025-11-20 13:30:00'),
(21, 1, '2025-11-15 15:30:00'),
(21, 14, '2025-11-25 16:30:00'),
(22, 17, '2025-11-19 18:30:00'),
(22, 18, '2025-11-22 19:30:00'),
(23, 20, '2025-11-25 10:30:00'),
(23, 21, '2025-11-30 11:30:00'),
(24, 23, '2025-11-25 13:30:00'),
(24, 24, '2025-11-30 14:30:00'),
(25, 26, '2025-12-01 16:30:00'),
(25, 27, '2025-12-05 17:30:00'),
(26, 29, '2025-12-02 19:30:00'),
(26, 30, '2025-12-06 09:30:00'),
(27, 2, '2025-12-03 11:30:00'),
(27, 4, '2025-12-07 12:30:00'),
(28, 8, '2025-12-05 14:30:00'),
(28, 10, '2025-12-10 15:30:00'),
(29, 14, '2025-12-08 17:30:00'),
(29, 16, '2025-12-12 18:30:00'),
(30, 20, '2025-12-15 09:30:00'),
(30, 22, '2025-12-20 10:30:00'),
(31, 26, '2025-12-15 12:30:00'),
(31, 28, '2025-12-20 13:30:00'),
(32, 3, '2025-12-15 15:30:00'),
(32, 5, '2025-12-20 16:30:00'),
(33, 9, '2025-12-18 18:30:00'),
(33, 11, '2025-12-22 19:30:00'),
(34, 15, '2025-12-25 10:30:00'),
(35, 21, '2025-12-28 13:30:00');

-- Restaurar la verificación de claves foráneas
SET FOREIGN_KEY_CHECKS = 1;