//----------------------------------------------------------
// /routes/couponRoutes.js
//
// Rutas de endpoints de cupones (consultar, filtrar y subir cupones).
//
// IMPORTANTE: Varias rutas AUN no tienen implementada la autenticación ni seguridad implementadas (para pruebas)
//
// Fecha: 11-Oct-2025
// Autores: Equipo 2 - Gpo 401
//----------------------------------------------------------

const express = require('express'); // importando express
const couponController = require('../controllers/couponController'); // importando controlador de cupones
const { verifyToken, checkRole } = require('../middleware/auth');  // importando middleware

const router = express.Router();

/// POST
router.post('/coupons', verifyToken, checkRole(['admin', 'super_admin']), couponController.createCoupon); // Ruta para crear cupon (con seguridad)
router.post('/coupons/redeem', verifyToken, checkRole(['user', 'merchant']), couponController.redeemCoupon);  // Redimir cupon (con seguridad)
router.post('/coupons/like', verifyToken, checkRole(['user']),  couponController.likeCoupon); // Ruta para likear/deslikear cupon (con seguridad)
// GET
router.get('/coupons', verifyToken, checkRole(['user', 'admin', 'super_admin']), couponController.listCoupons); // listar todos los cupones (con seguridad)
router.get('/stats', verifyToken, checkRole(['admin', 'super_admin']), couponController.couponStats);  // listar estadisticas de cupones (con seguridad)
router.get('/coupons/merchant/:merchantId', verifyToken, couponController.listByMerchant); // listar cupones de x comercio (con seguridad)
router.get('/users/:userId/coupons', verifyToken, checkRole(['user']),couponController.getUserCoupons); // listar cupones x usuario (con seguridad)
router.get('/validar/:code', verifyToken, checkRole(['merchant']),couponController.validateCoupon); // validar cupon (con seguridad)

// DELETE
router.delete('/coupons/:couponId', verifyToken, checkRole(['admin', 'super_admin']),couponController.deleteCoupon); // Ruta para borrar cupon

module.exports = router;