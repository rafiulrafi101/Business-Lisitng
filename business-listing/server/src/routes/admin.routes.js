const express = require('express');
const { stats } = require('../controllers/admin.controller');
const { requireAuth, requireAdmin } = require('../middlewares/auth');

const router = express.Router();

router.get('/stats', requireAuth, requireAdmin, stats);

module.exports = router;
