const mongoose = require('mongoose');
const Listing = require('../models/Listing');
const ApiError = require('../utils/ApiError');

const toListingDto = (listingDoc) => {
  const obj = listingDoc.toObject({ virtuals: true });
  return {
    id: obj._id.toString(),
    owner: obj.owner?.toString ? obj.owner.toString() : obj.owner,
    name: obj.name,
    category: obj.category,
    location: obj.location,
    shortDescription: obj.shortDescription,
    description: obj.description,
    phone: obj.phone,
    hours: obj.hours,
    imageUrl: obj.imageUrl,
    isActive: obj.isActive,
    createdAt: obj.createdAt,
    updatedAt: obj.updatedAt,
  };
};

const buildFilters = ({ search, category, city, area, includeInactive = false }) => {
  const filters = {};

  if (!includeInactive) {
    filters.isActive = true;
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

  if (search) {
    filters.$text = { $search: search };
  }

  return filters;
};

const getListings = async ({ search, category, city, area, sort = 'newest', page = 1, limit = 10 }) => {
  const pageNumber = Number(page) || 1;
  const pageSize = Math.min(Number(limit) || 10, 50);

  const filters = buildFilters({ search, category, city, area });

  const sortOption = sort === 'az' ? { name: 1 } : { createdAt: -1 };

  const query = Listing.find(filters).sort(sortOption);
  const total = await Listing.countDocuments(filters);

  const listings = await query
    .skip((pageNumber - 1) * pageSize)
    .limit(pageSize)
    .lean();

  const data = listings.map((listing) => ({
    id: listing._id.toString(),
    owner: listing.owner?.toString(),
    name: listing.name,
    category: listing.category,
    location: listing.location,
    shortDescription: listing.shortDescription,
    description: listing.description,
    phone: listing.phone,
    hours: listing.hours,
    imageUrl: listing.imageUrl,
    isActive: listing.isActive,
    createdAt: listing.createdAt,
    updatedAt: listing.updatedAt,
  }));

  return {
    results: data,
    pagination: {
      page: pageNumber,
      limit: pageSize,
      total,
      totalPages: Math.ceil(total / pageSize),
    },
  };
};

const getListingById = async (id, { includeInactive = false } = {}) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(404, 'Listing not found');
  }

  const listing = await Listing.findById(id);

  if (!listing || (!listing.isActive && !includeInactive)) {
    throw new ApiError(404, 'Listing not found');
  }

  return toListingDto(listing);
};

const createListing = async (ownerId, payload) => {
  const listing = await Listing.create({ owner: ownerId, ...payload });
  return toListingDto(listing);
};

const assertOwnership = (listing, user) => {
  if (!listing.owner.equals(user.id) && user.role !== 'admin') {
    throw new ApiError(403, 'You do not have permission to modify this listing');
  }
};

const updateListing = async (listingId, payload, user) => {
  const listing = await Listing.findById(listingId);
  if (!listing) {
    throw new ApiError(404, 'Listing not found');
  }

  assertOwnership(listing, user);

  Object.assign(listing, payload);
  await listing.save();

  return toListingDto(listing);
};

const deleteListing = async (listingId, user) => {
  const listing = await Listing.findById(listingId);
  if (!listing) {
    throw new ApiError(404, 'Listing not found');
  }

  assertOwnership(listing, user);
  await listing.deleteOne();
  return true;
};

const getUserListings = async (ownerId) => {
  const listings = await Listing.find({ owner: ownerId }).sort({ createdAt: -1 }).lean();
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
  getListings,
  getListingById,
  createListing,
  updateListing,
  deleteListing,
  getUserListings,
};
