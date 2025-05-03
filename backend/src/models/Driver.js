const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database/connection');
const User = require('./User');
const Client = require('./Client');

class Driver extends Model {}

Driver.init(
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
    cnh: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    cnh_expiration: {
      type: DataTypes.DATE,
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
    modelName: 'Driver',
    tableName: 'drivers',
    timestamps: true,
  }
);

// Relacionamentos
Driver.belongsTo(Client, { foreignKey: 'client_id', as: 'client' });
Driver.belongsTo(User, { foreignKey: 'created_by', as: 'creator' });

module.exports = Driver; 