const express = require('express');
const {
  me,
  bookmarks,
  createBookmark,
  deleteBookmark,
  myListings,
} = require('../controllers/user.controller');
const { requireAuth } = require('../middlewares/auth');
const validate = require('../middlewares/validate');
const { bookmarkParamSchema } = require('../validators/user.validator');

const router = express.Router();

router.use(requireAuth);

router.get('/me', me);
router.get('/me/bookmarks', bookmarks);
router.post('/me/bookmarks/:listingId', validate(bookmarkParamSchema), createBookmark);
router.delete('/me/bookmarks/:listingId', validate(bookmarkParamSchema), deleteBookmark);
router.get('/me/listings', myListings);

module.exports = router;
