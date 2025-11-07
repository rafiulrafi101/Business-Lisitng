const asyncHandler = require('../utils/asyncHandler');
const sendResponse = require('../utils/sendResponse');
const { getCategories, getLocations } = require('../services/meta.service');

const categories = asyncHandler(async (req, res) => {
  const data = await getCategories();
  sendResponse(res, 200, { categories: data });
});

const locations = asyncHandler(async (req, res) => {
  const data = await getLocations();
  sendResponse(res, 200, { locations: data });
});

module.exports = {
  categories,
  locations,
};
