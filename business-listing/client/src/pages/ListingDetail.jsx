import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../state/AuthContext.jsx';
import * as api from '../lib/api';

const placeholderImage = 'https://placehold.co/800x500?text=Business';

const ListingDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const isOwner =
    user && listing && (listing.owner?.id === user.id || user.role === 'admin');

  useEffect(() => {
    let cancelled = false;
    const fetchListing = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await api.get(`/listings/${id}`);
        if (!cancelled) {
          setListing(data.listing);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message || 'Unable to load listing');
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchListing();

    return () => {
      cancelled = true;
    };
  }, [id]);

  const handleBookmark = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    try {
      if (listing.isBookmarked) {
        await api.del(`/users/me/bookmarks/${listing.id}`);
      } else {
        await api.post(`/users/me/bookmarks/${listing.id}`);
      }
      setListing((prev) => ({ ...prev, isBookmarked: !prev.isBookmarked }));
    } catch (err) {
      setError(err.message || 'Unable to update bookmark');
    }
  };

  const handleDelete = async () => {
    if (!isOwner) return;
    const confirmed = window.confirm('Are you sure you want to delete this listing?');
    if (!confirmed) return;
    try {
      await api.del(`/listings/${listing.id}`);
      navigate('/profile');
    } catch (err) {
      setError(err.message || 'Unable to delete listing');
    }
  };

  if (loading) {
    return (
      <section className="container detail">
        <div className="listings-status">Loading listing...</div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="container detail">
        <div className="listings-status listings-status--error">{error}</div>
      </section>
    );
  }

  if (!listing) {
    return null;
  }

  return (
    <section className="container detail">
      <Link to="/listings" className="detail-back">
        ← Back to listings
      </Link>
      <div className="detail-card card">
        <div className="detail-media">
          <img src={listing.imageUrl || placeholderImage} alt={listing.name} loading="lazy" />
        </div>
        <div className="detail-header">
          <div>
            <span className="detail-category">{listing.category}</span>
            <h1>{listing.name}</h1>
            <p className="detail-location">
              {listing.location?.city}, {listing.location?.area}
            </p>
          </div>
          <div className="detail-actions">
            {user && (
              <button
                type="button"
                className={`btn btn-outline detail-bookmark ${
                  listing.isBookmarked ? 'detail-bookmark--active' : ''
                }`}
                onClick={handleBookmark}
              >
                {listing.isBookmarked ? '★ Saved' : '☆ Save'}
              </button>
            )}
            {isOwner && (
              <>
                <Link to={`/listings/${listing.id}/edit`} className="btn btn-secondary">
                  Edit
                </Link>
                <button type="button" className="btn btn-outline" onClick={handleDelete}>
                  Delete
                </button>
              </>
            )}
          </div>
        </div>
        <div className="detail-body">
          <article>
            <h2>Description</h2>
            <p>{listing.description}</p>
          </article>
          <article className="detail-info">
            <h2>Details</h2>
            <ul>
              {listing.phone && (
                <li>
                  <strong>Phone:</strong> <a href={`tel:${listing.phone}`}>{listing.phone}</a>
                </li>
              )}
              {listing.hours && (
                <li>
                  <strong>Hours:</strong> {listing.hours}
                </li>
              )}
              <li>
                <strong>Owner:</strong> {listing.owner?.name || 'Not specified'}
              </li>
            </ul>
          </article>
        </div>
      </div>
    </section>
  );
};

export default ListingDetail;
