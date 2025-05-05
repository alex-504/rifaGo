const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database/connection');
const User = require('./User');
const Client = require('./Client');

class EndClient extends Model {}

EndClient.init(
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
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM('active', 'inactive'),
      defaultValue: 'active',
    },
    client_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Client,
        key: 'id',
      },
    },
    created_by: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: 'id',
      },
    },
  },
  {
    sequelize,
    modelName: 'EndClient',
    tableName: 'end_clients',
    timestamps: true,
  }
);

// Relacionamentos
EndClient.belongsTo(Client, { foreignKey: 'client_id', as: 'client' });
EndClient.belongsTo(User, { foreignKey: 'created_by', as: 'creator' });

module.exports = EndClient; 