import { useState, useEffect } from 'react';
import { metaAPI } from '../lib/api';

export const FilterBar = ({ filters, onFilterChange }) => {
  const [categories, setCategories] = useState([]);
  const [locations, setLocations] = useState([]);

  useEffect(() => {
    loadMetaData();
  }, []);

  const loadMetaData = async () => {
    try {
      const [categoriesRes, locationsRes] = await Promise.all([
        metaAPI.getCategories(),
        metaAPI.getLocations(),
      ]);
      setCategories(categoriesRes.data);
      setLocations(locationsRes.data);
    } catch (error) {
      console.error('Failed to load metadata:', error);
    }
  };

  const handleChange = (field, value) => {
    onFilterChange({ ...filters, [field]: value });
  };

  const uniqueCities = [...new Set(locations.map((l) => l.city))];

  const areasForCity = filters.city
    ? locations.filter((l) => l.city === filters.city).map((l) => l.area)
    : [];

  return (
    <div className="bg-white p-4 rounded-lg shadow-md mb-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
          <input
            type="text"
            placeholder="Search businesses..."
            value={filters.search || ''}
            onChange={(e) => handleChange('search', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
          <select
            value={filters.category || ''}
            onChange={(e) => handleChange('category', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat.key} value={cat.key}>
                {cat.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
          <select
            value={filters.city || ''}
            onChange={(e) => {
              handleChange('city', e.target.value);
              handleChange('area', ''); // Reset area when city changes
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Cities</option>
            {uniqueCities.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Area</label>
          <select
            value={filters.area || ''}
            onChange={(e) => handleChange('area', e.target.value)}
            disabled={!filters.city}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
          >
            <option value="">All Areas</option>
            {areasForCity.map((area) => (
              <option key={area} value={area}>
                {area}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-4 flex items-center space-x-4">
        <label className="block text-sm font-medium text-gray-700">Sort by:</label>
        <select
          value={filters.sort || 'newest'}
          onChange={(e) => handleChange('sort', e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="newest">Newest First</option>
          <option value="az">A to Z</option>
        </select>
      </div>
    </div>
  );
};
