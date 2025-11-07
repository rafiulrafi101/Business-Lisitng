import { Listing } from '../models/Listing.js';
import { ApiError } from '../utils/ApiError.js';

export const listingService = {
  async getListings(filters = {}) {
    const {
      search = '',
      category = '',
      city = '',
      area = '',
      sort = 'newest',
      page = 1,
      limit = 12,
    } = filters;

    const query = { isActive: true };

    // Text search
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { shortDescription: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    // Category filter
    if (category) {
      query.category = category;
    }

    // Location filters
    if (city) {
      query['location.city'] = city;
    }
    if (area) {
      query['location.area'] = area;
    }

    // Sort options
    let sortOption = {};
    if (sort === 'newest') {
      sortOption = { createdAt: -1 };
    } else if (sort === 'az') {
      sortOption = { name: 1 };
    }

    const skip = (page - 1) * limit;

    const [listings, total] = await Promise.all([
      Listing.find(query)
        .sort(sortOption)
        .skip(skip)
        .limit(limit)
        .populate('owner', 'name email')
        .lean(),
      Listing.countDocuments(query),
    ]);

    return {
      listings,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    };
  },

  async getListingById(id) {
    const listing = await Listing.findById(id).populate('owner', 'name email').lean();
    if (!listing) {
      throw new ApiError(404, 'Listing not found');
    }
    return listing;
  },

  async createListing(userId, listingData) {
    const listing = await Listing.create({
      ...listingData,
      owner: userId,
    });
    return listing;
  },

  async updateListing(listingId, userId, userRole, updateData) {
    const listing = await Listing.findById(listingId);
    if (!listing) {
      throw new ApiError(404, 'Listing not found');
    }

    // Check ownership or admin
    if (listing.owner.toString() !== userId && userRole !== 'admin') {
      throw new ApiError(403, 'Not authorized to update this listing');
    }

    Object.assign(listing, updateData);
    await listing.save();
    return listing;
  },

  async deleteListing(listingId, userId, userRole) {
    const listing = await Listing.findById(listingId);
    if (!listing) {
      throw new ApiError(404, 'Listing not found');
    }

    // Check ownership or admin
    if (listing.owner.toString() !== userId && userRole !== 'admin') {
      throw new ApiError(403, 'Not authorized to delete this listing');
    }

    await listing.deleteOne();
    return { message: 'Listing deleted successfully' };
  },

  async getMyListings(userId) {
    const listings = await Listing.find({ owner: userId })
      .sort({ createdAt: -1 })
      .lean();
    return listings;
  },
};
