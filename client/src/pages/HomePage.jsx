import { Link } from 'react-router-dom';
import { useMemo, useState } from 'react';
import FilterBar from '../components/FilterBar.jsx';
import ListingCard from '../components/ListingCard.jsx';
import SuggestedLocationsPanel from '../components/SuggestedLocationsPanel.jsx';
import { useListings } from '../lib/useListings.js';
import { api } from '../lib/api.js';

const defaultFilters = {
  search: '',
  category: '',
  city: '',
  area: '',
  sort: 'newest',
  page: 1,
  limit: 6,
};

const HomePage = () => {
  const [filters, setFilters] = useState(defaultFilters);
  const { listings, loading, error } = useListings(filters);
  const listingsLink = useMemo(() => {
    const { limit: _limit, ...params } = filters;
    const query = api.buildQueryString(params);
    return `/listings${query}`;
  }, [filters]);

  const handleFiltersChange = (nextFilters) => {
    setFilters((prev) => ({
      ...prev,
      ...nextFilters,
      page: 1,
    }));
  };

  const handleSuggestedSelect = ({ city, area }) => {
    setFilters((prev) => ({
      ...prev,
      city,
      area,
      page: 1,
    }));
  };

  return (
    <section className="flex flex-col gap-8 lg:flex-row">
      <div className="flex-1 space-y-6">
        <div className="rounded-xl border border-blue-100 bg-gradient-to-r from-blue-50 via-white to-white p-6 shadow-sm">
          <h1 className="text-2xl font-semibold text-slate-900 md:text-3xl">
            Discover local businesses near you
          </h1>
          <p className="mt-2 max-w-xl text-sm text-slate-600">
            Browse curated listings, filter by category or neighborhood, and save your favourites
            for quick access.
          </p>
        </div>

        <FilterBar filters={filters} onChange={handleFiltersChange} showSearch />

        {loading && (
          <div className="rounded-lg border border-slate-200 bg-white p-6 text-center text-slate-600">
            Loading featured listings…
          </div>
        )}

        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-center text-sm text-red-700">
            {error}
          </div>
        )}

        {!loading && !error && listings.length === 0 && (
          <div className="rounded-lg border border-slate-200 bg-white p-6 text-center text-slate-600">
            No listings match your filters yet. Try another combination.
          </div>
        )}

        <div className="grid gap-4 sm:grid-cols-2">
          {listings.map((listing) => (
            <ListingCard key={listing.id} listing={listing} />
          ))}
        </div>

        <div className="flex justify-end">
          <Link
            to={listingsLink}
            className="inline-flex items-center gap-2 rounded-md border border-blue-200 px-4 py-2 text-sm font-semibold text-blue-600 hover:bg-blue-50"
          >
            View all listings →
          </Link>
        </div>
      </div>

      <SuggestedLocationsPanel onSelect={handleSuggestedSelect} />
    </section>
  );
};

export default HomePage;
