const { Router } = require('express');
const metaController = require('../controllers/meta.controller');

const router = Router();

router.get('/categories', metaController.getCategories);
router.get('/locations', metaController.getLocations);

module.exports = router;
