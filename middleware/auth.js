//----------------------------------------------------------
// /middleware/auth.js
//
// Middleware para auth.
//
// Fecha: 11-Oct-2025
// Autores: Equipo 2 - Gpo 401
//----------------------------------------------------------

const jwt = require('jsonwebtoken');  // global

// Middleware para verificar el token de la sesion
exports.verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  console.log('📥 Header recibido en verify:', authHeader ? authHeader.substring(0, 30) + '...' : '❌ SIN HEADER');

  const token = authHeader?.split(' ')[1];
  console.log('📥 Token extraído (primeros 20 chars):', token ? token.substring(0, 20) + '...' : '❌ NULL');

  if (!token) return res.status(401).json({ error: 'Token requerido' });

  console.log('🔑 Secret usado en verify:', process.env.JWT_SECRET ? process.env.JWT_SECRET.substring(0, 10) + '...' : '❌ NO CARGADO');

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('✅ Verify exitoso. Decoded role:', decoded.role);
    req.user = decoded;
    next();
  } catch (err) {
    console.error('❌ Error en verify - Tipo:', err.name, 'Mensaje:', err.message);
    res.status(401).json({ error: 'Token inválido', debug: err.message });
  }
};

// Middleware para verificar el rol del usuario de la sesion
exports.checkRole = (allowedRoles) => (req, res, next) => {
  if (!allowedRoles.includes(req.user.role)) {
    return res.status(403).json({ error: 'No autorizado: Rol insuficiente' });
  }
  next();
};