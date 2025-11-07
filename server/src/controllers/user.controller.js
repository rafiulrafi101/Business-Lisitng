const asyncHandler = require('../utils/asyncHandler');
const { sendSuccess } = require('../utils/response');
const userService = require('../services/user.service');

const getMe = asyncHandler(async (req, res) => {
  const user = await userService.getMe(req.user.id);
  return sendSuccess(res, user);
});

const getMyBookmarks = asyncHandler(async (req, res) => {
  const bookmarks = await userService.getUserBookmarks(req.user.id);
  return sendSuccess(res, bookmarks);
});

const toggleBookmark = asyncHandler(async (req, res) => {
  const { listingId } = req.validated.params;
  const result = await userService.toggleBookmark(req.user.id, listingId);
  return sendSuccess(res, result, result.bookmarked ? 201 : 200);
});

const getMyListings = asyncHandler(async (req, res) => {
  const listings = await userService.getMyListings(req.user.id);
  return sendSuccess(res, listings);
});

module.exports = {
  getMe,
  getMyBookmarks,
  toggleBookmark,
  getMyListings,
};
