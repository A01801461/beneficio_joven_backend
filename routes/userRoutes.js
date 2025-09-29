const express = require('express');
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/auth');  // Definir abajo

const router = express.Router();

router.post('/users', authMiddleware, userController.createUser);
router.get('/users', authMiddleware, userController.listUsers);

module.exports = router;