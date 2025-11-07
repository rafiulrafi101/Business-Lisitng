const asyncHandler = require('../utils/asyncHandler');
const sendResponse = require('../utils/sendResponse');
const { getStats } = require('../services/admin.service');

const stats = asyncHandler(async (req, res) => {
  const data = await getStats();
  sendResponse(res, 200, data);
});

module.exports = {
  stats,
};
