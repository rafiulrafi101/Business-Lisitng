const { Router } = require('express');
const authController = require('../controllers/auth.controller');
const validate = require('../middlewares/validate');
const { authLimiter } = require('../middlewares/rateLimit');
const { registerSchema, loginSchema } = require('../validation/auth.validation');

const router = Router();

router.post('/register', authLimiter, validate(registerSchema), authController.register);
router.post('/login', authLimiter, validate(loginSchema), authController.login);
router.post('/logout', authController.logout);

module.exports = router;
