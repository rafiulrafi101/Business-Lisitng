import { Category } from '../models/Category.js';
import { Location } from '../models/Location.js';

export const metaService = {
  async getCategories() {
    const categories = await Category.find().sort({ label: 1 }).lean();
    return categories;
  },

  async getLocations() {
    const locations = await Location.find().sort({ city: 1, area: 1 }).lean();
    return locations;
  },
};
