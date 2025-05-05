const { Client } = require('../models');
const { User } = require('../models');
const { Op } = require('sequelize');
const { sequelize } = require('../config/database/connection');

// Listar todos os clientes
exports.listClients = async (req, res) => {
  try {
    let where = {};
    
    // Se for client_admin, só pode ver seu próprio cliente
    if (req.user.role === 'client_admin') {
      // Busca o cliente onde o usuário é o criador
      const client = await Client.findOne({
        where: { created_by: req.user.id }
      });
      
      if (!client) {
        return res.json([]); // Retorna lista vazia se não encontrar
      }
      
      where = { id: client.id };
    }

    const clients = await Client.findAll({
      where,
      include: [{
        model: User,
        as: 'creator',
        attributes: ['id', 'name', 'email']
      }]
    });
    res.json(clients);
  } catch (error) {
    console.error('Erro ao listar clientes:', error);
    res.status(500).json({ error: 'Erro ao listar clientes' });
  }
};

// Obter um cliente específico
exports.getClient = async (req, res) => {
  try {
    // Se for client_admin, verifica se o cliente pertence a ele
    if (req.user.role === 'client_admin') {
      const client = await Client.findOne({
        where: { created_by: req.user.id }
      });
      
      if (!client || client.id !== parseInt(req.params.id)) {
        return res.status(403).json({ error: 'Acesso não autorizado' });
      }
    }

    const client = await Client.findByPk(req.params.id, {
      include: [{
        model: User,
        as: 'creator',
        attributes: ['id', 'name', 'email']
      }]
    });

    if (!client) {
      return res.status(404).json({ error: 'Cliente não encontrado' });
    }

    res.json(client);
  } catch (error) {
    console.error('Erro ao buscar cliente:', error);
    res.status(500).json({ error: 'Erro ao buscar cliente' });
  }
};

// Criar um novo cliente
exports.createClient = async (req, res) => {
  try {
    const { name, address, city, state, phone } = req.body;
    const client = await Client.create({
      name,
      address,
      city,
      state,
      phone,
      created_by: req.user.id // Usuário que está criando o cliente
    });
    res.status(201).json(client);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao criar cliente' });
  }
};

// Atualizar um cliente
exports.updateClient = async (req, res) => {
  try {
    const { name, address, city, state, phone, status } = req.body;
    const client = await Client.findByPk(req.params.id);
    
    if (!client) {
      return res.status(404).json({ error: 'Cliente não encontrado' });
    }

    // Se for client_admin, verifica se o cliente pertence a ele
    if (req.user.role === 'client_admin' && client.created_by !== req.user.id) {
      return res.status(403).json({ error: 'Acesso não autorizado' });
    }

    await client.update({
      name,
      address,
      city,
      state,
      phone,
      status
      // created_by não pode ser alterado manualmente
    });

    res.json(client);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao atualizar cliente' });
  }
};

// Deletar um cliente
exports.deleteClient = async (req, res) => {
  try {
    const client = await Client.findByPk(req.params.id);
    
    if (!client) {
      return res.status(404).json({ error: 'Cliente não encontrado' });
    }

    await client.destroy();
    res.json({ message: 'Cliente deletado com sucesso' });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao deletar cliente' });
  }
};

// Transferir propriedade do cliente
exports.transferOwnership = async (req, res) => {
  try {
    const { new_owner_id } = req.body;
    const client = await Client.findByPk(req.params.id);
    
    if (!client) {
      return res.status(404).json({ error: 'Cliente não encontrado' });
    }

    // Apenas app_admin pode transferir propriedade
    if (req.user.role !== 'app_admin') {
      return res.status(403).json({ error: 'Apenas app_admin pode transferir propriedade de clientes' });
    }

    // Verifica se o novo proprietário existe e é um client_admin
    const newOwner = await User.findOne({
      where: {
        id: new_owner_id,
        role: 'client_admin'
      }
    });

    if (!newOwner) {
      return res.status(400).json({ error: 'Novo proprietário não encontrado ou não é um client_admin' });
    }

    // Atualiza o created_by usando o modelo
    await client.update(
      { created_by: new_owner_id },
      { transferOwnership: true }
    );

    // Busca o cliente atualizado
    const updatedClient = await Client.findByPk(client.id);
    res.json(updatedClient);
  } catch (error) {
    console.error('Erro ao transferir propriedade do cliente:', error);
    res.status(500).json({ error: 'Erro ao transferir propriedade do cliente' });
  }
}; 