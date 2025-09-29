const db = require('../config/db');

// Crear usuario (para admins, similar a register pero sin profileData por simplicidad)
exports.createUser = async (req, res) => {
  const { email, password, role } = req.body;  // Agrega profileData si necesitas
  if (req.user.role !== 'admin' && req.user.role !== 'super_admin') return res.status(403).json({ error: 'No autorizado' });

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
  if (req.user.role !== 'admin' && req.user.role !== 'super_admin') return res.status(403).json({ error: 'No autorizado' });

  try {
    const [users] = await db.query('SELECT id, email, role, created_at FROM users');
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};