const express = require('express');
const router = express.Router();
const clientController = require('../controllers/clientController');
const { authMiddleware, checkRole } = require('../middlewares/auth');

// Todas as rotas requerem autenticação
router.use(authMiddleware);

// Rotas que requerem role de app_admin
router.post('/', checkRole('app_admin'), clientController.createClient);
router.put('/:id', checkRole('app_admin'), clientController.updateClient);
router.delete('/:id', checkRole('app_admin'), clientController.deleteClient);

// Rotas que podem ser acessadas por app_admin e client_admin
router.get('/', checkRole(['app_admin', 'client_admin']), clientController.listClients);
router.get('/:id', checkRole(['app_admin', 'client_admin']), clientController.getClient);

module.exports = router; 