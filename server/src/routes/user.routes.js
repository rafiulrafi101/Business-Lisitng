const { Router } = require('express');
const userController = require('../controllers/user.controller');
const validate = require('../middlewares/validate');
const { requireAuth } = require('../middlewares/auth');
const { bookmarkParamSchema } = require('../validation/user.validation');

const router = Router();

router.use(requireAuth);

router.get('/me', userController.getMe);
router.get('/me/listings', userController.getMyListings);
router.get('/me/bookmarks', userController.getMyBookmarks);
router.post('/me/bookmarks/:listingId', validate(bookmarkParamSchema), userController.toggleBookmark);

module.exports = router;
