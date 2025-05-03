const { sequelize } = require('../../models');
const seed = require('./seed');

async function syncDatabase() {
  try {
    // Cria os tipos ENUM primeiro
    await sequelize.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'enum_users_role') THEN
          CREATE TYPE "enum_users_role" AS ENUM('app_admin', 'client_admin', 'driver');
        END IF;
        
        IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'enum_users_status') THEN
          CREATE TYPE "enum_users_status" AS ENUM('active', 'inactive');
        END IF;
      END
      $$;
    `);

    // Sincroniza as tabelas
    await sequelize.sync({ force: true });
    console.log('Banco de dados sincronizado com sucesso.');

    // Executa o seed após a sincronização
    await seed();
    console.log('Seed executado com sucesso.');
  } catch (error) {
    console.error('Erro ao sincronizar o banco de dados:', error);
  } finally {
    // Fecha a conexão com o banco de dados
    await sequelize.close();
  }
}

module.exports = syncDatabase; 