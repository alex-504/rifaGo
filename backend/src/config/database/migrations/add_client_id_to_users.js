'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('users', 'client_id', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: 'clients',
        key: 'id'
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('users', 'client_id');
  }
}; 