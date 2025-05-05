const express = require('express');
const router = express.Router();
const authRoutes = require('./authRoutes');
const userRoutes = require('./userRoutes');
const clientRoutes = require('./clientRoutes');
const driverRoutes = require('./driverRoutes');
const endClientRoutes = require('./endClientRoutes');

// Rotas de autenticação
router.use('/auth', authRoutes);

// Rotas de usuários
router.use('/users', userRoutes);

// Rotas de clientes
router.use('/clients', clientRoutes);

// Rotas de motoristas
router.use('/drivers', driverRoutes);

// Rotas de clientes finais
router.use('/end-clients', endClientRoutes);

module.exports = router; 