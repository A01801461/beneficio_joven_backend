const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Joi = require('joi');

// Schemas de validación
const registerSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  role: Joi.string().valid('user', 'merchant', 'admin', 'super_admin').required(),
  profileData: Joi.object().required(),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

// Registro
exports.register = async (req, res) => {
  const { error } = registerSchema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  const { email, password, role, profileData } = req.body;

  try {
    // Chequea si email existe
    const [[existingUser]] = await db.query('SELECT id FROM users WHERE email = ?', [email]);
    if (existingUser) return res.status(409).json({ error: 'Email ya registrado' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const [result] = await db.query('INSERT INTO users (email, password, role) VALUES (?, ?, ?)', [email, hashedPassword, role]);
    const userId = result.insertId;

    // Insertar perfil según role (agrega validaciones específicas si quieres)
    if (role === 'user') {
      const { full_name, curp, birth_date, municipality } = profileData;
      await db.query('INSERT INTO user_profiles (user_id, full_name, curp, birth_date, municipality) VALUES (?, ?, ?, ?, ?)', [userId, full_name, curp, birth_date, municipality]);
    } else if (role === 'merchant') {
      const { merchant_name, description, logo_url, merchant_type } = profileData;
      await db.query('INSERT INTO merchant_profiles (user_id, merchant_name, description, logo_url, merchant_type) VALUES (?, ?, ?, ?, ?)', [userId, merchant_name, description, logo_url, merchant_type]);
    } else if (role === 'admin' || role === 'super_admin') {
      const { full_name, is_super_admin } = profileData;
      await db.query('INSERT INTO admin_profiles (user_id, full_name, is_super_admin) VALUES (?, ?, ?)', [userId, full_name, !!is_super_admin]);
    } else {
      return res.status(400).json({ error: 'Rol inválido' });
    }

    res.status(201).json({ message: 'Usuario registrado', userId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Login (sin cambios mayores, pero con validación)
exports.login = async (req, res) => {
  const { error } = loginSchema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  const { email, password } = req.body;

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