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

// POST
router.post('/users', verifyToken, checkRole(['admin', 'super_admin']), userController.createUser); // crear usuario (con seguridad)

// GET
router.get('/users', verifyToken, checkRole(['admin', 'super_admin']), userController.listUsers); // verificar token (con seguridad)
router.get('/allusers', verifyToken, checkRole(['admin', 'super_admin']), userController.listUsers); // listar todos los usuario
router.get('/merchants', verifyToken, userController.listMerchants); // listar comercios
router.get('/admins', verifyToken, checkRole(['admin', 'super_admin']), userController.listAdmins); // listar admins
router.get('/jovenes', verifyToken, checkRole(['admin', 'super_admin']), userController.listJovenes); // listar jovenes
router.get('/merchants/:merchantType', verifyToken, userController.listByMerchantType); // listar comercios de x tipo
router.get('/joven/:id', verifyToken, checkRole(['user']), userController.datosJoven); // info de x joven
router.get('/joven/:id', verifyToken, checkRole(['user']), userController.datosJoven); // info de x joven
router.put('/profile/fcm-token', verifyToken, checkRole(['user']), userController.updateFcmToken); // actualizar FCM token
router.post('/merchants/:merchantId/toggle-subscription', verifyToken, checkRole(['user']), userController.toggleMerchantSubscription); // suscribir/desuscribir joven a comercio
router.delete('/users/:userId', verifyToken, checkRole(['admin', 'super_admin']), userController.deleteUser); // eliminar usuario y toda su info relacionada

module.exports = router;