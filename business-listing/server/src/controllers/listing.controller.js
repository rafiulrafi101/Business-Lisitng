const asyncHandler = require('../utils/asyncHandler');
const sendResponse = require('../utils/sendResponse');
const {
  getListings,
  getListingById,
  createListing,
  updateListing,
  deleteListing,
} = require('../services/listing.service');

const list = asyncHandler(async (req, res) => {
  const { listings, pagination } = await getListings({
    ...req.query,
    page: Number(req.query.page || 1),
    limit: Number(req.query.limit || 10),
    userId: req.user ? req.user.id : null,
  });
  sendResponse(res, 200, { listings, pagination });
});

const getById = asyncHandler(async (req, res) => {
  const listing = await getListingById(req.params.id, req.user ? req.user.id : null);
  sendResponse(res, 200, { listing });
});

const create = asyncHandler(async (req, res) => {
  const listing = await createListing(req.user.id, req.body);
  sendResponse(res, 201, { listing });
});

const update = asyncHandler(async (req, res) => {
  const listing = await updateListing(req.params.id, req.user, req.body);
  sendResponse(res, 200, { listing });
});

const remove = asyncHandler(async (req, res) => {
  await deleteListing(req.params.id, req.user);
  sendResponse(res, 200, { message: 'Listing deleted' });
});

module.exports = {
  list,
  getById,
  create,
  update,
  remove,
};
