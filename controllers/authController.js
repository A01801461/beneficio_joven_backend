//----------------------------------------------------------
// /controllers/authController.js
//
// Controlador de autenticacion (login & register).
//
// IMPORTANTE: AUN faltan features:
//             - recuperacion de password
//             - requisitos de usuarios (solo jovenes de Atizapan, etc.)
//
// Fecha: 11-Oct-2025
// Autores: Equipo 2 - Gpo 401
//----------------------------------------------------------

const db = require('../config/db'); // importando archivo de configuracion de conexion a BD
const bcrypt = require('bcryptjs'); // importando bycrypt (node module de encripcion)
const jwt = require('jsonwebtoken'); // importando jsonwebtoken (node module para manejo de tokens y sesiones)
const Joi = require('joi'); // importando joi (node module para esquemas de formularios)

// esquema de registro
const registerSchema = Joi.object({
  email: Joi.string().email().required(), // requiere email
  password: Joi.string().min(6).required(), // requiere password
  role: Joi.string().valid('user', 'merchant', 'admin', 'super_admin').required(), // requiere rol
  profileData: Joi.object().required(), // resto de datos: CURP, municipio, fecha de nacimiento, etc. (depende rol)
});

// esquema de login
const loginSchema = Joi.object({
  email: Joi.string().email().required(), // requiere email
  password: Joi.string().required(), // requiere password
});

// -----
// controlador (funcion) de registro
exports.register = async (req, res) => {
  const { error } = registerSchema.validate(req.body); // ERROR: no coincide con el esquema de registro
  if (error) return res.status(400).json({ error: error.details[0].message });

  // parametros de la funcion
  const { email, password, role, profileData } = req.body;

  try {
    // Checa si email existe en la BD
    const [[existingUser]] = await db.query('SELECT id FROM users WHERE email = ?', [email]);
    if (existingUser) return res.status(409).json({ error: 'Email ya registrado' });

    const hashedPassword = await bcrypt.hash(password, 10); // encriptamos password
    const [result] = await db.query('INSERT INTO users (email, password, role) VALUES (?, ?, ?)', [email, hashedPassword, role]); // insert a tabla general de users
    const userId = result.insertId;

    // Insertar resto de datos del perfil según rol
    if (role === 'user') { // si es Joven
      const { full_name, curp, birth_date, municipality } = profileData;
      await db.query('INSERT INTO user_profiles (user_id, full_name, curp, birth_date, municipality) VALUES (?, ?, ?, ?, ?)', [userId, full_name, curp, birth_date, municipality]);
    } else if (role === 'merchant') { // si es Comercio
      const { merchant_name, description, logo_url, merchant_type } = profileData;
      await db.query('INSERT INTO merchant_profiles (user_id, merchant_name, description, logo_url, merchant_type) VALUES (?, ?, ?, ?, ?)', [userId, merchant_name, description, logo_url, merchant_type]);
    } else if (role === 'admin' || role === 'super_admin') { // si es Admin
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

// -----
// controlador (funcion) de Login
exports.login = async (req, res) => {
  const { error } = loginSchema.validate(req.body);  // ERROR: no coincide con el esquema de login
  if (error) return res.status(400).json({ error: error.details[0].message });

  // parametros de la funcion
  const { email, password } = req.body;

  // buscar credenciales en BD
  try {
    const [[user]] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: 'Credenciales inválidas' }); // ERROR: no se encuentran las credenciales
    }

    // Si se encuentran se otorga un token que dura una hora
    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token, role: user.role });
  } catch (err) {
    res.status(500).json({ error: err.message }); // Si se genera algun error del server
  }
};