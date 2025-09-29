const db = require('../config/db');

// Crear cupón (para admins)
exports.createCoupon = async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'No autorizado' });
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
    const [coupons] = await db.query('SELECT * FROM coupons');
    res.json(coupons);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Canjear cupón (para merchant)
exports.redeemCoupon = async (req, res) => {
  if (req.user.role !== 'merchant') return res.status(403).json({ error: 'No autorizado' });
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