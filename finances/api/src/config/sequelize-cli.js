const { config } = require('dotenv');

config({ path: `.env. ${process.env.NODE_ENV || 'development'} ` });

export const {
  DB_PORT,
  DB_USER,
  DB_PASS,
  DB_NAME,
  DB_HOST,
  DB_DIALECT,
} = process.env;

module.exports = {
  username: DB_USER,
  password: DB_PASS,
  database: DB_NAME,
  host: DB_HOST,
  port: DB_PORT,
  dialect: DB_DIALECT,
  migrationStorageTableName: 'sequelize_migrations',
  seederStorageTableName: 'sequelize_seeds',
};
