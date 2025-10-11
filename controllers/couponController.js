//----------------------------------------------------------
// /controllers/couponController.js
//
// Controlador de autenticacion (login & register).
//
// Fecha: 11-Oct-2025
// Autores: Equipo 2 - Gpo 401
//----------------------------------------------------------

const db = require('../config/db'); // importando archivo de configuracion de conexion a BD
const QRCode = require('qrcode'); // importando qrcode (node module para creacion de QRs)
const fs = require('fs'); // importando sf (File System) (node module para manipulacion de archivos)
const path = require('path'); // importando qrcode (node module para trabajar con rutas)

// -----
// Función para generar QRs
const generateQR = async (code) => {
  // verificar / crear carpeta con QRs
  const qrDir = path.join(__dirname, '..', 'qrcodes'); // carpeta con QRs
  if (!fs.existsSync(qrDir)) {
    fs.mkdirSync(qrDir, { recursive: true });
  }

  // nombre y lugar de guardado para el QR
  const filename = `${code}.png`;
  const filePath = path.join(qrDir, filename);

  // Generando QR con info del 'code' del cupon
  try {
    await QRCode.toFile(filePath, code, {
      width: 256, //256x256
      margin: 2,
      color: {
        dark: '#000000', // blanco & negro
        light: '#FFFFFF'
      }
    });
    console.log('✅ QR generado exitosamente'); // mensaje de control si se genera correctamente
    return `/qrcodes/${filename}`; // devuelve path del QR
  } catch (error) {
    console.error('❌ Error en generateQR:', error);  // ERROR: QR no se pudo generar
    throw new Error(`Error al generar QR: ${error.message}`);
  }
};

// -----
// Controlador (funcion) para crear cupón
exports.createCoupon = async (req, res) => {
  const { code, title, description, discount_type, valid_until, merchant_id, usage_limit } = req.body;
  console.log('📥 Request body recibido:', { code, merchant_id }); // mensaje de control de inicio de proceso

  try {
    // llamando generador de QRs con info 'code'
    const generatedQrPath = await generateQR(code);

    // Concatenar la URL base con path del QR
    const fullQrUrl = `http://localhost:3000${generatedQrPath || ''}`; // localhost para pruebas locales

    // insertando todos los datos a la BD
    const [result] = await db.query(
      'INSERT INTO coupons (code, title, description, discount_type, merchant_id, valid_until, usage_limit, qr_code_url) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [code, title, description, discount_type, merchant_id, valid_until, usage_limit, fullQrUrl]
    );
    // Mensajes de control
    res.status(201).json({ message: 'Cupón creado', couponId: result.insertId, qrUrl: fullQrUrl });
  } catch (err) {
    console.error('💥 Error en createCoupon:', err);
    res.status(500).json({ error: err.message });
  }
};

