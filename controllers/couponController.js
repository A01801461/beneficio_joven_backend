const db = require('../config/db');

// Crear cupón (para admins)
exports.createCoupon = async (req, res) => {
  const { code, title, description, discount_type, valid_until, usage_limit, qr_code_url } = req.body;
  const merchant_id = req.user.id;

  try {
    const [result] = await db.query(
      'INSERT INTO coupons (code, title, description, discount_type, merchant_id, valid_until, usage_limit, qr_code_url) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [code, title, description, discount_type, merchant_id, valid_until, usage_limit, qr_code_url]
    );
    res.status(201).json({ message: 'Cupón creado', couponId: result.insertId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Listar cupones (público o por merchant)
exports.listCoupons = async (req, res) => {
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

// Estadisticas generales de cupones
exports.couponStats = async (req, res) => {
  try {
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

// Lista cupones filtrados por vendedor
exports.listByMerchant = async (req, res) => {
  const { merchantId } = req.params;
  try {
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

exports.getUserCoupons = async (req, res) => {
  const { userId } = req.params;

  // Validación básica
  if (isNaN(userId) || userId <= 0) {
    return res.status(400).json({ error: 'ID de usuario inválido' });
  }

  try {
    // Hacemos JOIN para traer los datos del cupón (no solo el ID)
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
    FROM user_coupons uc
    INNER JOIN coupons c ON uc.coupon_id = c.id
    INNER JOIN merchant_profiles mp ON c.merchant_id = mp.user_id
    WHERE uc.user_id = ?;
    `, [userId]);
    res.json(userCoupons);
  } catch (err) {
    console.error('Error al obtener cupones del usuario:', err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// Canjear cupón (para merchant)
exports.redeemCoupon = async (req, res) => {
  const { coupon_id } = req.body;
  const user_id = req.user.id;

  try {
    // Verificar si ya obtenido
    const [[existing]] = await db.query('SELECT * FROM user_coupons WHERE user_id = ? AND coupon_id = ?', [user_id, coupon_id]);
    if (existing) return res.status(400).json({ error: 'Cupón ya obtenido' });

    // Insertar en user_coupons y redemptions (asumiendo canje inmediato)
    await db.query('INSERT INTO user_coupons (user_id, coupon_id) VALUES (?, ?)', [user_id, coupon_id]);
    await db.query('INSERT INTO coupon_redemptions (user_id, coupon_id) VALUES (?, ?)', [user_id, coupon_id]);

    res.json({ message: 'Cupón canjeado' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};