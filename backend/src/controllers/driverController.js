const Driver = require('../models/Driver');
const Client = require('../models/Client');
const { Op } = require('sequelize');

// Funções de validação
const validateRequiredFields = (data) => {
  const requiredFields = ['name', 'cnh', 'cnh_expiration', 'phone'];
  const missingFields = requiredFields.filter(field => !data[field]);
  
  if (missingFields.length > 0) {
    return {
      isValid: false,
      error: `Campos obrigatórios não preenchidos: ${missingFields.join(', ')}`
    };
  }
  return { isValid: true };
};

const validateCNH = (cnh) => {
  // Remove caracteres não numéricos
  const cleanCNH = cnh.replace(/\D/g, '');
  
  // Verifica se tem 11 dígitos
  if (cleanCNH.length !== 11) {
    return {
      isValid: false,
      error: 'CNH deve conter 11 dígitos'
    };
  }
  return { isValid: true };
};

const validateCNHExpiration = (expirationDate) => {
  const today = new Date();
  const expiration = new Date(expirationDate);
  
  if (expiration < today) {
    return {
      isValid: false,
      error: 'Data de expiração da CNH não pode ser no passado'
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

    // Validação dos campos obrigatórios
    const requiredValidation = validateRequiredFields(req.body);
    if (!requiredValidation.isValid) {
      return res.status(400).json({ error: requiredValidation.error });
    }

    // Validação da CNH
    const cnhValidation = validateCNH(cnh);
    if (!cnhValidation.isValid) {
      return res.status(400).json({ error: cnhValidation.error });
    }

    // Validação da data de expiração da CNH
    const expirationValidation = validateCNHExpiration(cnh_expiration);
    if (!expirationValidation.isValid) {
      return res.status(400).json({ error: expirationValidation.error });
    }

    // Validação do telefone
    const phoneValidation = validatePhone(phone);
    if (!phoneValidation.isValid) {
      return res.status(400).json({ error: phoneValidation.error });
    }

    // Verifica se já existe um motorista com a mesma CNH
    const existingDriver = await Driver.findOne({ where: { cnh } });
    if (existingDriver) {
      return res.status(400).json({ error: 'Já existe um motorista cadastrado com esta CNH' });
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

    // Garante que o created_by seja sempre o usuário autenticado
    const driver = await Driver.create({
      name,
      cnh,
      cnh_expiration,
      phone,
      client_id,
      created_by: req.user.id
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

    // Validação dos campos obrigatórios
    const requiredValidation = validateRequiredFields(req.body);
    if (!requiredValidation.isValid) {
      return res.status(400).json({ error: requiredValidation.error });
    }

    // Validação da CNH
    const cnhValidation = validateCNH(cnh);
    if (!cnhValidation.isValid) {
      return res.status(400).json({ error: cnhValidation.error });
    }

    // Validação da data de expiração da CNH
    const expirationValidation = validateCNHExpiration(cnh_expiration);
    if (!expirationValidation.isValid) {
      return res.status(400).json({ error: expirationValidation.error });
    }

    // Validação do telefone
    const phoneValidation = validatePhone(phone);
    if (!phoneValidation.isValid) {
      return res.status(400).json({ error: phoneValidation.error });
    }

    // Verifica se já existe outro motorista com a mesma CNH
    const existingDriver = await Driver.findOne({
      where: {
        cnh,
        id: { [Op.ne]: req.params.id } // Exclui o próprio motorista da busca
      }
    });
    if (existingDriver) {
      return res.status(400).json({ error: 'Já existe outro motorista cadastrado com esta CNH' });
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