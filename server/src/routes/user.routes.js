import express from 'express';
import { userController } from '../controllers/user.controller.js';
import { protect } from '../middlewares/auth.js';

const router = express.Router();

router.use(protect); // All user routes require authentication

router.get('/me', userController.getMe);
router.get('/me/bookmarks', userController.getMyBookmarks);
router.post('/me/bookmarks/:listingId', userController.toggleBookmark);

export default router;
