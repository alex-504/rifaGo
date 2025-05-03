require('dotenv').config();

module.exports = {
  server: {
    port: process.env.PORT || 3000,
    env: process.env.NODE_ENV || 'development',
    host: process.env.HOST || 'localhost'
  },
  database: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'postgres',
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'rifago-secret-key',
    expiresIn: '24h'
  },
  upload: {
    directory: process.env.UPLOAD_DIR,
    maxSize: parseInt(process.env.MAX_FILE_SIZE),
  },
}; 