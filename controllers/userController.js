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
// -----

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
// -----

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
// -----

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
// -----

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
// -----

// Controlador (funcion) para listar comercios por su tipo
exports.listByMerchantType = async (req, res) => {
  // recibe id del comercio
  const { merchantType } = req.params;
  try {
  // Query para listar cupones de x comercio
    const [users] = await db.query(`
      SELECT * FROM merchant_profiles
      WHERE merchant_type = ?;`,
      [merchantType]);
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
// -----
// Controlador (funcion) para mostrar datos de x joven
exports.datosJoven = async (req, res) => {
  const { id } = req.params; // recibe 'id' de un joven para obtener su info
  // Validación básica
  if (!id) {
    return res.status(400).json({ error: 'No se adjuntó un código' });
  }

  try {
    // Query para ver si el usuario con 'id' existe
    const [results] = await db.query(`
      SELECT
        u.email,
        up.full_name,
        up.curp,
        DATE_FORMAT(up.birth_date, "%Y-%m-%d") AS valid_from,
        up.municipality
      FROM user_profiles up
      JOIN users u ON up.user_id = u.id
      WHERE up.user_id = ?;
    `, [id]);

    // Verificar si se encontró el usuario
    if (results.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    const userData = results[0];
    res.json(userData);

  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({ error: 'Error interno del servidor o el usuario no es un joven' });
  }
};
// ---

// funcion para actualizar el token FCM de un usuario joven
exports.updateFcmToken = async (req, res) => {
  const userId = req.user.id; 
  const { fcm_token } = req.body; // El token que envía la app Kotlin

  if (!fcm_token) {
    return res.status(400).json({ error: 'fcm_token es requerido' });
  }

  try {
    // Actualizamos el token en la tabla user_profiles
    const [result] = await db.query(
      'UPDATE user_profiles SET fcm_token = ? WHERE user_id = ?',
      [fcm_token, userId]
    );

    if (result.affectedRows === 0) {
      // Esto podría pasar si un usuario 'merchant' o 'admin' intenta usar este endpoint
      return res.status(404).json({ error: 'Perfil de usuario no encontrado' });
    }

    res.status(200).json({ message: 'Token de FCM actualizado con éxito' });
  
  } catch (err) {
    console.error('Error al actualizar fcm_token:', err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};
// ---

// funcion para suscribir/desuscribir joven a un comercio
exports.toggleMerchantSubscription = async (req, res) => {
  const userId = req.user.id;
  const { merchantId } = req.params;

  try {
    // 1. Primero, verificamos si la suscripción ya existe
    const [existing] = await db.query(
      'SELECT id FROM merchant_subscriptions WHERE user_id = ? AND merchant_id = ?',
      [userId, merchantId]
    );

    // 2. Si existe, la eliminamos (Unsubscribe)
    if (existing.length > 0) {
      await db.query(
        'DELETE FROM merchant_subscriptions WHERE id = ?', 
        [existing[0].id]
      );
      
      // Devolvemos el nuevo estado
      return res.status(200).json({ 
        message: 'Suscripción eliminada', 
        subscribed: false 
      });
    } 
    
    // 3. Si no existe, la creamos (Subscribe)
    else {
      await db.query(
        'INSERT INTO merchant_subscriptions (user_id, merchant_id) VALUES (?, ?)',
        [userId, merchantId]
      );
      
      // Devolvemos el nuevo estado
      return res.status(201).json({ 
        message: 'Suscripción añadida', 
        subscribed: true 
      });
    }

  } catch (err) {
    // Manejar el error de 'llave única' si algo sale mal en una condición de carrera
    if (err.code === 'ER_DUP_ENTRY') {
      // Esto es poco probable con nuestra lógica, pero es bueno tenerlo
      return res.status(409).json({ error: 'Conflicto de suscripción, intenta de nuevo.' });
    }
    console.error('Error en toggleMerchantSubscription:', err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};