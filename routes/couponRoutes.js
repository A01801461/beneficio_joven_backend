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
router.post('/coupons', couponController.createCoupon); // Ruta para crear cupon (sin seguridad)
router.post('/coupons/redeem', verifyToken, checkRole(['user', 'merchant']), couponController.redeemCoupon);  // Redimir cupon (con seguridad)
router.post('/coupons/like', verifyToken, checkRole(['user']),  couponController.likeCoupon); // Ruta para likear/deslikear cupon (con seguridad)
// GET
router.get('/coupons', couponController.listCoupons); // listar todos los cupones (sin seguridad)
router.get('/stats', couponController.couponStats);  // listar estadisticas de cupones (sin seguridad)
router.get('/coupons/merchant/:merchantId', couponController.listByMerchant); // listar cupones de x comercio (sin seguridad)
router.get('/users/:userId/coupons', couponController.getUserCoupons); // listar cupones x usuario (sin seguridad)
router.get('/validar/:code', couponController.validateCoupon); // validar cupon (sin seguridad)

// DELETE
router.delete('/coupons/:couponId', couponController.deleteCoupon); // Ruta para borrar cupon

module.exports = router;