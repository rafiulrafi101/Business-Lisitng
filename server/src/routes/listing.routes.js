const { Router } = require('express');
const listingController = require('../controllers/listing.controller');
const validate = require('../middlewares/validate');
const { requireAuth } = require('../middlewares/auth');
const { listingWriteLimiter } = require('../middlewares/rateLimit');
const {
  listQuerySchema,
  listingIdParamSchema,
  createListingSchema,
  updateListingSchema,
  deleteListingSchema,
} = require('../validation/listing.validation');

const router = Router();

router.get('/', validate(listQuerySchema), listingController.getListings);
router.get('/:id', validate(listingIdParamSchema), listingController.getListingById);
router.post('/', requireAuth, listingWriteLimiter, validate(createListingSchema), listingController.createListing);
router.put(
  '/:id',
  requireAuth,
  listingWriteLimiter,
  validate(updateListingSchema),
  listingController.updateListing,
);
router.delete(
  '/:id',
  requireAuth,
  listingWriteLimiter,
  validate(deleteListingSchema),
  listingController.deleteListing,
);

module.exports = router;
