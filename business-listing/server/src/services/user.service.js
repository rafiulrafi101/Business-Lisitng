const User = require('../models/User');
const Bookmark = require('../models/Bookmark');
const Listing = require('../models/Listing');
const ApiError = require('../utils/ApiError');
const { getListingsByOwner } = require('./listing.service');

const getCurrentUser = async (userId) => {
  const user = await User.findById(userId);
  if (!user) {
    throw ApiError.notFound('User not found');
  }
  return user.toJSON();
};

const getBookmarks = async (userId) => {
  const bookmarks = await Bookmark.find({ user: userId })
    .sort({ createdAt: -1 })
    .populate({
      path: 'listing',
      match: { isActive: true },
    })
    .lean();

  return bookmarks
    .filter((bookmark) => bookmark.listing)
    .map((bookmark) => {
      const { _id, ...rest } = bookmark.listing;
      return {
        id: bookmark._id.toString(),
        createdAt: bookmark.createdAt,
        listing: {
          ...rest,
          id: _id.toString(),
        },
      };
    });
};

const addBookmark = async (userId, listingId) => {
  const listing = await Listing.findOne({ _id: listingId, isActive: true });
  if (!listing) {
    throw ApiError.notFound('Listing not found');
  }

  try {
    const bookmark = await Bookmark.create({
      user: userId,
      listing: listingId,
    });
    return bookmark.toJSON();
  } catch (error) {
    if (error.code === 11000) {
      throw ApiError.badRequest('Listing already bookmarked');
    }
    throw error;
  }
};

const removeBookmark = async (userId, listingId) => {
  await Bookmark.deleteOne({ user: userId, listing: listingId });
  return true;
};

const getUserListings = async (userId) => {
  const listings = await getListingsByOwner(userId);
  return listings;
};

module.exports = {
  getCurrentUser,
  getBookmarks,
  addBookmark,
  removeBookmark,
  getUserListings,
};
