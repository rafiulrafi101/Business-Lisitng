import { useMemo } from 'react';
import { useMeta } from '../state/MetaContext.jsx';

const FilterBar = ({ filters, onChange, showSearch = false }) => {
  const { categories, locations } = useMeta();

  const cities = useMemo(() => {
    const unique = new Map();
    locations.forEach((loc) => {
      if (!unique.has(loc.city)) {
        unique.set(loc.city, []);
      }
      unique.get(loc.city).push(loc.area);
    });
    return unique;
  }, [locations]);

  const areas = filters.city
    ? cities.get(filters.city) || []
    : Array.from(new Set(locations.map((loc) => loc.area)));

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    onChange({
      ...filters,
      [name]: value,
      ...(name === 'city' ? { area: '' } : {}),
    });
  };

  const clearFilters = () => {
    onChange({ search: '', category: '', city: '', area: '', sort: filters.sort });
  };

  return (
    <div className="flex flex-wrap items-end gap-4 rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      {showSearch && (
        <div className="flex flex-1 flex-col gap-1">
          <label htmlFor="search" className="text-xs font-medium text-slate-500">
            Search
          </label>
          <input
            id="search"
            name="search"
            value={filters.search || ''}
            onChange={handleInputChange}
            placeholder="Search businesses"
            className="rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
          />
        </div>
      )}

      <div className="flex min-w-[200px] flex-1 flex-col gap-1">
        <label htmlFor="category" className="text-xs font-medium text-slate-500">
          Category
        </label>
        <select
          id="category"
          name="category"
          value={filters.category || ''}
          onChange={handleInputChange}
          className="rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
        >
          <option value="">All categories</option>
          {categories.map((category) => (
            <option key={category.id} value={category.label}>
              {category.label}
            </option>
          ))}
        </select>
      </div>

      <div className="flex min-w-[200px] flex-1 flex-col gap-1">
        <label htmlFor="city" className="text-xs font-medium text-slate-500">
          City
        </label>
        <select
          id="city"
          name="city"
          value={filters.city || ''}
          onChange={handleInputChange}
          className="rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
        >
          <option value="">All cities</option>
          {[...cities.keys()].map((city) => (
            <option key={city} value={city}>
              {city}
            </option>
          ))}
        </select>
      </div>

      <div className="flex min-w-[200px] flex-1 flex-col gap-1">
        <label htmlFor="area" className="text-xs font-medium text-slate-500">
          Area
        </label>
        <select
          id="area"
          name="area"
          value={filters.area || ''}
          onChange={handleInputChange}
          className="rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
          disabled={!filters.city && areas.length === 0}
        >
          <option value="">All areas</option>
          {areas.map((area) => (
            <option key={`${filters.city}-${area}`} value={area}>
              {area}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="sort" className="text-xs font-medium text-slate-500">
          Sort
        </label>
        <select
          id="sort"
          name="sort"
          value={filters.sort || 'newest'}
          onChange={handleInputChange}
          className="rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
        >
          <option value="newest">Newest first</option>
          <option value="az">A to Z</option>
        </select>
      </div>

      <button
        type="button"
        onClick={clearFilters}
        className="ml-auto rounded-md border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 hover:border-slate-300 hover:text-slate-900"
      >
        Clear filters
      </button>
    </div>
  );
};

export default FilterBar;
