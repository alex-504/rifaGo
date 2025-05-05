require('dotenv').config();
const { User, Driver } = require('../src/models');

async function createDriver() {
  try {
    // 1. Criar usuário do motorista
    const user = await User.create({
      name: 'João da Silva',
      email: 'joao.silva@driver.com',
      password: 'Driver@2024',
      role: 'driver',
      status: 'active',
      client_id: 1
    });

    console.log('Usuário do motorista criado:', user.toJSON());

    // 2. Criar registro do motorista
    const driver = await Driver.create({
      name: 'João da Silva',
      cnh: '12345678900',
      cnh_expiration: '2025-12-31',
      phone: '(37) 99999-9999',
      status: 'active',
      client_id: 1,
      created_by: 1 // ID do seu usuário admin
    });

    console.log('Registro do motorista criado:', driver.toJSON());

    console.log('Driver configurado com sucesso!');
  } catch (error) {
    console.error('Erro ao criar driver:', error);
  } finally {
    process.exit();
  }
}

createDriver(); 