import { adminService } from '../services/admin.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const adminController = {
  getStats: asyncHandler(async (req, res) => {
    const stats = await adminService.getStats();
    res.status(200).json({
      success: true,
      data: stats,
    });
  }),
};
