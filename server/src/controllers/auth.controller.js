import { authService } from '../services/auth.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { config } from '../config/env.js';

export const authController = {
  register: asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;
    const { user, token } = await authService.register(name, email, password);

    // Set httpOnly cookie
    res.cookie(config.cookieName, token, {
      httpOnly: true,
      secure: config.env === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.status(201).json({
      success: true,
      data: { user, token },
    });
  }),

  login: asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const { user, token } = await authService.login(email, password);

    // Set httpOnly cookie
    res.cookie(config.cookieName, token, {
      httpOnly: true,
      secure: config.env === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.status(200).json({
      success: true,
      data: { user, token },
    });
  }),

  logout: asyncHandler(async (req, res) => {
    res.cookie(config.cookieName, '', {
      httpOnly: true,
      expires: new Date(0),
    });

    res.status(200).json({
      success: true,
      data: { message: 'Logged out successfully' },
    });
  }),
};
