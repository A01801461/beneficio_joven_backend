const express = require('express');
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/auth');  // Definir abajo

const router = express.Router();

// metodos post
router.post('/users', authMiddleware, userController.createUser);

// metodos get
router.get('/users', authMiddleware, userController.listUsers);
router.get('/allusers', userController.listUsersPub); // igual que /users, pero sin necesidad de auth (solo para pruebas)
router.get('/merchants', userController.listMerchants);
router.get('/admins', userController.listAdmins);
router.get('/jovenes', userController.listJovenes);

module.exports = router;