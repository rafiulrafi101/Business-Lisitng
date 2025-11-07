import { User } from '../models/User.js';
import { Listing } from '../models/Listing.js';

export const adminService = {
  async getStats() {
    const [totalUsers, totalListings, activeListings] = await Promise.all([
      User.countDocuments(),
      Listing.countDocuments(),
      Listing.countDocuments({ isActive: true }),
    ]);

    return {
      users: totalUsers,
      totalListings,
      activeListings,
    };
  },
};
