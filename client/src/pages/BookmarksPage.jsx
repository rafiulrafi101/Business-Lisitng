import { useEffect, useState } from 'react';
import ListingCard from '../components/ListingCard.jsx';
import { api } from '../lib/api.js';

const BookmarksPage = () => {
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchBookmarks = () => {
    setLoading(true);
    api
      .get('/users/me/bookmarks')
      .then((data) => {
        setBookmarks(data);
        setError(null);
      })
      .catch((err) => {
        setError(err.message);
        setBookmarks([]);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchBookmarks();
  }, []);

  const toggleBookmark = async (listingId) => {
    await api.post(`/users/me/bookmarks/${listingId}`);
    fetchBookmarks();
  };

  return (
    <section className="space-y-6">
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-semibold text-slate-900">My bookmarks</h1>
        <p className="mt-1 text-sm text-slate-600">Quick access to businesses you saved earlier.</p>
      </div>

      {loading && (
        <div className="rounded-lg border border-slate-200 bg-white p-6 text-center text-slate-600">
          Loading bookmarks…
        </div>
      )}

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-center text-sm text-red-700">
          {error}
        </div>
      )}

      {!loading && !error && bookmarks.length === 0 && (
        <div className="rounded-lg border border-slate-200 bg-white p-6 text-center text-slate-600">
          You have not bookmarked any listings yet.
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        {bookmarks.map((bookmark) => (
          <ListingCard
            key={bookmark.listing.id}
            listing={bookmark.listing}
            onBookmarkToggle={toggleBookmark}
            isBookmarked
          />
        ))}
      </div>
    </section>
  );
};

export default BookmarksPage;
