import { useEffect, useState } from 'react';
import ListingCard from '../components/ListingCard.jsx';
import { useAuth } from '../state/AuthContext.jsx';
import * as api from '../lib/api';

const Bookmarks = () => {
  const { user } = useAuth();
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    const fetchBookmarks = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await api.get('/users/me/bookmarks');
        if (!cancelled) {
          setBookmarks(data.bookmarks ?? []);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message || 'Unable to load bookmarks');
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };
    fetchBookmarks();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleRemove = async (listingId) => {
    try {
      await api.del(`/users/me/bookmarks/${listingId}`);
      setBookmarks((prev) => prev.filter((item) => item.listing.id !== listingId));
    } catch (err) {
      setError(err.message || 'Unable to remove bookmark');
    }
  };

  return (
    <section className="container bookmarks">
      <div className="bookmarks-header">
        <h1>My bookmarks</h1>
        <p>Saved places for quick access.</p>
      </div>
      {loading ? (
        <div className="listings-status">Loading bookmarks...</div>
      ) : error ? (
        <div className="listings-status listings-status--error">{error}</div>
      ) : bookmarks.length === 0 ? (
        <div className="listings-status">You have no bookmarks yet.</div>
      ) : (
        <div className="grid grid-3">
          {bookmarks.map((bookmark) => (
            <ListingCard
              key={bookmark.id}
              listing={{ ...bookmark.listing, isBookmarked: true }}
              onBookmarkToggle={() => handleRemove(bookmark.listing.id)}
              actions={
                user && (
                  <button
                    type="button"
                    className="btn btn-outline"
                    onClick={() => handleRemove(bookmark.listing.id)}
                  >
                    Remove
                  </button>
                )
              }
            />
          ))}
        </div>
      )}
    </section>
  );
};

export default Bookmarks;
