import { useMemo } from 'react';

const FilterBar = ({ filters, onFilterChange, onReset, categories, locations }) => {
  const cities = useMemo(
    () => Array.from(new Set(locations.map((location) => location.city))).sort(),
    [locations],
  );

  const areas = useMemo(() => {
    if (!filters.city) return [];
    return locations
      .filter((location) => location.city === filters.city)
      .map((location) => location.area)
      .sort();
  }, [filters.city, locations]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    onFilterChange(name, value);
    if (name === 'city') {
      onFilterChange('area', '');
    }
  };

  const handleReset = (event) => {
    event.preventDefault();
    onReset();
  };

  return (
    <section className="filter-bar card">
      <form className="filter-form">
        <div className="filter-row">
          <div className="filter-field">
            <label htmlFor="filter-search">Search</label>
            <input
              id="filter-search"
              name="search"
              className="input"
              type="search"
              placeholder="Find by name or description"
              value={filters.search}
              onChange={handleChange}
            />
          </div>
          <div className="filter-field">
            <label htmlFor="filter-category">Category</label>
            <select
              id="filter-category"
              name="category"
              className="select"
              value={filters.category}
              onChange={handleChange}
            >
              <option value="">All categories</option>
              {categories.map((category) => (
                <option key={category.id || category.key} value={category.label || category.key}>
                  {category.label}
                </option>
              ))}
            </select>
          </div>
          <div className="filter-field">
            <label htmlFor="filter-city">City</label>
            <select
              id="filter-city"
              name="city"
              className="select"
              value={filters.city}
              onChange={handleChange}
            >
              <option value="">All cities</option>
              {cities.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </div>
          <div className="filter-field">
            <label htmlFor="filter-area">Area</label>
            <select
              id="filter-area"
              name="area"
              className="select"
              value={filters.area}
              onChange={handleChange}
              disabled={!filters.city}
            >
              <option value="">All areas</option>
              {areas.map((area) => (
                <option key={area} value={area}>
                  {area}
                </option>
              ))}
            </select>
          </div>
          <div className="filter-field">
            <label htmlFor="filter-sort">Sort</label>
            <select
              id="filter-sort"
              name="sort"
              className="select"
              value={filters.sort}
              onChange={handleChange}
            >
              <option value="newest">Newest</option>
              <option value="az">A–Z</option>
            </select>
          </div>
        </div>
        <div className="filter-actions">
          <button type="button" className="btn btn-secondary" onClick={handleReset}>
            Clear filters
          </button>
        </div>
      </form>
    </section>
  );
};

export default FilterBar;
