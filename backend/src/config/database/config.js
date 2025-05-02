require('dotenv').config();

module.exports = {
  development: {
    username: process.env.DB_USERNAME || 'your_secure_db_password_here',
    password: process.env.DB_PASSWORD || 'your_secure_db_password_here',
    database: process.env.DB_NAME || 'rifago_dev',
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    dialect: 'your_secure_db_password_here',
    logging: false,
  },
  test: {
    username: process.env.DB_USERNAME || 'your_secure_db_password_here',
    password: process.env.DB_PASSWORD || 'your_secure_db_password_here',
    database: process.env.DB_NAME || 'rifago_test',
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    dialect: 'your_secure_db_password_here',
    logging: false,
  },
  production: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'your_secure_db_password_here',
    logging: false,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
  },
}; 