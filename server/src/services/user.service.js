import { User } from '../models/User.js';
import { Bookmark } from '../models/Bookmark.js';
import { ApiError } from '../utils/ApiError.js';

export const userService = {
  async getMe(userId) {
    const user = await User.findById(userId).select('-passwordHash').lean();
    if (!user) {
      throw new ApiError(404, 'User not found');
    }
    return user;
  },

  async getMyBookmarks(userId) {
    const bookmarks = await Bookmark.find({ user: userId })
      .populate({
        path: 'listing',
        populate: { path: 'owner', select: 'name email' },
      })
      .sort({ createdAt: -1 })
      .lean();

    return bookmarks.map((b) => b.listing).filter((l) => l); // filter out null listings
  },

  async toggleBookmark(userId, listingId) {
    const existing = await Bookmark.findOne({ user: userId, listing: listingId });

    if (existing) {
      // Remove bookmark
      await existing.deleteOne();
      return { bookmarked: false, message: 'Bookmark removed' };
    } else {
      // Add bookmark
      await Bookmark.create({ user: userId, listing: listingId });
      return { bookmarked: true, message: 'Bookmark added' };
    }
  },

  async isBookmarked(userId, listingId) {
    const bookmark = await Bookmark.findOne({ user: userId, listing: listingId });
    return !!bookmark;
  },
};
