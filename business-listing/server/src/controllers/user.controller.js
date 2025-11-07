const asyncHandler = require('../utils/asyncHandler');
const sendResponse = require('../utils/sendResponse');
const {
  getCurrentUser,
  getBookmarks,
  addBookmark,
  removeBookmark,
  getUserListings,
} = require('../services/user.service');

const me = asyncHandler(async (req, res) => {
  const user = await getCurrentUser(req.user.id);
  sendResponse(res, 200, { user });
});

const bookmarks = asyncHandler(async (req, res) => {
  const results = await getBookmarks(req.user.id);
  sendResponse(res, 200, { bookmarks: results });
});

const createBookmark = asyncHandler(async (req, res) => {
  const bookmark = await addBookmark(req.user.id, req.params.listingId);
  sendResponse(res, 201, { bookmark });
});

const deleteBookmark = asyncHandler(async (req, res) => {
  await removeBookmark(req.user.id, req.params.listingId);
  sendResponse(res, 200, { message: 'Bookmark removed' });
});

const myListings = asyncHandler(async (req, res) => {
  const listings = await getUserListings(req.user.id);
  sendResponse(res, 200, { listings });
});

module.exports = {
  me,
  bookmarks,
  createBookmark,
  deleteBookmark,
  myListings,
};
