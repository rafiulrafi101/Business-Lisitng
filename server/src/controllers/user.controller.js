import { userService } from '../services/user.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const userController = {
  getMe: asyncHandler(async (req, res) => {
    const user = await userService.getMe(req.user._id);
    res.status(200).json({
      success: true,
      data: user,
    });
  }),

  getMyBookmarks: asyncHandler(async (req, res) => {
    const bookmarks = await userService.getMyBookmarks(req.user._id);
    res.status(200).json({
      success: true,
      data: bookmarks,
    });
  }),

  toggleBookmark: asyncHandler(async (req, res) => {
    const result = await userService.toggleBookmark(req.user._id, req.params.listingId);
    res.status(200).json({
      success: true,
      data: result,
    });
  }),
};
