import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { listingAPI } from '../lib/api';
import { useAuth } from '../lib/AuthContext';
import { ListingCard } from '../components/ListingCard';

export const Profile = () => {
  const { user } = useAuth();
  const [myListings, setMyListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadMyListings();
  }, []);

  const loadMyListings = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await listingAPI.getMyListings();
      setMyListings(response.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-lg shadow-md p-8 mb-8">
        <h1 className="text-3xl font-bold mb-4">My Profile</h1>
        <div className="space-y-2">
          <p className="text-gray-700">
            <span className="font-semibold">Name:</span> {user?.name}
          </p>
          <p className="text-gray-700">
            <span className="font-semibold">Email:</span> {user?.email}
          </p>
          <p className="text-gray-700">
            <span className="font-semibold">Role:</span>{' '}
            <span className="capitalize">{user?.role}</span>
          </p>
        </div>

        <div className="mt-6 flex space-x-4">
          <Link
            to="/listings/new"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md font-medium"
          >
            Create New Listing
          </Link>
          <Link
            to="/bookmarks"
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-2 rounded-md font-medium"
          >
            View Bookmarks
          </Link>
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-6">My Listings ({myListings.length})</h2>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            Error: {error}
          </div>
        ) : myListings.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-md">
            <p className="text-xl text-gray-600">You haven't created any listings yet.</p>
            <Link
              to="/listings/new"
              className="inline-block mt-4 text-blue-600 hover:text-blue-800 font-medium"
            >
              Create your first listing →
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {myListings.map((listing) => (
              <ListingCard key={listing._id} listing={listing} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
