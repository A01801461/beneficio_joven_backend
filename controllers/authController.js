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
const emailService = require('../utils/emailService'); // importando servicio de email
const crypto = require('crypto'); // importando crypto (node module para generar tokens seguros)

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

// --- NUEVOS SCHEMAS PARA RECUPERACIÓN DE CONTRASEÑA ---
const requestResetSchema = Joi.object({
    email: Joi.string().email().required(),
});

const resetPasswordSchema = Joi.object({
    token: Joi.string().required(),
    newPassword: Joi.string().min(6).required(),
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

    // Checa si CURP existe en la BD (solo para rol 'user')
    if (role === 'user') {
      const { curp } = profileData;
      const [[existingCurp]] = await db.query('SELECT user_id FROM user_profiles WHERE curp = ?', [curp]);
      if (existingCurp) return res.status(409).json({ error: 'CURP ya registrado' });
    }

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
    
    // Verificar si el email existe
    if (!user) {
      return res.status(404).json({ error: 'no existe un cuenta asociada al Email' });
    }

    // Verificar si el password es válido
    if (!(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: 'Contraseña inválida' });
    }

    // Si las credenciales son correctas, se otorga un token que dura una hora
    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token, role: user.role, id: user.id });
  } catch (err) {
    res.status(500).json({ error: err.message }); // Si se genera algun error del server
  }
};
// -----

// controlador (funcion) para solicitar el reseteo de contraseña (VERSIÓN CORREGIDA)
exports.requestPasswordReset = async (req, res) => {
    // 1. (CORREGIDO) Validar el cuerpo de la petición
    const { error } = requestResetSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    // 2. (CORREGIDO) Obtener el email del body
    const { email } = req.body;

    try {
        // 3. (CORREGIDO) Verificar si el usuario existe en la base de datos
        const [[user]] = await db.query('SELECT id FROM users WHERE email = ?', [email]);

        // 4. Si el usuario NO existe, enviamos una respuesta genérica por seguridad
        // para no revelar qué correos están registrados.
        if (!user) {
            return res.status(200).json({ message: 'Si existe una cuenta con este correo, se ha enviado un código de recuperación.' });
        }

        // Si el usuario SÍ existe, procedemos a crear el token
        const resetToken = crypto.randomBytes(32).toString('hex');
        const expiresAt = new Date(Date.now() + 3600000); // 1 hora desde ahora

        // Limpiamos tokens viejos para este email y guardamos el nuevo
        await db.query('DELETE FROM password_reset_tokens WHERE email = ?', [email]);
        await db.query(
            'INSERT INTO password_reset_tokens (email, token, expires_at) VALUES (?, ?, ?)',
            [email, resetToken, expiresAt]
        );

        // 5. Enviar el correo electrónico real
        try {
            await emailService.sendPasswordResetEmail(email, resetToken);
        } catch (emailError) {
            // Si el correo falla, es un error del servidor, pero no lo revelamos al usuario.
            // Lo registramos para que tú puedas depurarlo.
            console.error(`FALLO CRÍTICO: No se pudo enviar el correo a ${email}. Error: ${emailError.message}`);
        }

        // 6. La respuesta al usuario siempre es la misma
        res.status(200).json({ message: 'Si existe una cuenta con este correo, se ha enviado un código de recuperación.' });

    } catch (err) {
        // Este catch atrapará errores de la base de datos
        console.error("Error en requestPasswordReset:", err.message);
        res.status(500).json({ error: "Ocurrió un error en el servidor." });
    }
};

// -----
// NUEVO: controlador (funcion) para validar el token y cambiar la contraseña
exports.resetPassword = async (req, res) => {
    const { error } = resetPasswordSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const { token, newPassword } = req.body;

    try {
        // 1. Buscar el token en la base de datos
        const [[tokenData]] = await db.query('SELECT * FROM password_reset_tokens WHERE token = ?', [token]);

        if (!tokenData) {
            return res.status(400).json({ error: 'El código de recuperación es inválido.' });
        }

        // 2. Verificar si el token ha expirado
        if (new Date(tokenData.expires_at) < new Date()) {
            // Eliminar el token expirado
            await db.query('DELETE FROM password_reset_tokens WHERE token = ?', [token]);
            return res.status(400).json({ error: 'El código de recuperación ha expirado. Por favor, solicita uno nuevo.' });
        }

        // 3. Encriptar la nueva contraseña
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // 4. Actualizar la contraseña en la tabla de usuarios
        await db.query('UPDATE users SET password = ? WHERE email = ?', [hashedPassword, tokenData.email]);

        // 5. Eliminar el token de la base de datos para que no se pueda reutilizar
        await db.query('DELETE FROM password_reset_tokens WHERE token = ?', [token]);

        res.status(200).json({ message: 'Contraseña actualizada correctamente.' });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};