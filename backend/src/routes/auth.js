const { Router } = require('express');
const AuthController = require('../controllers/AuthController');
const { authMiddleware } = require('../middlewares/auth');

const router = Router();

router.post('/login', AuthController.login);
router.post('/logout', authMiddleware, AuthController.logout);

module.exports = router; 