const User = require('./User');
const Client = require('./Client');
const Driver = require('./Driver');
const EndClient = require('./EndClient');

// Client Relationships
Client.hasMany(User, { foreignKey: 'client_id', as: 'users' });
Client.hasMany(Driver, { foreignKey: 'client_id', as: 'drivers' });

// User Relationships
User.belongsTo(Client, { foreignKey: 'client_id', as: 'client' });
User.hasOne(Driver, { foreignKey: 'user_id', as: 'driver' });

// Driver Relationships
Driver.belongsTo(Client, { foreignKey: 'client_id', as: 'client' });
Driver.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
Driver.belongsTo(User, { foreignKey: 'created_by', as: 'creator' });
Driver.hasMany(EndClient, { foreignKey: 'driver_id', as: 'endClients' });

// EndClient Relationships
EndClient.belongsTo(Driver, { foreignKey: 'driver_id', as: 'driver' });

module.exports = {
  User,
  Client,
  Driver,
  EndClient
}; 