// -----
// Controlador (funcion) para listar cupones
exports.listCoupons = async (req, res) => {
  // Query para listar cupones con JOIN para datos del comercio
  try {
    const [coupons] = await db.query(`
      SELECT 
        c.id AS coupon_id,
        c.code,
        c.title,
        c.description,
        c.discount_type,
        DATE_FORMAT(c.valid_from, "%Y-%m-%d") AS valid_from,
        DATE_FORMAT(c.valid_until, "%Y-%m-%d") AS valid_until,
        c.usage_limit,
        c.qr_code_url,
        mp.merchant_name,
        mp.logo_url AS merchant_logo,
        mp.merchant_type
    FROM coupons c
    JOIN merchant_profiles mp ON c.merchant_id = mp.user_id;
      `);
    res.json(coupons);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// -----
// Controlador (funcion) para ver las estadisticas generales del sistema
exports.couponStats = async (req, res) => {
  try {
    // Query para obtener estadisticas generales del sistema
    const [coupons] = await db.query(`
    SELECT
        COUNT(DISTINCT c.id) AS total_cupones,
        (SELECT COUNT(*) FROM users WHERE role = 'user') AS total_jovenes,
        (SELECT COUNT(*) FROM users WHERE role = 'merchant') AS total_comercios,
        COUNT(DISTINCT c.merchant_id) AS comercios_con_cupones,
        COUNT(DISTINCT CASE WHEN up.user_id IS NOT NULL THEN uc.coupon_id END) AS cupones_asignados_a_jovenes,
        COUNT(DISTINCT CASE WHEN up.user_id IS NULL THEN c.id END) AS cupones_no_asignados,
        (SELECT COUNT(*) FROM coupon_redemptions) AS total_redenciones,
        COUNT(DISTINCT cr.coupon_id) AS cupones_unicos_redimidos
    FROM
        coupons c
        LEFT JOIN user_coupons uc ON c.id = uc.coupon_id
        LEFT JOIN user_profiles up ON uc.user_id = up.user_id
        LEFT JOIN coupon_redemptions cr ON c.id = cr.coupon_id;
      `);
    res.json(coupons);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// -----
// Controlador (funcion) para listar cupones filtrados por vendedor
exports.listByMerchant = async (req, res) => {
  // recibe id del comercio
  const { merchantId } = req.params;
  try {
  // Query para listar cupones de x comercio
    const [coupons] = await db.query(`
      SELECT 
        id,
        code,
        title,
        description,
        discount_type,
        merchant_id,
        DATE_FORMAT(valid_from, "%Y-%m-%d") AS valid_from,
        DATE_FORMAT(valid_until, "%Y-%m-%d") AS valid_until,
        usage_limit,
        qr_code_url
      FROM coupons 
      WHERE merchant_id = ?`,
      [merchantId]);
    res.json(coupons);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// -----
// Controlador (funcion) para listar cupones filtrados por joven
exports.getUserCoupons = async (req, res) => {
    // recibe id del joven
  const { userId } = req.params;

  // Validación básica
  if (isNaN(userId) || userId <= 0) {
    return res.status(400).json({ error: 'ID de usuario inválido' });
  }

  try {
    // Query para listar cupones de x joven
    const [userCoupons] = await db.query(`
      SELECT 
        c.id,
        c.code,
        c.title,
        c.description,
        c.discount_type,
        DATE_FORMAT(c.valid_until, "%Y-%m-%d") AS valid_until,
        c.merchant_id,
        c.qr_code_url,
        uc.user_id,
        mp.logo_url AS merchant_logo,
        mp.merchant_type,
        mp.merchant_name
    FROM coupons c
    INNER JOIN merchant_profiles mp ON c.merchant_id = mp.user_id
    WHERE c.code = ?;
    `, [userId]);
    res.json(userCoupons);
  } catch (err) {
    console.error('Error al obtener cupones del usuario:', err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// -----
// Controlador (funcion) para validar cupones
exports.validateCoupon = async (req, res) => {
  const { code } = req.params; // recibe 'code' de cupon a validar

  // Validación básica
  if (!code) {
    return res.status(400).json({ error: 'No se adjuntó un código' });
  }

  try {
    // Query para ver si el usuario con 'code' x existe
    const [results] = await db.query(`
      SELECT 
        c.id,
        c.code,
        c.title,
        c.description,
        c.discount_type,
        DATE_FORMAT(c.valid_until, "%Y-%m-%d") AS valid_until,
        c.merchant_id,
        mp.logo_url AS merchant_logo,
        mp.merchant_type,
        mp.merchant_name
      FROM coupons c
      INNER JOIN merchant_profiles mp ON c.merchant_id = mp.user_id
      WHERE c.code = ?;
    `, [code]);

    // Verificar si se encontró el cupón
    if (results.length === 0) {
      return res.status(404).json({ error: 'Cupón no encontrado' });
    }

    const couponData = results[0];
    res.json(couponData);

  } catch (err) {
    console.error('Error al validar cupón:', err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// -----
// Controlador (funcion) para canjear cupón
exports.redeemCoupon = async (req, res) => {
  const { coupon_id } = req.body;
  const user_id = req.user.id;

  try {
    // Verificar si el usuario si tiene el cupon
    const [[existing]] = await db.query('SELECT * FROM user_coupons WHERE user_id = ? AND coupon_id = ?', [user_id, coupon_id]);
    if (existing) return res.status(400).json({ error: 'Cupón ya obtenido' });

    // Registrar uso del cupon
    await db.query('INSERT INTO coupon_redemptions (user_id, coupon_id) VALUES (?, ?)', [user_id, coupon_id]);

    res.json({ message: 'Cupón canjeado' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};