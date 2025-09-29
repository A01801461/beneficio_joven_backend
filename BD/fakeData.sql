INSERT INTO users (email, password, role) VALUES
('juan.perez@example.com', 'hashed_password_123', 'user'),
('ana.garcia@example.com', 'hashed_password_456', 'user'),
('tienda_electro@example.com', 'hashed_password_789', 'merchant'),
('cafe_del_barrio@example.com', 'hashed_password_101', 'merchant'),
('admin@cuponesapp.com', 'hashed_admin_pass', 'admin'),
('super@cuponesapp.com', 'hashed_super_pass', 'super_admin');

INSERT INTO user_profiles (user_id, full_name, curp, birth_date, municipality) VALUES
(1, 'Juan Pérez López', 'PELJ900101HDFPRN09', '1990-01-01', 'Cuauhtémoc'),
(2, 'Ana García Martínez', 'GAMA850515MDFRNN03', '1985-05-15', 'Benito Juárez');

INSERT INTO merchant_profiles (user_id, merchant_name, description, logo_url, merchant_type) VALUES
(3, 'ElectroTienda', 'Tienda de electrónicos y accesorios.', 'https://fakeurl.com/logos/electro.png', 'Electrónica'),
(4, 'Café del Barrio', 'Cafetería artesanal con descuentos exclusivos.', 'https://fakeurl.com/logos/cafe.png', 'Alimentos');

INSERT INTO admin_profiles (user_id, full_name, is_super_admin) VALUES
(5, 'Carlos Ruiz', FALSE),
(6, 'Laura Mendoza', TRUE);

INSERT INTO coupons (code, title, description, discount_type, merchant_id, valid_from, valid_until, usage_limit, qr_code_url) VALUES
('ELECTRO20', '20% de descuento en todo', 'Válido en toda la tienda', 'porcentaje', 3, '2024-04-01', '2024-12-31', 100, 'https://fakeurl.com/qr/electro20.png'),
('CAFEBAR15', '15% en tu próxima compra', 'Solo en bebidas', 'porcentaje', 4, '2024-04-01', '2024-06-30', 50, 'https://fakeurl.com/qr/cafemar15.png'),
('ELECTRO100', '100 pesos de descuento', 'En compras mayores a $500', 'monto_fijo', 3, '2024-05-01', '2024-08-31', 200, 'https://fakeurl.com/qr/electro100.png');

INSERT INTO user_coupons (user_id, coupon_id) VALUES
(1, 1), -- Juan obtiene ELECTRO20
(1, 2), -- Juan obtiene CAFEBAR15
(2, 1), -- Ana obtiene ELECTRO20
(2, 3); -- Ana obtiene ELECTRO100

INSERT INTO coupon_redemptions (user_id, coupon_id) VALUES
(1, 1), -- Juan redime ELECTRO20
(2, 3); -- Ana redime ELECTRO100