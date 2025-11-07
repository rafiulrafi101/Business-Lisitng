const asyncHandler = require('../utils/asyncHandler');
const { sendSuccess } = require('../utils/response');
const metaService = require('../services/meta.service');

const getCategories = asyncHandler(async (req, res) => {
  const categories = await metaService.getCategories();
  return sendSuccess(res, categories);
});

const getLocations = asyncHandler(async (req, res) => {
  const locations = await metaService.getLocations();
  return sendSuccess(res, locations);
});

module.exports = {
  getCategories,
  getLocations,
};
