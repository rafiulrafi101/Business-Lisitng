import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import FilterBar from '../components/FilterBar.jsx';
import SuggestedLocationsPanel from '../components/SuggestedLocationsPanel.jsx';
import ListingCard from '../components/ListingCard.jsx';
import Pagination from '../components/Pagination.jsx';
import { useMeta } from '../state/MetaContext.jsx';
import { useAuth } from '../state/AuthContext.jsx';
import * as api from '../lib/api';

const getFiltersFromParams = (params) => ({
  search: params.get('search') || '',
  category: params.get('category') || '',
  city: params.get('city') || '',
  area: params.get('area') || '',
  sort: params.get('sort') || 'newest',
  page: Number(params.get('page') || 1),
});

const Listings = ({ showIntro = false }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { categories, locations } = useMeta();
  const { user } = useAuth();
  const [listings, setListings] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0, limit: 10 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const filters = useMemo(() => getFiltersFromParams(searchParams), [searchParams]);

  const updateParams = (nextFilters) => {
    const params = new URLSearchParams();
    Object.entries(nextFilters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '' && !(key === 'page' && value === 1)) {
        params.set(key, value);
      }
    });
    setSearchParams(params);
  };

  useEffect(() => {
    let isCancelled = false;

    const fetchListings = async () => {
      setLoading(true);
      setError(null);
      try {
        const query = api.buildQuery({
          search: filters.search,
          category: filters.category,
          city: filters.city,
          area: filters.area,
          sort: filters.sort,
          page: filters.page,
        });
        const data = await api.get(`/listings${query}`);
        if (!isCancelled) {
          setListings(data.listings ?? []);
          setPagination(data.pagination ?? { page: 1, pages: 1, total: 0, limit: 10 });
        }
      } catch (err) {
        if (!isCancelled) {
          setError(err.message || 'Unable to load listings');
        }
      } finally {
        if (!isCancelled) {
          setLoading(false);
        }
      }
    };

    fetchListings();

    return () => {
      isCancelled = true;
    };
  }, [filters, user]);

  const handleFilterChange = (name, value) => {
    updateParams({
      ...filters,
      [name]: value,
      page: 1,
    });
  };

  const handleReset = () => {
    setSearchParams({});
  };

  const handleLocationSelect = (city, area) => {
    updateParams({
      ...filters,
      city,
      area,
      page: 1,
    });
  };

  const handlePageChange = (page) => {
    updateParams({
      ...filters,
      page,
    });
  };

  const handleBookmarkToggle = async (listing) => {
    try {
      if (!user) {
        navigate('/login');
        return;
      }
      if (listing.isBookmarked) {
        await api.del(`/users/me/bookmarks/${listing.id}`);
      } else {
        await api.post(`/users/me/bookmarks/${listing.id}`);
      }
      setListings((prev) =>
        prev.map((item) =>
          item.id === listing.id ? { ...item, isBookmarked: !item.isBookmarked } : item,
        ),
      );
    } catch (err) {
      setError(err.message || 'Unable to update bookmark');
    }
  };

  return (
    <section className="container listings-view">
      {showIntro && (
        <div className="listings-intro card">
          <h2>Browse top-rated local businesses</h2>
          <p>
            Filter by category, location, or search by keyword. Results are refreshed instantly when
            you change any filter.
          </p>
        </div>
      )}

      <div className="listings-layout">
        <div className="listings-main">
          <FilterBar
            filters={filters}
            onFilterChange={handleFilterChange}
            onReset={handleReset}
            categories={categories}
            locations={locations}
          />

          {loading ? (
            <div className="listings-status">Loading listings...</div>
          ) : error ? (
            <div className="listings-status listings-status--error">{error}</div>
          ) : listings.length === 0 ? (
            <div className="listings-status">No listings match your filters yet.</div>
          ) : (
            <>
              <div className="grid grid-3">
                {listings.map((listing) => (
                  <ListingCard
                    key={listing.id}
                    listing={listing}
                    onBookmarkToggle={handleBookmarkToggle}
                  />
                ))}
              </div>
              <Pagination
                currentPage={pagination.page || 1}
                totalPages={pagination.pages || 1}
                onPageChange={handlePageChange}
              />
            </>
          )}
        </div>

        <div className="listings-sidebar">
          <SuggestedLocationsPanel
            locations={locations}
            onSelect={handleLocationSelect}
            selectedCity={filters.city}
            selectedArea={filters.area}
          />
        </div>
      </div>
    </section>
  );
};

export default Listings;
