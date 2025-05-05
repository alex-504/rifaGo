const express = require('express');
const router = express.Router();
const endClientController = require('../controllers/endClientController');
const authMiddleware = require('../middlewares/authMiddleware');

// Todas as rotas requerem autenticação
router.use(authMiddleware);

// Listar todos os clientes finais
router.get('/', endClientController.listEndClients);

// Obter um cliente final específico
router.get('/:id', endClientController.getEndClient);

// Criar um novo cliente final
router.post('/', endClientController.createEndClient);

// Atualizar um cliente final
router.put('/:id', endClientController.updateEndClient);

// Deletar um cliente final
router.delete('/:id', endClientController.deleteEndClient);

module.exports = router; 