//----------------------------------------------------------
// /routes/userRoutes.js
//
// Rutas de endpoints de usuarios (consultar y filtrar).
//
// IMPORTANTE: Varias rutas AUN no tienen implementada la autenticación ni seguridad implementadas (para pruebas)
//
// Fecha: 11-Oct-2025
// Autores: Equipo 2 - Gpo 401
//----------------------------------------------------------

const express = require('express'); // importando express
const userController = require('../controllers/userController'); // importando controlador de usuarios
const { verifyToken, checkRole } = require('../middleware/auth');  // Importando middleware

const router = express.Router();

// POS
router.post('/users', verifyToken, checkRole(['admin', 'super_admin']), userController.createUser); // crear usuario (con seguridad)

// GET
router.get('/users', verifyToken, checkRole(['admin', 'super_admin']), userController.listUsers); // verificar token (con seguridad)
router.get('/allusers', userController.listUsers); // listar todos los usuario
router.get('/merchants', userController.listMerchants); // listar comercios
router.get('/admins', userController.listAdmins); // listar admins
router.get('/jovenes', userController.listJovenes); // listar jovenes
router.get('/merchants/:merchantType', userController.listByMerchantType); // listar comercios de x tipo
router.get('/joven/:id', userController.datosJoven); // info de x joven

module.exports = router;