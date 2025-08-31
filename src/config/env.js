require('dotenv').config();

const PORT = process.env.PORT ? Number(process.env.PORT) : 3001;
const DATABASE_URL = process.env.DATABASE_URL || 'postgresql://postgres:password@localhost:5432/vulnerability_platform?schema=public';
const JWT_SECRET = process.env.JWT_SECRET || 'dev_jwt_secret_change_me';

module.exports = {
  PORT,
  DATABASE_URL,
  JWT_SECRET,
};


