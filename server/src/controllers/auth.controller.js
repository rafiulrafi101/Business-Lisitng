const env = require('../config/env');
const asyncHandler = require('../utils/asyncHandler');
const { sendSuccess } = require('../utils/response');
const authService = require('../services/auth.service');

const cookieOptions = {
  httpOnly: true,
  secure: env.isProduction,
  sameSite: env.isProduction ? 'none' : 'lax',
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

const register = asyncHandler(async (req, res) => {
  const { body } = req.validated;
  const result = await authService.registerUser(body);
  res.cookie(env.cookieName, result.token, cookieOptions);
  return sendSuccess(res, { user: result.user });
});

const login = asyncHandler(async (req, res) => {
  const { body } = req.validated;
  const result = await authService.loginUser(body);
  res.cookie(env.cookieName, result.token, cookieOptions);
  return sendSuccess(res, { user: result.user });
});

const logout = asyncHandler(async (req, res) => {
  res.clearCookie(env.cookieName, {
    httpOnly: true,
    secure: env.isProduction,
    sameSite: env.isProduction ? 'none' : 'lax',
  });
  return sendSuccess(res, { message: 'Logged out' });
});

module.exports = {
  register,
  login,
  logout,
};
