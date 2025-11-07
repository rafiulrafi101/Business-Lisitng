import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { listingAPI, userAPI } from '../lib/api';
import { useAuth } from '../lib/AuthContext';

export const ListingDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [bookmarked, setBookmarked] = useState(false);

  useEffect(() => {
    loadListing();
  }, [id]);

  const loadListing = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await listingAPI.getListingById(id);
      setListing(response.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleBookmark = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    try {
      await userAPI.toggleBookmark(id);
      setBookmarked(!bookmarked);
    } catch (err) {
      console.error('Bookmark error:', err);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this listing?')) return;

    try {
      await listingAPI.deleteListing(id);
      navigate('/profile');
    } catch (err) {
      alert('Failed to delete listing: ' + err.message);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !listing) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error || 'Listing not found'}
        </div>
      </div>
    );
  }

  const isOwner = user && listing.owner._id === user._id;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link to="/listings" className="text-blue-600 hover:text-blue-800 mb-4 inline-block">
        ← Back to Listings
      </Link>

      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {listing.imageUrl && (
          <div className="h-96 overflow-hidden">
            <img
              src={listing.imageUrl}
              alt={listing.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/800x400?text=No+Image';
              }}
            />
          </div>
        )}

        <div className="p-8">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{listing.name}</h1>
              <div className="flex items-center space-x-3">
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                  {listing.category}
                </span>
                <span className="text-gray-600">
                  {listing.location.city}, {listing.location.area}
                </span>
              </div>
            </div>
            {isAuthenticated && (
              <button
                onClick={handleBookmark}
                className="text-2xl hover:scale-110 transition-transform"
              >
                {bookmarked ? '❤️' : '🤍'}
              </button>
            )}
          </div>

          <div className="border-t border-gray-200 pt-6 mb-6">
            <h2 className="text-xl font-semibold mb-3">About</h2>
            <p className="text-gray-700 whitespace-pre-line">{listing.description}</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 border-t border-gray-200 pt-6">
            {listing.phone && (
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Phone</h3>
                <a href={`tel:${listing.phone}`} className="text-blue-600 hover:underline">
                  {listing.phone}
                </a>
              </div>
            )}
            {listing.hours && (
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Hours</h3>
                <p className="text-gray-700 whitespace-pre-line">{listing.hours}</p>
              </div>
            )}
          </div>

          {isOwner && (
            <div className="border-t border-gray-200 pt-6 mt-6 flex space-x-4">
              <Link
                to={`/listings/${id}/edit`}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md font-medium"
              >
                Edit Listing
              </Link>
              <button
                onClick={handleDelete}
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-md font-medium"
              >
                Delete Listing
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
