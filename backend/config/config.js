// config/config.js

require('dotenv').config(); // 确保 dotenv 被加载以使用环境变量

module.exports = {
  development: {
    username: process.env.DB_USER || 'oa_user',
    password: process.env.DB_PASSWORD || 'dk29ay5s6z@DK',
    database: process.env.DB_NAME || 'oa_system_db',
    host: process.env.DB_HOST || '127.0.0.1',
    dialect: 'mysql',
    logging: false, // 禁用 Sequelize 日志
  },
  test: {
    username: process.env.DB_USER || 'oa_user',
    password: process.env.DB_PASSWORD || 'dk29ay5s6z@DK',
    database: process.env.DB_NAME_TEST || 'oa_system_db_test',
    host: process.env.DB_HOST || '127.0.0.1',
    dialect: 'mysql',
    logging: false, // 禁用 Sequelize 日志
  },
  production: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    dialect: 'mysql',
    logging: false, // 禁用 Sequelize 日志
  },
};
