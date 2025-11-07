import express from 'express';
import { adminController } from '../controllers/admin.controller.js';
import { protect, authorize } from '../middlewares/auth.js';

const router = express.Router();

router.use(protect); // All admin routes require authentication
router.use(authorize('admin')); // All admin routes require admin role

router.get('/stats', adminController.getStats);

export default router;
