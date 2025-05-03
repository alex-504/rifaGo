const Driver = require('../models/Driver');
const Client = require('../models/Client');

// Listar motoristas
exports.listDrivers = async (req, res) => {
  try {
    const where = {};
    
    // Se for client_admin, só pode ver seus próprios motoristas
    if (req.user.role === 'client_admin') {
      // Busca o cliente onde o usuário é o criador
      const client = await Client.findOne({
        where: { created_by: req.user.id }
      });
      
      if (!client) {
        return res.json([]); // Retorna lista vazia se não encontrar
      }
      
      where.client_id = client.id;
    }

    const drivers = await Driver.findAll({
      where,
      include: [{
        model: Client,
        as: 'client',
        attributes: ['id', 'name']
      }]
    });

    res.json(drivers);
  } catch (error) {
    console.error('Erro ao listar motoristas:', error);
    res.status(500).json({ error: 'Erro ao listar motoristas' });
  }
};

// Obter um motorista específico
exports.getDriver = async (req, res) => {
  try {
    const where = { id: req.params.id };
    
    // Se for client_admin, só pode ver seus próprios motoristas
    if (req.user.role === 'client_admin') {
      // Busca o cliente onde o usuário é o criador
      const client = await Client.findOne({
        where: { created_by: req.user.id }
      });
      
      if (!client) {
        return res.status(404).json({ error: 'Cliente não encontrado' });
      }
      
      where.client_id = client.id;
    }

    const driver = await Driver.findOne({
      where,
      include: [{
        model: Client,
        as: 'client',
        attributes: ['id', 'name']
      }]
    });

    if (!driver) {
      return res.status(404).json({ error: 'Motorista não encontrado' });
    }

    res.json(driver);
  } catch (error) {
    console.error('Erro ao buscar motorista:', error);
    res.status(500).json({ error: 'Erro ao buscar motorista' });
  }
};

// Criar motorista
exports.createDriver = async (req, res) => {
  try {
    const { name, cnh, cnh_expiration, phone } = req.body;

    let client_id;

    // Se for client_admin, usa o ID do cliente associado ao usuário
    if (req.user.role === 'client_admin') {
      const client = await Client.findOne({
        where: { created_by: req.user.id }
      });
      
      if (!client) {
        return res.status(400).json({ error: 'Cliente não encontrado para este usuário' });
      }
      
      client_id = client.id;
    } else {
      // Se for app_admin, requer client_id no body
      if (!req.body.client_id) {
        return res.status(400).json({ error: 'client_id é obrigatório' });
      }
      client_id = req.body.client_id;
    }

    // Garante que o created_by seja sempre o usuário autenticado
    const driver = await Driver.create({
      name,
      cnh,
      cnh_expiration,
      phone,
      client_id,
      created_by: req.user.id // Sempre usa o ID do usuário autenticado
    });

    res.status(201).json(driver);
  } catch (error) {
    console.error('Erro ao criar motorista:', error);
    res.status(500).json({ error: 'Erro ao criar motorista' });
  }
};

// Atualizar motorista
exports.updateDriver = async (req, res) => {
  try {
    const { name, cnh, cnh_expiration, phone, status } = req.body;
    const where = { id: req.params.id };
    
    // Se for client_admin, só pode atualizar seus próprios motoristas
    if (req.user.role === 'client_admin') {
      // Busca o cliente onde o usuário é o criador
      const client = await Client.findOne({
        where: { created_by: req.user.id }
      });
      
      if (!client) {
        return res.status(404).json({ error: 'Cliente não encontrado' });
      }
      
      where.client_id = client.id;
    }

    const driver = await Driver.findOne({ where });

    if (!driver) {
      return res.status(404).json({ error: 'Motorista não encontrado' });
    }

    await driver.update({
      name,
      cnh,
      cnh_expiration,
      phone,
      status
    });

    res.json(driver);
  } catch (error) {
    console.error('Erro ao atualizar motorista:', error);
    res.status(500).json({ error: 'Erro ao atualizar motorista' });
  }
};

// Deletar motorista
exports.deleteDriver = async (req, res) => {
  try {
    const where = { id: req.params.id };
    
    // Se for client_admin, só pode deletar seus próprios motoristas
    if (req.user.role === 'client_admin') {
      // Busca o cliente onde o usuário é o criador
      const client = await Client.findOne({
        where: { created_by: req.user.id }
      });
      
      if (!client) {
        return res.status(404).json({ error: 'Cliente não encontrado' });
      }
      
      where.client_id = client.id;
    }

    const driver = await Driver.findOne({ where });

    if (!driver) {
      return res.status(404).json({ error: 'Motorista não encontrado' });
    }

    await driver.destroy();
    res.status(204).send();
  } catch (error) {
    console.error('Erro ao deletar motorista:', error);
    res.status(500).json({ error: 'Erro ao deletar motorista' });
  }
}; 