import { config } from 'dotenv';
const envFile = `.env. ${process.env.NODE_ENV || 'development'} `;
config ({ path: envFile }); 
export const {
  PORT,
  NODE_ENV,
  JWT_SECRET
} = process.env;
export const {
  DB_PORT,
  DB_USER,
  DB_PASS,
  DB_NAME,
  DB_HOST,
  DB_DIALECT
} = process.env;