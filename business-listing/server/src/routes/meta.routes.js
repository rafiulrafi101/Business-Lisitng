const express = require('express');
const { categories, locations } = require('../controllers/meta.controller');

const router = express.Router();

router.get('/categories', categories);
router.get('/locations', locations);

module.exports = router;
