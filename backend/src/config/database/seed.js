const { User } = require('../../models');
const bcrypt = require('bcryptjs');

async function seed() {
  try {
    // Verifica se já existe um admin
    const adminExists = await User.findOne({
      where: { email: 'admin@rifago.com' },
    });

    if (!adminExists) {
      // Cria o usuário admin
      await User.create({
        name: 'Admin RifaGo',
        email: 'admin@rifago.com',
        password: 'admin123', // Será hasheada pelo hook do modelo
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