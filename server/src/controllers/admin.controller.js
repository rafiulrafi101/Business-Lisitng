const asyncHandler = require('../utils/asyncHandler');
const { sendSuccess } = require('../utils/response');
const adminService = require('../services/admin.service');

const getStats = asyncHandler(async (req, res) => {
  const stats = await adminService.getStats();
  return sendSuccess(res, stats);
});

module.exports = {
  getStats,
};
