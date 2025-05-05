const EndClient = require('../models/EndClient');
const Client = require('../models/Client');

// Funções de validação
const validateRequiredFields = (data) => {
  const requiredFields = ['name', 'address', 'city', 'state', 'phone'];
  const missingFields = requiredFields.filter(field => !data[field]);
  
  if (missingFields.length > 0) {
    return {
      isValid: false,
      error: `Campos obrigatórios não preenchidos: ${missingFields.join(', ')}`
    };
  }
  return { isValid: true };
};

const validatePhone = (phone) => {
  // Remove caracteres não numéricos
  const cleanPhone = phone.replace(/\D/g, '');
  
  // Verifica se tem 10 ou 11 dígitos (com ou sem DDD)
  if (cleanPhone.length < 10 || cleanPhone.length > 11) {
    return {
      isValid: false,
      error: 'Telefone inválido. Deve conter 10 ou 11 dígitos'
    };
  }
  return { isValid: true };
};

// Listar clientes finais
exports.listEndClients = async (req, res) => {
  try {
    const where = {};
    
    // Se for client_admin, só pode ver seus próprios clientes finais
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

    const endClients = await EndClient.findAll({
      where,
      include: [{
        model: Client,
        as: 'client',
        attributes: ['id', 'name']
      }]
    });

    res.json(endClients);
  } catch (error) {
    console.error('Erro ao listar clientes finais:', error);
    res.status(500).json({ error: 'Erro ao listar clientes finais' });
  }
};

// Obter um cliente final específico
exports.getEndClient = async (req, res) => {
  try {
    const where = { id: req.params.id };
    
    // Se for client_admin, só pode ver seus próprios clientes finais
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

    const endClient = await EndClient.findOne({
      where,
      include: [{
        model: Client,
        as: 'client',
        attributes: ['id', 'name']
      }]
    });

    if (!endClient) {
      return res.status(404).json({ error: 'Cliente final não encontrado' });
    }

    res.json(endClient);
  } catch (error) {
    console.error('Erro ao buscar cliente final:', error);
    res.status(500).json({ error: 'Erro ao buscar cliente final' });
  }
};

// Criar cliente final
exports.createEndClient = async (req, res) => {
  try {
    const { name, address, city, state, phone, notes } = req.body;

    // Validação dos campos obrigatórios
    const requiredValidation = validateRequiredFields(req.body);
    if (!requiredValidation.isValid) {
      return res.status(400).json({ error: requiredValidation.error });
    }

    // Validação do telefone
    const phoneValidation = validatePhone(phone);
    if (!phoneValidation.isValid) {
      return res.status(400).json({ error: phoneValidation.error });
    }

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

    const endClient = await EndClient.create({
      name,
      address,
      city,
      state,
      phone,
      notes,
      client_id,
      created_by: req.user.id
    });

    res.status(201).json(endClient);
  } catch (error) {
    console.error('Erro ao criar cliente final:', error);
    res.status(500).json({ error: 'Erro ao criar cliente final' });
  }
};

// Atualizar cliente final
exports.updateEndClient = async (req, res) => {
  try {
    const { name, address, city, state, phone, notes } = req.body;
    const where = { id: req.params.id };
    
    // Se for client_admin, só pode atualizar seus próprios clientes finais
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

    const endClient = await EndClient.findOne({ where });

    if (!endClient) {
      return res.status(404).json({ error: 'Cliente final não encontrado' });
    }

    // Validação dos campos obrigatórios
    const requiredValidation = validateRequiredFields(req.body);
    if (!requiredValidation.isValid) {
      return res.status(400).json({ error: requiredValidation.error });
    }

    // Validação do telefone
    const phoneValidation = validatePhone(phone);
    if (!phoneValidation.isValid) {
      return res.status(400).json({ error: phoneValidation.error });
    }

    await endClient.update({
      name,
      address,
      city,
      state,
      phone,
      notes
    });

    res.json(endClient);
  } catch (error) {
    console.error('Erro ao atualizar cliente final:', error);
    res.status(500).json({ error: 'Erro ao atualizar cliente final' });
  }
};

// Deletar cliente final
exports.deleteEndClient = async (req, res) => {
  try {
    const where = { id: req.params.id };
    
    // Se for client_admin, só pode deletar seus próprios clientes finais
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

    const endClient = await EndClient.findOne({ where });

    if (!endClient) {
      return res.status(404).json({ error: 'Cliente final não encontrado' });
    }

    await endClient.destroy();
    res.status(204).send();
  } catch (error) {
    console.error('Erro ao deletar cliente final:', error);
    res.status(500).json({ error: 'Erro ao deletar cliente final' });
  }
}; 