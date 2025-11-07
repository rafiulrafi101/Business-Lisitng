const env = require('../config/env');
const asyncHandler = require('../utils/asyncHandler');
const sendResponse = require('../utils/sendResponse');
const { registerUser, loginUser } = require('../services/auth.service');

const cookieOptions = {
  httpOnly: true,
  sameSite: env.nodeEnv === 'production' ? 'none' : 'lax',
  secure: env.nodeEnv === 'production',
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

const register = asyncHandler(async (req, res) => {
  const { user, token } = await registerUser(req.body);
  res.cookie(env.cookieName, token, cookieOptions);
  sendResponse(res, 201, { user });
});

const login = asyncHandler(async (req, res) => {
  const { user, token } = await loginUser(req.body);
  res.cookie(env.cookieName, token, cookieOptions);
  sendResponse(res, 200, { user });
});

const logout = asyncHandler(async (req, res) => {
  res.clearCookie(env.cookieName, cookieOptions);
  sendResponse(res, 200, { message: 'Logged out' });
});

module.exports = {
  register,
  login,
  logout,
};
