'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // 1. Primeiro adicionar a coluna como nullable
    await queryInterface.addColumn('drivers', 'user_id', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id'
      },
      after: 'client_id'
    });

    // 2. Para cada motorista existente, criar um usuário correspondente
    const drivers = await queryInterface.sequelize.query(
      'SELECT id, name, client_id FROM drivers WHERE user_id IS NULL;',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );

    for (const driver of drivers) {
      // Criar usuário
      const [user] = await queryInterface.sequelize.query(
        `INSERT INTO users (name, email, password, role, status, client_id, "createdAt", "updatedAt")
         VALUES ($1, $2, $3, 'driver', 'active', $4, NOW(), NOW())
         RETURNING id;`,
        {
          bind: [
            driver.name,
            `driver${driver.id}@rifago.com`,
            '$2b$10$defaultHashedPassword', // Senha padrão hasheada
            driver.client_id
          ],
          type: queryInterface.sequelize.QueryTypes.INSERT
        }
      );

      // Atualizar motorista com o user_id
      await queryInterface.sequelize.query(
        'UPDATE drivers SET user_id = $1 WHERE id = $2;',
        {
          bind: [user[0].id, driver.id],
          type: queryInterface.sequelize.QueryTypes.UPDATE
        }
      );
    }

    // 3. Agora tornar a coluna não nullable
    await queryInterface.changeColumn('drivers', 'user_id', {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    // 1. Primeiro remover a restrição de não nulo
    await queryInterface.changeColumn('drivers', 'user_id', {
      type: Sequelize.INTEGER,
      allowNull: true
    });

    // 2. Obter todos os user_ids dos motoristas
    const drivers = await queryInterface.sequelize.query(
      'SELECT user_id FROM drivers WHERE user_id IS NOT NULL;',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );

    // 3. Deletar os usuários correspondentes
    if (drivers.length > 0) {
      const userIds = drivers.map(d => d.user_id);
      await queryInterface.sequelize.query(
        'DELETE FROM users WHERE id IN (:userIds);',
        {
          replacements: { userIds },
          type: queryInterface.sequelize.QueryTypes.DELETE
        }
      );
    }

    // 4. Finalmente remover a coluna
    await queryInterface.removeColumn('drivers', 'user_id');
  }
}; 