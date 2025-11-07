const asyncHandler = require('../utils/asyncHandler');
const { sendSuccess } = require('../utils/response');
const listingService = require('../services/listing.service');

const getListings = asyncHandler(async (req, res) => {
  const { query } = req.validated || {};
  const result = await listingService.getListings(query || req.query);
  return sendSuccess(res, result);
});

const getListingById = asyncHandler(async (req, res) => {
  const { id } = req.validated?.params || req.params;
  const listing = await listingService.getListingById(id);
  return sendSuccess(res, listing);
});

const createListing = asyncHandler(async (req, res) => {
  const { body } = req.validated;
  const listing = await listingService.createListing(req.user.id, body);
  return sendSuccess(res, listing, 201);
});

const updateListing = asyncHandler(async (req, res) => {
  const {
    params: { id },
    body,
  } = req.validated;
  const listing = await listingService.updateListing(id, body, req.user);
  return sendSuccess(res, listing);
});

const deleteListing = asyncHandler(async (req, res) => {
  const { id } = req.validated.params;
  await listingService.deleteListing(id, req.user);
  return sendSuccess(res, { message: 'Listing deleted' });
});

module.exports = {
  getListings,
  getListingById,
  createListing,
  updateListing,
  deleteListing,
};
