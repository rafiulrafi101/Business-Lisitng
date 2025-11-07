import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import FilterBar from '../components/FilterBar.jsx';
import ListingCard from '../components/ListingCard.jsx';
import Pagination from '../components/Pagination.jsx';
import SuggestedLocationsPanel from '../components/SuggestedLocationsPanel.jsx';
import { useListings } from '../lib/useListings.js';
import { useAuth } from '../state/AuthContext.jsx';
import { api } from '../lib/api.js';

const parseFilters = (searchParams) => ({
  search: searchParams.get('search') || '',
  category: searchParams.get('category') || '',
  city: searchParams.get('city') || '',
  area: searchParams.get('area') || '',
  sort: searchParams.get('sort') || 'newest',
  page: Number(searchParams.get('page') || 1),
});

const ListingsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const filters = useMemo(() => parseFilters(searchParams), [searchParams]);
  const { listings, pagination, loading, error } = useListings(filters);
  const { isAuthenticated } = useAuth();
  const [bookmarkedIds, setBookmarkedIds] = useState(new Set());

  const updateParams = (nextFilters) => {
    const params = new URLSearchParams(searchParams);
    Object.entries(nextFilters).forEach(([key, value]) => {
      if (value === undefined || value === null || value === '') {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    });
    setSearchParams(params);
  };

  const handleFilterChange = (nextFilters) => {
    updateParams({ ...nextFilters, page: 1 });
  };

  const handlePageChange = (page) => {
    updateParams({ page });
  };

  const handleSuggestedSelect = ({ city, area }) => {
    updateParams({ city, area, page: 1 });
  };

  const toggleBookmark = async (listingId) => {
    const result = await api.post(`/users/me/bookmarks/${listingId}`);
    setBookmarkedIds((prev) => {
      const updated = new Set(prev);
      if (result.bookmarked) {
        updated.add(listingId);
      } else {
        updated.delete(listingId);
      }
      return updated;
    });
  };

  useEffect(() => {
    if (!isAuthenticated) {
      setBookmarkedIds(new Set());
      return;
    }

    api
      .get('/users/me/bookmarks')
      .then((data) => {
        setBookmarkedIds(new Set(data.map((bookmark) => bookmark.listing.id)));
      })
      .catch(() => setBookmarkedIds(new Set()));
  }, [isAuthenticated]);

  return (
    <section className="flex flex-col gap-6 lg:flex-row">
      <div className="flex-1 space-y-6">
        <FilterBar filters={filters} onChange={handleFilterChange} showSearch />

        {loading && (
          <div className="rounded-lg border border-slate-200 bg-white p-6 text-center text-slate-600">
            Loading listings…
          </div>
        )}

        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-center text-sm text-red-700">
            {error}
          </div>
        )}

        {!loading && !error && listings.length === 0 && (
          <div className="rounded-lg border border-slate-200 bg-white p-6 text-center text-slate-600">
            No listings found. Try adjusting your filters.
          </div>
        )}

        <div className="grid gap-4 sm:grid-cols-2">
          {listings.map((listing) => (
            <ListingCard
              key={listing.id}
              listing={listing}
              onBookmarkToggle={isAuthenticated ? toggleBookmark : undefined}
                isBookmarked={bookmarkedIds.has(listing.id)}
            />
          ))}
        </div>

        <Pagination
          page={pagination.page || 1}
          totalPages={pagination.totalPages || 1}
          onChange={handlePageChange}
        />
      </div>

      <SuggestedLocationsPanel onSelect={handleSuggestedSelect} />
    </section>
  );
};

export default ListingsPage;
