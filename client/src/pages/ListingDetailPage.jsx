import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { api } from '../lib/api.js';
import { useAuth } from '../state/AuthContext.jsx';

const ListingDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    api
      .get(`/listings/${id}`)
      .then((data) => {
        setListing(data);
        setError(null);
      })
      .catch((err) => {
        setError(err.message);
        setListing(null);
      })
      .finally(() => setLoading(false));
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this listing?')) {
      return;
    }

    await api.delete(`/listings/${id}`);
    navigate('/profile');
  };

  if (loading) {
    return (
      <div className="rounded-lg border border-slate-200 bg-white p-6 text-center text-slate-600">
        Loading listing…
      </div>
    );
  }

  if (error || !listing) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-center text-sm text-red-700">
        {error || 'Listing not found.'}
      </div>
    );
  }

  const canEdit = isAuthenticated && (user.role === 'admin' || user.id === listing.owner);

  return (
    <article className="rounded-xl border border-slate-200 bg-white shadow-sm">
      {listing.imageUrl && (
        <img
          src={listing.imageUrl}
          alt={listing.name}
          className="h-64 w-full rounded-t-xl object-cover"
          loading="lazy"
        />
      )}
      <div className="space-y-4 p-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">{listing.name}</h1>
            <p className="text-sm font-medium text-blue-600">{listing.category}</p>
          </div>
          {canEdit && (
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => navigate(`/listings/${id}/edit`)}
                className="rounded-md border border-slate-200 px-3 py-1 text-sm font-medium text-slate-600 hover:border-blue-200 hover:text-blue-600"
              >
                Edit listing
              </button>
              <button
                type="button"
                onClick={handleDelete}
                className="rounded-md border border-red-200 px-3 py-1 text-sm font-medium text-red-600 hover:bg-red-50"
              >
                Delete
              </button>
            </div>
          )}
        </div>

        <div className="flex flex-wrap gap-3 text-sm text-slate-600">
          <span className="rounded-full bg-slate-100 px-3 py-1">
            {listing.location.city} · {listing.location.area}
          </span>
          <span className="rounded-full bg-slate-100 px-3 py-1">{listing.phone}</span>
          <span className="rounded-full bg-slate-100 px-3 py-1">{listing.hours}</span>
        </div>

        <p className="text-base leading-relaxed text-slate-700">{listing.description}</p>

        <div className="rounded-md border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
          <p className="font-semibold text-slate-700">Need to update this listing?</p>
          {canEdit ? (
            <p>
              Use the controls above to edit or remove this entry. Changes are reflected instantly in
              the directory.
            </p>
          ) : (
            <p>Please contact the business owner or admin to modify this listing.</p>
          )}
        </div>
      </div>
    </article>
  );
};

export default ListingDetailPage;
