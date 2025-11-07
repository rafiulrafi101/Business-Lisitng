const express = require('express');
const {
  list,
  getById,
  create,
  update,
  remove,
} = require('../controllers/listing.controller');
const validate = require('../middlewares/validate');
const {
  createListingSchema,
  updateListingSchema,
  listingIdParamSchema,
  listingQuerySchema,
} = require('../validators/listing.validator');
const { requireAuth } = require('../middlewares/auth');
const optionalAuth = require('../middlewares/optionalAuth');
const { listingWriteLimiter } = require('../middlewares/rateLimit');

const router = express.Router();

router.get('/', optionalAuth, validate(listingQuerySchema), list);
router.get('/:id', optionalAuth, validate(listingIdParamSchema), getById);
router.post('/', requireAuth, listingWriteLimiter, validate(createListingSchema), create);
router.put(
  '/:id',
  requireAuth,
  listingWriteLimiter,
  validate(updateListingSchema),
  update,
);
router.delete(
  '/:id',
  requireAuth,
  listingWriteLimiter,
  validate(listingIdParamSchema),
  remove,
);

module.exports = router;
