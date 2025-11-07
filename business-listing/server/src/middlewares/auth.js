const jwt = require('jsonwebtoken');
const env = require('../config/env');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');
const User = require('../models/User');

const getTokenFromRequest = (req) => {
  const { cookies = {} } = req;
  return cookies[env.cookieName];
};

const requireAuth = asyncHandler(async (req, res, next) => {
  const token = getTokenFromRequest(req);
  if (!token) {
    throw ApiError.unauthorized('Authentication required');
  }

  let payload;
  try {
    payload = jwt.verify(token, env.jwtSecret);
  } catch (_error) {
    throw ApiError.unauthorized('Invalid or expired token');
  }

  const user = await User.findById(payload.sub).select('-passwordHash');
  if (!user) {
    throw ApiError.unauthorized('User not found');
  }

  req.user = user;
  next();
});

const requireAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    throw ApiError.forbidden('Admin access required');
  }
  next();
};

module.exports = {
  requireAuth,
  requireAdmin,
};
