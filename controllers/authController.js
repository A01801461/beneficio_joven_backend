const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Registro de usuario (especifica role en body)
exports.register = async (req, res) => {
  const { email, password, role, profileData } = req.body;  // profileData depende del role
  if (!email || !password || !role) return res.status(400).json({ error: 'Faltan campos requeridos' });

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const [result] = await db.query('INSERT INTO users (email, password, role) VALUES (?, ?, ?)', [email, hashedPassword, role]);
    const userId = result.insertId;

    // Insertar perfil según role
    if (role === 'user') {
      const { full_name, curp, birth_date, municipality } = profileData;
      await db.query('INSERT INTO user_profiles (user_id, full_name, curp, birth_date, municipality) VALUES (?, ?, ?, ?, ?)', [userId, full_name, curp, birth_date, municipality]);
    } else if (role === 'merchant') {
      const { merchant_name, description, logo_url, merchant_type } = profileData;
      await db.query('INSERT INTO merchant_profiles (user_id, merchant_name, description, logo_url, merchant_type) VALUES (?, ?, ?, ?, ?)', [userId, merchant_name, description, logo_url, merchant_type]);
    } else if (role === 'admin' || role === 'super_admin') {
      const { full_name, is_super_admin } = profileData;
      await db.query('INSERT INTO admin_profiles (user_id, full_name, is_super_admin) VALUES (?, ?, ?)', [userId, full_name, !!is_super_admin]);
    }

    res.status(201).json({ message: 'Usuario registrado', userId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Login
exports.login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Faltan credenciales' });

  try {
    const [[user]] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token, role: user.role });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};