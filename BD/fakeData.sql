INSERT INTO users (email, password, role) VALUES
('juan.perez@example.com', 'hashed_password_123', 'user'), --1
('ana.garcia@example.com', 'hashed_password_456', 'user'),
('tienda_electro@example.com', 'hashed_password_789', 'merchant'),
('cafe_del_barrio@example.com', 'hashed_password_101', 'merchant'), -- 4
('admin@cuponesapp.com', 'hashed_admin_pass', 'admin'),
('super@cuponesapp.com', 'hashed_super_pass', 'super_admin');
('oxxo.oficial@corp.com', 'hashed_oxxo_pass', 'merchant'), -- 7
('sixflags@parques.com', 'hashed_sixflags_pass', 'merchant'),
('cinepolis@cinema.mx', 'hashed_cinepolis_pass', 'merchant'), -- 9
('soriana@retail.mx', 'hashed_soriana_pass', 'merchant'),
('liverpool@departamental.mx', 'hashed_liverpool_pass', 'merchant'), -- 11
('isaacabud@gmail.com', 'hashed_password_123', 'user'),
('astridGdlp@gmail.com', 'hashed_password_456', 'user'); --13

INSERT INTO user_profiles (user_id, full_name, curp, birth_date, municipality) VALUES
(1, 'Juan Pérez López', 'PELJ900101HDFPRN09', '1990-01-01', 'Cuauhtémoc'),
(2, 'Ana García Martínez', 'GAMA850515MDFRNN03', '1985-05-15', 'Benito Juárez');
(12, 'Isaac Abud Leon', 'AULI040414HDFBNSA4', '2004-04-14', 'Atizapan'),
(13, 'Astrid Guadalupe Navarro Rojas', 'GUNAG051018TOLABC1', '2005-10-18', 'Atizapan?');

INSERT INTO merchant_profiles (user_id, merchant_name, description, logo_url, merchant_type) VALUES
(3, 'ElectroTienda', 'Tienda de electrónicos y accesorios.', 'https://fakeurl.com/logos/electro.png', 'Electrónica'),
(4, 'Café del Barrio', 'Cafetería artesanal con descuentos exclusivos.', 'https://fakeurl.com/logos/cafe.png', 'Alimentos'),
(7, 'OXXO', 'Tienda de conveniencia con más de 21,000 sucursales en México. Paga servicios, recarga tu celular y más.', 'https://es.wikipedia.org/wiki/Oxxo#/media/Archivo:Oxxo_Logo.svg', 'Conveniencia'),
(8, 'Six Flags México', 'Parque de diversiones más grande de Latinoamérica. Montañas rusas, shows y experiencias únicas.', 'https://en.wikipedia.org/wiki/Six_Flags#/media/File:Six_Flags_logo.svg', 'Entretenimiento'),
(9, 'Cinépolis', 'La Capital del Cine. Funciones premium, butacas reclinables y snacks exclusivos.', 'https://es.wikipedia.org/wiki/Cin%C3%A9polis#/media/Archivo:Cin%C3%A9polis.svg', 'Cine'),
(10, 'Soriana', 'Supermercado y tienda departamental con precios bajos todos los días. Más de 800 tiendas en México.', 'https://es.wikipedia.org/wiki/Organizaci%C3%B3n_Soriana#/media/Archivo:LogoSorianaSVG.svg', 'Supermercado'),
(11, 'Liverpool', 'Tienda departamental con moda, electrónicos, hogar y más. Calidad y servicio desde 1847.', 'https://en.wikipedia.org/wiki/Liverpool_(department_store)#/media/File:Liverpool_logo_2023.png', 'Departamental');

INSERT INTO admin_profiles (user_id, full_name, is_super_admin) VALUES
(5, 'Carlos Ruiz', FALSE),
(6, 'Laura Mendoza', TRUE);

INSERT INTO coupons (code, title, description, discount_type, merchant_id, valid_from, valid_until, usage_limit, qr_code_url) VALUES
('ELECTRO20', '20% de descuento en todo', 'Válido en toda la tienda', 'porcentaje', 3, '2024-04-01', '2024-12-31', 100, 'https://fakeurl.com/qr/electro20.png'),
('CAFEBAR15', '15% en tu próxima compra', 'Solo en bebidas', 'porcentaje', 4, '2024-04-01', '2024-06-30', 50, 'https://fakeurl.com/qr/cafemar15.png'),
('ELECTRO100', '100 pesos de descuento', 'En compras mayores a $500', 'monto_fijo', 3, '2024-05-01', '2024-08-31', 200, 'https://fakeurl.com/qr/electro100.png'),
('OXXO10', '10% de descuento en snacks', 'Válido en papas, galletas y dulces. Máximo $20 MXN de descuento.', 'porcentaje', 7, '2025-10-01', '2025-12-31', 5000, 'https://fakeurl.com/qr/oxxo10.png'),
('TERROR2025', 'Boleto 2x1 Festival del Terror', 'Válido de lunes a jueves en octubre 2025. Solo en taquilla.', 'boleto_2x1', 8, '2025-10-01', '2025-10-31', 2000, 'https://fakeurl.com/qr/terror2025.png'),
('CINEPOLISVIP', '$50 MXN de descuento en butacas VIP', 'Aplicable en funciones VIP. Compra mínima de $200 MXN.', 'monto_fijo', 9, '2025-10-01', '2026-01-31', 1000, 'https://fakeurl.com/qr/cinepolisvip.png'),
('SORIANA200', '$200 MXN de descuento en compras de $1000+', 'Válido en productos de abarrotes y limpieza.', 'monto_fijo', 10, '2025-10-15', '2025-11-15', 3000, 'https://fakeurl.com/qr/soriana200.png'),
('LIVERPOOLMODA', '15% en ropa y calzado', 'Excluye marcas premium. Máximo $500 MXN de descuento.', 'porcentaje', 11, '2025-10-01', '2025-12-24', 800, 'https://fakeurl.com/qr/liverpoolmoda.png'),
('OXXO20', '2x1 Sabritass', 'Válido en productos sabritas debajo de $40', '2x1', 7, '2025-10-01', '2025-12-31', 5000, 'https://fakeurl.com/qr/oxxo10.png');

    {
        "code": "OXXO30",
        "title": "20% de descuento en Hielo Fiesta",
        "description": "20% de descuento en Hielo Fiesta",
        "discount_type": "Porcentaje",
        "merchant_id": 7,
        "valid_until": "2025-12-31",
        "usage_limit": 50,
        "qr_code_url": "http://example.com/qr1.png"
    }

    {
        "code": "MIERCOLES2X1",
        "title": "2x1 en salas regulares, el miercoles",
        "description": "2x1 en boletos de salas regulares, solo aplica los miercoles.",
        "discount_type": "boleto_2x1",
        "merchant_id": 9,
        "valid_until": "2025-12-31",
        "usage_limit": 50,
        "qr_code_url": "http://example.com/qr1.png"
    }

INSERT INTO user_coupons (user_id, coupon_id) VALUES
(1, 1), -- Juan obtiene ELECTRO20
(1, 2), -- Juan obtiene CAFEBAR15
(2, 1), -- Ana obtiene ELECTRO20
(2, 3), -- Ana obtiene ELECTRO100
(12, 4),
(12, 5),
(12, 6),
(13, 6),
(13, 7),
(13, 8);

INSERT INTO coupon_redemptions (user_id, coupon_id) VALUES
(1, 1), -- Juan redime ELECTRO20
(12, 1),
(13, 1),
(2, 3); -- Ana redime ELECTRO100