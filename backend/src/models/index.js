const User = require('./User');
const Client = require('./Client');
const Driver = require('./Driver');
const EndClient = require('./EndClient');
const sequelize = require('../config/database/connection');

// Relacionamentos
Client.belongsTo(User, { foreignKey: 'created_by', as: 'creator' });
User.hasMany(Client, { foreignKey: 'created_by', as: 'clients' });

Client.hasMany(Driver, { foreignKey: 'client_id' });
Driver.belongsTo(Client, { foreignKey: 'client_id' });

User.hasMany(Driver, { foreignKey: 'created_by' });
Driver.belongsTo(User, { foreignKey: 'created_by' });

Client.hasMany(EndClient, { foreignKey: 'client_id' });
EndClient.belongsTo(Client, { foreignKey: 'client_id' });

User.hasMany(EndClient, { foreignKey: 'created_by' });
EndClient.belongsTo(User, { foreignKey: 'created_by' });

module.exports = {
  sequelize,
  User,
  Client,
  Driver,
  EndClient,
}; 