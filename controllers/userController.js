const db = require('../config/db');

// Crear usuario (para admins, similar a register pero sin profileData por simplicidad)
exports.createUser = async (req, res) => {
  const { email, password, role } = req.body;  // Agrega profileData si necesitas
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const [result] = await db.query('INSERT INTO users (email, password, role) VALUES (?, ?, ?)', [email, hashedPassword, role]);
    res.status(201).json({ message: 'Usuario creado', userId: result.insertId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Listar usuarios (para admins)
exports.listUsers = async (req, res) => {
  try {
    const [users] = await db.query('SELECT id, email, role, DATE_FORMAT(created_at, "%Y-%m-%d") AS created_at FROM users');
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Listar comercios (publico) - SOLO PARA TESTS
exports.listMerchants = async (req, res) => {
  try {
    const [users] = await db.query('SELECT * FROM merchant_profiles');
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Listar comercios (publico) - SOLO PARA TESTS
exports.listAdmins = async (req, res) => {
  try {
    const [users] = await db.query('SELECT * FROM admin_profiles');
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Listar comercios (publico) - SOLO PARA TESTS
exports.listJovenes = async (req, res) => {
  try {
    const [users] = await db.query('SELECT user_id, full_name, curp, DATE_FORMAT(birth_date, "%Y-%m-%d") AS birth_date FROM user_profiles');
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};