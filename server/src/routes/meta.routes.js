import express from 'express';
import { metaController } from '../controllers/meta.controller.js';

const router = express.Router();

router.get('/categories', metaController.getCategories);
router.get('/locations', metaController.getLocations);

export default router;
