const jwt = require('jsonwebtoken');
const env = require('../config/env');
const User = require('../models/User');

const optionalAuth = async (req, res, next) => {
  try {
    const token = req.cookies?.[env.cookieName];
    if (!token) {
      return next();
    }

    const payload = jwt.verify(token, env.jwtSecret);
    const user = await User.findById(payload.sub).select('-passwordHash');
    if (user) {
      req.user = user;
    }
  } catch (_error) {
    // ignore invalid tokens and proceed without user
  }
  return next();
};

module.exports = optionalAuth;
