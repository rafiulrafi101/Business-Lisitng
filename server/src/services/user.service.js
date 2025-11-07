const mongoose = require('mongoose');
const Bookmark = require('../models/Bookmark');
const Listing = require('../models/Listing');
const User = require('../models/User');
const ApiError = require('../utils/ApiError');
const { toUserDto } = require('./auth.service');

const getMe = async (userId) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(404, 'User not found');
  }
  return toUserDto(user);
};

const getUserBookmarks = async (userId) => {
  const bookmarks = await Bookmark.find({ user: userId })
    .populate({
      path: 'listing',
      select: 'name category location shortDescription imageUrl phone hours description isActive createdAt',
    })
    .lean();

  return bookmarks
    .filter((bookmark) => bookmark.listing)
    .map((bookmark) => ({
      id: bookmark._id.toString(),
      createdAt: bookmark.createdAt,
      listing: {
        id: bookmark.listing._id.toString(),
        name: bookmark.listing.name,
        category: bookmark.listing.category,
        location: bookmark.listing.location,
        shortDescription: bookmark.listing.shortDescription,
        imageUrl: bookmark.listing.imageUrl,
        phone: bookmark.listing.phone,
        hours: bookmark.listing.hours,
        description: bookmark.listing.description,
        isActive: bookmark.listing.isActive,
        createdAt: bookmark.listing.createdAt,
      },
    }));
};

const toggleBookmark = async (userId, listingId) => {
  if (!mongoose.Types.ObjectId.isValid(listingId)) {
    throw new ApiError(400, 'Invalid listing id');
  }

  const listing = await Listing.findById(listingId);
  if (!listing || !listing.isActive) {
    throw new ApiError(404, 'Listing not found');
  }

  const existing = await Bookmark.findOne({ user: userId, listing: listingId });
  if (existing) {
    await existing.deleteOne();
    return { bookmarked: false };
  }

  await Bookmark.create({ user: userId, listing: listingId });
  return { bookmarked: true };
};

const getMyListings = async (userId) => {
  const listings = await Listing.find({ owner: userId }).sort({ createdAt: -1 }).lean();
  return listings.map((listing) => ({
    id: listing._id.toString(),
    name: listing.name,
    category: listing.category,
    location: listing.location,
    shortDescription: listing.shortDescription,
    createdAt: listing.createdAt,
    isActive: listing.isActive,
  }));
};

module.exports = {
  getMe,
  getUserBookmarks,
  toggleBookmark,
  getMyListings,
};
