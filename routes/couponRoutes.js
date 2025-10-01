const express = require('express');
const couponController = require('../controllers/couponController');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

router.post('/coupons', authMiddleware, couponController.createCoupon);
router.get('/coupons', couponController.listCoupons);  // Público
router.get('/coupons/merchant/:merchantId', couponController.listByMerchant);
router.get('/users/:userId/coupons', couponController.getUserCoupons);
router.post('/coupons/redeem', authMiddleware, couponController.redeemCoupon);

module.exports = router;