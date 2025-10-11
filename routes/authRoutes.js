//----------------------------------------------------------
// /routes/authRoutes.js
//
// Rutas de endpoint de autenticacion (login & register).
//
// Fecha: 11-Oct-2025
// Autores: Equipo 2 - Gpo 401
//----------------------------------------------------------

const express = require('express'); // importando express
const authController = require('../controllers/authController'); // importando controllador de autenticaciones
const { verifyToken, checkRole } = require('../middleware/auth'); // importando middleware

const router = express.Router();

// POST
router.post('/register', authController.register); // ruta para registro
router.post('/login', authController.login); // ruta para login

module.exports = router;