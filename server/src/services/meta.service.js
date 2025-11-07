const Category = require('../models/Category');
const Location = require('../models/Location');

const getCategories = async () => {
  const categories = await Category.find().sort({ label: 1 }).lean();
  return categories.map((category) => ({
    id: category._id.toString(),
    key: category.key,
    label: category.label,
  }));
};

const getLocations = async () => {
  const locations = await Location.find().sort({ city: 1, area: 1 }).lean();
  return locations.map((location) => ({
    id: location._id.toString(),
    city: location.city,
    area: location.area,
  }));
};

module.exports = {
  getCategories,
  getLocations,
};
