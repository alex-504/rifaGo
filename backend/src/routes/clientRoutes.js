const express = require('express');
const router = express.Router();
const clientController = require('../controllers/clientController');
const { authMiddleware, checkRole } = require('../middlewares/auth');

// Rotas protegidas por autenticação
router.use(authMiddleware);

// Rotas de clientes
router.get('/', checkRole(['app_admin', 'client_admin']), clientController.listClients);
router.get('/:id', checkRole(['app_admin', 'client_admin']), clientController.getClient);
router.post('/', checkRole('app_admin'), clientController.createClient);
router.put('/:id', checkRole('app_admin'), clientController.updateClient);
router.delete('/:id', checkRole('app_admin'), clientController.deleteClient);
router.post('/:id/transfer', checkRole('app_admin'), clientController.transferOwnership);

module.exports = router; 