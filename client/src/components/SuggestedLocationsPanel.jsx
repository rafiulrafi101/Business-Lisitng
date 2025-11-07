import { useState, useEffect } from 'react';
import { metaAPI } from '../lib/api';

export const SuggestedLocationsPanel = ({ onLocationClick }) => {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLocations();
  }, []);

  const loadLocations = async () => {
    try {
      const response = await metaAPI.getLocations();
      setLocations(response.data);
    } catch (error) {
      console.error('Failed to load locations:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white p-4 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4">Loading...</h3>
      </div>
    );
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-4 text-gray-900">Suggested Locations</h3>
      <div className="space-y-2">
        {locations.map((location, index) => (
          <button
            key={index}
            onClick={() => onLocationClick(location.city, location.area)}
            className="w-full text-left px-3 py-2 rounded-md hover:bg-blue-50 transition-colors duration-150"
          >
            <div className="text-sm font-medium text-gray-900">{location.city}</div>
            <div className="text-xs text-gray-600">{location.area}</div>
          </button>
        ))}
      </div>
    </div>
  );
};
