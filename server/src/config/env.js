import dotenv from 'dotenv';

dotenv.config();

export const config = {
  env: process.env.NODE_ENV || 'development',
  port: process.env.PORT || 5000,
  mongoUri: process.env.MONGO_URI || 'mongodb://localhost:27017/business-listing',
  jwt: {
    secret: process.env.JWT_SECRET || 'default-secret-change-this',
    expire: process.env.JWT_EXPIRE || '7d',
  },
  cookieName: process.env.COOKIE_NAME || 'auth_token',
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:5173',
};
