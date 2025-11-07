const User = require('../models/User');
const Listing = require('../models/Listing');

const getStats = async () => {
  const [users, totalListings, activeListings] = await Promise.all([
    User.countDocuments(),
    Listing.countDocuments(),
    Listing.countDocuments({ isActive: true }),
  ]);

  return {
    users,
    totalListings,
    activeListings,
  };
};

module.exports = {
  getStats,
};
