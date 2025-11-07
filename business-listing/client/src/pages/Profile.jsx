import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ListingCard from '../components/ListingCard.jsx';
import { useAuth } from '../state/AuthContext.jsx';
import * as api from '../lib/api';

const Profile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    const fetchListings = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await api.get('/users/me/listings');
        if (!cancelled) {
          setListings(data.listings ?? []);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message || 'Unable to load listings');
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };
    fetchListings();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleDelete = async (listingId) => {
    const confirmed = window.confirm('Delete this listing?');
    if (!confirmed) return;
    try {
      await api.del(`/listings/${listingId}`);
      setListings((prev) => prev.filter((item) => item.id !== listingId));
    } catch (err) {
      setError(err.message || 'Unable to delete listing');
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <section className="container profile">
      <div className="profile-header card">
        <div>
          <h1>Hello, {user?.name}</h1>
          <p>{user?.email}</p>
        </div>
        <div className="profile-actions">
          <Link to="/listings/new" className="btn btn-primary">
            Create listing
          </Link>
          <button type="button" className="btn btn-outline" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>

      <div className="profile-section">
        <div className="profile-section-header">
          <h2>My listings</h2>
          <p>Manage your published businesses.</p>
        </div>
        {loading ? (
          <div className="listings-status">Loading your listings...</div>
        ) : error ? (
          <div className="listings-status listings-status--error">{error}</div>
        ) : listings.length === 0 ? (
          <div className="listings-status">No listings yet. Create your first one!</div>
        ) : (
          <div className="grid grid-3">
            {listings.map((listing) => (
              <ListingCard
                key={listing.id}
                listing={listing}
                actions={
                  <>
                    <Link to={`/listings/${listing.id}/edit`} className="btn btn-secondary">
                      Edit
                    </Link>
                    <button
                      type="button"
                      className="btn btn-outline"
                      onClick={() => handleDelete(listing.id)}
                    >
                      Delete
                    </button>
                  </>
                }
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Profile;
