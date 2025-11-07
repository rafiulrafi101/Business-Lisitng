const express = require('express');
const { register, login, logout } = require('../controllers/auth.controller');
const validate = require('../middlewares/validate');
const { registerSchema, loginSchema } = require('../validators/auth.validator');
const { authLimiter } = require('../middlewares/rateLimit');
const { requireAuth } = require('../middlewares/auth');

const router = express.Router();

router.post('/register', authLimiter, validate(registerSchema), register);
router.post('/login', authLimiter, validate(loginSchema), login);
router.post('/logout', requireAuth, logout);

module.exports = router;
