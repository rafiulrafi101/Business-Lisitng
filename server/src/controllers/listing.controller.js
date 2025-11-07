import { listingService } from '../services/listing.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const listingController = {
  getListings: asyncHandler(async (req, res) => {
    const result = await listingService.getListings(req.query);
    res.status(200).json({
      success: true,
      data: result,
    });
  }),

  getListingById: asyncHandler(async (req, res) => {
    const listing = await listingService.getListingById(req.params.id);
    res.status(200).json({
      success: true,
      data: listing,
    });
  }),

  createListing: asyncHandler(async (req, res) => {
    const listing = await listingService.createListing(req.user._id, req.body);
    res.status(201).json({
      success: true,
      data: listing,
    });
  }),

  updateListing: asyncHandler(async (req, res) => {
    const listing = await listingService.updateListing(
      req.params.id,
      req.user._id.toString(),
      req.user.role,
      req.body
    );
    res.status(200).json({
      success: true,
      data: listing,
    });
  }),

  deleteListing: asyncHandler(async (req, res) => {
    const result = await listingService.deleteListing(
      req.params.id,
      req.user._id.toString(),
      req.user.role
    );
    res.status(200).json({
      success: true,
      data: result,
    });
  }),

  getMyListings: asyncHandler(async (req, res) => {
    const listings = await listingService.getMyListings(req.user._id);
    res.status(200).json({
      success: true,
      data: listings,
    });
  }),
};
