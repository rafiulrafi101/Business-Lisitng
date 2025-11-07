const dotenv = require('dotenv');

dotenv.config();

const requiredKeys = ['MONGO_URI', 'JWT_SECRET', 'CORS_ORIGIN', 'COOKIE_NAME'];

requiredKeys.forEach((key) => {
  if (!process.env[key]) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
});

module.exports = {
  port: process.env.PORT || 4000,
  mongoUri: process.env.MONGO_URI,
  jwtSecret: process.env.JWT_SECRET,
  corsOrigin: process.env.CORS_ORIGIN,
  cookieName: process.env.COOKIE_NAME,
  nodeEnv: process.env.NODE_ENV || 'development',
  isProduction: process.env.NODE_ENV === 'production',
};
