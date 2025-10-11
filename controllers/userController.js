//----------------------------------------------------------
// /controllers/userController.js
//
// Controlador de autenticacion (login & register).
//
// Fecha: 11-Oct-2025
// Autores: Equipo 2 - Gpo 401
//----------------------------------------------------------

const db = require('../config/db'); // importando archivo de configuracion de conexion a BD

// Controlador (funcion) para crear usuario (para admins, similar a register)
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

// Controlador (funcion) para listar usuarios
exports.listUsers = async (req, res) => {
  try {
    // listar todos los usuarios (de todos los roles)
    const [users] = await db.query('SELECT id, email, role, DATE_FORMAT(created_at, "%Y-%m-%d") AS created_at FROM users');
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Controlador (funcion) para listar comercios
exports.listMerchants = async (req, res) => {
  try {
    // listar todos los comercios
    const [users] = await db.query('SELECT * FROM merchant_profiles');
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Controlador (funcion) para listar comercios
exports.listAdmins = async (req, res) => {
  try {
    // listar todos los admins
    const [users] = await db.query('SELECT * FROM admin_profiles');
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Controlador (funcion) para listar comercios
exports.listJovenes = async (req, res) => {
  try {
    // listar todos los jovenes
    const [users] = await db.query('SELECT user_id, full_name, curp, DATE_FORMAT(birth_date, "%Y-%m-%d") AS birth_date FROM user_profiles');
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};