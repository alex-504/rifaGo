const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database/connection');

class Client extends Model {}

Client.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    city: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    state: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('active', 'inactive'),
      defaultValue: 'active',
    },
    created_by: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
    },
  },
  {
    sequelize,
    modelName: 'Client',
    tableName: 'clients',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    hooks: {
      beforeUpdate: async (instance, options) => {
        // Se o created_by está sendo alterado, verifica se é uma transferência de propriedade
        if (instance.changed('created_by')) {
          const originalInstance = await Client.findByPk(instance.id);
          if (originalInstance.created_by !== instance.created_by && !options.transferOwnership) {
            throw new Error('Não é permitido alterar o created_by diretamente');
          }
        }
      }
    }
  }
);

module.exports = Client; 