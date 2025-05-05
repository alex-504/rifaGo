const { User } = require('../../models');
const bcrypt = require('bcryptjs');

async function seed() {
  try {
    // Verifica se já existe um admin
    const adminExists = await User.findOne({
      where: { email: process.env.ADMIN_EMAIL || 'admin@example.com' },
    });

    if (!adminExists) {
      // Cria o usuário admin
      await User.create({
        name: 'Admin RifaGo',
        email: process.env.ADMIN_EMAIL || 'admin@example.com',
        password: process.env.ADMIN_PASSWORD || 'changeme123', // Será hasheada pelo hook do modelo
        role: 'app_admin',
        status: 'active',
      });

      console.log('Usuário admin criado com sucesso!');
    } else {
      console.log('Usuário admin já existe.');
    }
  } catch (error) {
    console.error('Erro ao criar usuário admin:', error);
  }
}

module.exports = seed; 