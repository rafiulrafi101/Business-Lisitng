import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../lib/api.js';
import { useAuth } from '../state/AuthContext.jsx';

const ProfilePage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchListings = () => {
    setLoading(true);
    api
      .get('/users/me/listings')
      .then((data) => {
        setListings(data);
        setError(null);
      })
      .catch((err) => {
        setError(err.message);
        setListings([]);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchListings();
  }, []);

  const handleDelete = async (listingId) => {
    if (!window.confirm('Delete this listing? This action cannot be undone.')) {
      return;
    }
    await api.delete(`/listings/${listingId}`);
    fetchListings();
  };

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-6 shadow-sm md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Hi {user.name}</h1>
          <p className="text-sm text-slate-600">
            Manage your business listings and keep information up to date.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            to="/new-listing"
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700"
          >
            Add new listing
          </Link>
          <Link
            to="/bookmarks"
            className="rounded-md border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 hover:border-blue-200 hover:text-blue-600"
          >
            View bookmarks
          </Link>
          {user.role === 'admin' && (
            <Link
              to="/admin/stats"
              className="rounded-md border border-amber-200 px-4 py-2 text-sm font-semibold text-amber-600"
            >
              View admin stats
            </Link>
          )}
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900">My listings</h2>
          <span className="text-sm text-slate-500">{listings.length} total</span>
        </div>

        {loading && (
          <div className="mt-4 rounded-md border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
            Loading listings…
          </div>
        )}

        {error && (
          <div className="mt-4 rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        {!loading && !error && listings.length === 0 && (
          <div className="mt-4 rounded-md border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
            You have not created any listings yet.
          </div>
        )}

        <div className="mt-4 space-y-3">
          {listings.map((listing) => (
            <div
              key={listing.id}
              className="flex flex-col gap-3 rounded-md border border-slate-200 p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <h3 className="text-base font-semibold text-slate-900">{listing.name}</h3>
                <p className="text-sm text-slate-600">
                  {listing.category} · {listing.location.city} / {listing.location.area}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => navigate(`/listings/${listing.id}/edit`)}
                  className="rounded-md border border-slate-200 px-3 py-1 text-sm font-medium text-slate-600 hover:border-blue-200 hover:text-blue-600"
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => navigate(`/listings/${listing.id}`)}
                  className="rounded-md border border-slate-200 px-3 py-1 text-sm font-medium text-slate-600 hover:border-blue-200 hover:text-blue-600"
                >
                  View
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(listing.id)}
                  className="rounded-md border border-red-200 px-3 py-1 text-sm font-medium text-red-600 hover:bg-red-50"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProfilePage;
