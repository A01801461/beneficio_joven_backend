const express = require('express');
const couponController = require('../controllers/couponController');
const { verifyToken, checkRole } = require('../middleware/auth');

const router = express.Router();

// router.post('/coupons', verifyToken, checkRole(['admin', 'super_admin']), couponController.createCoupon);
router.post('/coupons', couponController.createCoupon);
router.get('/coupons', couponController.listCoupons);  // Público
router.get('/stats', couponController.couponStats);  // Público
router.get('/coupons/merchant/:merchantId', couponController.listByMerchant);
router.get('/users/:userId/coupons', couponController.getUserCoupons);
router.get('/validar/:code', couponController.validateCoupon);
router.post('/coupons/redeem', verifyToken, checkRole(['user', 'merchant']), couponController.redeemCoupon);

module.exports = router;