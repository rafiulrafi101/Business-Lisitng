const jwt = require('jsonwebtoken');
const env = require('../config/env');
const ApiError = require('../utils/ApiError');

const authenticate = (req, res, next) => {
  const token = req.cookies?.[env.cookieName];
  if (!token) {
    req.user = null;
    return next();
  }

  try {
    const payload = jwt.verify(token, env.jwtSecret);
    req.user = {
      id: payload.sub,
      role: payload.role,
      email: payload.email,
      name: payload.name,
    };
    return next();
  } catch {
    res.clearCookie(env.cookieName, {
      httpOnly: true,
      secure: env.isProduction,
      sameSite: env.isProduction ? 'none' : 'lax',
    });
    req.user = null;
    return next();
  }
};

const requireAuth = (req, res, next) => {
  if (!req.user) {
    throw new ApiError(401, 'Authentication required');
  }
  return next();
};

const requireRole = (role) => (req, res, next) => {
  if (!req.user) {
    throw new ApiError(401, 'Authentication required');
  }
  if (req.user.role !== role) {
    throw new ApiError(403, 'Insufficient permissions');
  }
  return next();
};

module.exports = {
  authenticate,
  requireAuth,
  requireRole,
};
