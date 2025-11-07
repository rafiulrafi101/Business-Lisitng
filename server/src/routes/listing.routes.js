import express from 'express';
import { body } from 'express-validator';
import { listingController } from '../controllers/listing.controller.js';
import { protect } from '../middlewares/auth.js';
import { validate } from '../middlewares/validate.js';
import { listingWriteLimiter } from '../middlewares/rateLimit.js';

const router = express.Router();

router.get('/', listingController.getListings);
router.get('/my-listings', protect, listingController.getMyListings);
router.get('/:id', listingController.getListingById);

router.post(
  '/',
  protect,
  listingWriteLimiter,
  [
    body('name').trim().notEmpty().withMessage('Business name is required'),
    body('category')
      .isIn(['Haircut', 'Laundry', 'Electronics', 'Fashion', 'Market'])
      .withMessage('Invalid category'),
    body('location.city').trim().notEmpty().withMessage('City is required'),
    body('location.area').trim().notEmpty().withMessage('Area is required'),
    body('shortDescription')
      .trim()
      .notEmpty()
      .withMessage('Short description is required')
      .isLength({ max: 200 })
      .withMessage('Short description cannot exceed 200 characters'),
    body('description').trim().notEmpty().withMessage('Description is required'),
    body('phone').optional().trim(),
    body('hours').optional().trim(),
    body('imageUrl').optional().trim(),
  ],
  validate,
  listingController.createListing
);

router.put(
  '/:id',
  protect,
  listingWriteLimiter,
  [
    body('name').optional().trim().notEmpty().withMessage('Business name cannot be empty'),
    body('category')
      .optional()
      .isIn(['Haircut', 'Laundry', 'Electronics', 'Fashion', 'Market'])
      .withMessage('Invalid category'),
    body('location.city').optional().trim().notEmpty().withMessage('City cannot be empty'),
    body('location.area').optional().trim().notEmpty().withMessage('Area cannot be empty'),
    body('shortDescription')
      .optional()
      .trim()
      .notEmpty()
      .withMessage('Short description cannot be empty')
      .isLength({ max: 200 })
      .withMessage('Short description cannot exceed 200 characters'),
    body('description')
      .optional()
      .trim()
      .notEmpty()
      .withMessage('Description cannot be empty'),
    body('phone').optional().trim(),
    body('hours').optional().trim(),
    body('imageUrl').optional().trim(),
    body('isActive').optional().isBoolean().withMessage('isActive must be boolean'),
  ],
  validate,
  listingController.updateListing
);

router.delete('/:id', protect, listingWriteLimiter, listingController.deleteListing);

export default router;
