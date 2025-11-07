import { metaService } from '../services/meta.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const metaController = {
  getCategories: asyncHandler(async (req, res) => {
    const categories = await metaService.getCategories();
    res.status(200).json({
      success: true,
      data: categories,
    });
  }),

  getLocations: asyncHandler(async (req, res) => {
    const locations = await metaService.getLocations();
    res.status(200).json({
      success: true,
      data: locations,
    });
  }),
};
