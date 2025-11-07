const { Router } = require('express');
const adminController = require('../controllers/admin.controller');
const { requireAuth, requireRole } = require('../middlewares/auth');

const router = Router();

router.get('/stats', requireAuth, requireRole('admin'), adminController.getStats);

module.exports = router;
