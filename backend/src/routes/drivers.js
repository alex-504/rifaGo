const express = require('express');
const router = express.Router();
const driverController = require('../controllers/driverController');
const { authMiddleware, checkRole } = require('../middlewares/auth');

// Rotas protegidas por autenticação
router.use(authMiddleware);

// Listar motoristas (app_admin e client_admin)
router.get('/', checkRole(['app_admin', 'client_admin']), driverController.listDrivers);

// Obter um motorista específico (app_admin e client_admin)
router.get('/:id', checkRole(['app_admin', 'client_admin']), driverController.getDriver);

// Criar motorista (app_admin e client_admin)
router.post('/', checkRole(['app_admin', 'client_admin']), driverController.createDriver);

// Atualizar motorista (app_admin e client_admin)
router.put('/:id', checkRole(['app_admin', 'client_admin']), driverController.updateDriver);

// Deletar motorista (app_admin e client_admin)
router.delete('/:id', checkRole(['app_admin', 'client_admin']), driverController.deleteDriver);

module.exports = router; 