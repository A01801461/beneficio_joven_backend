const express = require('express');
const userController = require('../controllers/userController');
const { verifyToken, checkRole } = require('../middleware/auth');  // Importa ambos

const router = express.Router();

// metodos post
router.post('/users', verifyToken, checkRole(['admin', 'super_admin']), userController.createUser);

// metodos get
router.get('/users', verifyToken, checkRole(['admin', 'super_admin']), userController.listUsers);
router.get('/allusers', userController.listUsersPub); // igual que /users pero sin auth
router.get('/merchants', userController.listMerchants);
router.get('/admins', userController.listAdmins);
router.get('/jovenes', userController.listJovenes);

module.exports = router;