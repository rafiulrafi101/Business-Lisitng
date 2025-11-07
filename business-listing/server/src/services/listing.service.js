const mongoose = require('mongoose');
const Listing = require('../models/Listing');
const Bookmark = require('../models/Bookmark');
const ApiError = require('../utils/ApiError');

const buildFilters = ({ search, category, city, area }) => {
  const filters = {};

  if (search) {
    const regex = new RegExp(search, 'i');
    filters.$or = [
      { name: regex },
      { shortDescription: regex },
      { description: regex },
      { 'location.city': regex },
      { 'location.area': regex },
    ];
  }

  if (category) {
    filters.category = category;
  }

  if (city) {
    filters['location.city'] = city;
  }

  if (area) {
    filters['location.area'] = area;
  }

  filters.isActive = true;

  return filters;
};

const resolveSort = (sort) => {
  if (sort === 'az') {
    return { name: 1 };
  }
  return { createdAt: -1 };
};

const getListings = async ({
  search,
  category,
  city,
  area,
  sort = 'newest',
  page = 1,
  limit = 10,
  userId = null,
}) => {
  const filters = buildFilters({ search, category, city, area });
  const skip = (page - 1) * limit;
  const sortOption = resolveSort(sort);

  const [items, total] = await Promise.all([
    Listing.find(filters)
      .sort(sortOption)
      .skip(skip)
      .limit(limit)
      .lean(),
    Listing.countDocuments(filters),
  ]);

  let bookmarkedIds = [];
  if (userId) {
    const bookmarks = await Bookmark.find({ user: userId, listing: { $in: items.map((i) => i._id) } });
    bookmarkedIds = bookmarks.map((bookmark) => bookmark.listing.toString());
  }

  const listings = items.map((item) => ({
    ...item,
    id: item._id.toString(),
    isBookmarked: bookmarkedIds.includes(item._id.toString()),
  }));

  return {
    listings,
    pagination: {
      total,
      page,
      limit,
      pages: Math.ceil(total / limit) || 1,
    },
  };
};

const getListingById = async (id, userId = null) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw ApiError.badRequest('Invalid listing ID');
  }

  const listing = await Listing.findById(id).populate('owner', 'name email role').lean();

  if (!listing) {
    throw ApiError.notFound('Listing not found');
  }

  let isBookmarked = false;
  if (userId) {
    const bookmark = await Bookmark.findOne({ user: userId, listing: id });
    isBookmarked = Boolean(bookmark);
  }

  return {
    ...listing,
    id: listing._id.toString(),
    owner: listing.owner
      ? {
          id: listing.owner._id?.toString(),
          name: listing.owner.name,
          email: listing.owner.email,
          role: listing.owner.role,
        }
      : null,
    isBookmarked,
  };
};

const assertOwnership = (listing, requester) => {
  if (!requester) {
    throw ApiError.unauthorized('Authentication required');
  }

  const isOwner = listing.owner.toString() === requester.id;
  const isAdmin = requester.role === 'admin';

  if (!isOwner && !isAdmin) {
    throw ApiError.forbidden('You do not have permission to modify this listing');
  }

  return { isOwner, isAdmin };
};

const createListing = async (ownerId, payload) => {
  const listing = await Listing.create({
    ...payload,
    owner: ownerId,
  });

  return listing.toJSON();
};

const updateListing = async (id, requester, payload) => {
  const listing = await Listing.findById(id);
  if (!listing) {
    throw ApiError.notFound('Listing not found');
  }

  assertOwnership(listing, requester);

  Object.assign(listing, payload);

  await listing.save();
  return listing.toJSON();
};

const deleteListing = async (id, requester) => {
  const listing = await Listing.findById(id);
  if (!listing) {
    throw ApiError.notFound('Listing not found');
  }

  assertOwnership(listing, requester);
  await Bookmark.deleteMany({ listing: listing.id });
  await listing.deleteOne();
  return true;
};

const getListingsByOwner = async (ownerId) => {
  const listings = await Listing.find({ owner: ownerId })
    .sort({ createdAt: -1 })
    .lean();
  return listings.map((item) => ({
    ...item,
    id: item._id.toString(),
  }));
};

module.exports = {
  getListings,
  getListingById,
  createListing,
  updateListing,
  deleteListing,
  getListingsByOwner,
};
