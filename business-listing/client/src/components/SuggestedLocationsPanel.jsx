import { useMemo, useState } from 'react';

const SuggestedLocationsPanel = ({
  locations,
  onSelect,
  selectedCity,
  selectedArea,
}) => {
  const [isOpen, setIsOpen] = useState(true);

  const grouped = useMemo(() => {
    const map = new Map();
    locations.forEach((location) => {
      if (!map.has(location.city)) {
        map.set(location.city, new Set());
      }
      map.get(location.city).add(location.area);
    });
    return Array.from(map.entries()).map(([city, areas]) => ({
      city,
      areas: Array.from(areas).sort(),
    }));
  }, [locations]);

  const handleSelect = (city, area) => {
    onSelect(city, area);
  };

  return (
    <aside className="suggested-panel card">
      <button
        type="button"
        className="suggested-panel-toggle"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        Suggested Locations {isOpen ? '▾' : '▸'}
      </button>
      {isOpen && (
        <div className="suggested-list">
          <button
            type="button"
            className={`suggested-button ${
              !selectedCity ? 'suggested-button--active' : ''
            }`}
            onClick={() => handleSelect('', '')}
          >
            All locations
          </button>
          {grouped.map(({ city, areas }) => (
            <div key={city} className="suggested-group">
              <p className="suggested-city">{city}</p>
              <div className="suggested-areas">
                {areas.map((area) => {
                  const isActive = selectedCity === city && selectedArea === area;
                  return (
                    <button
                      key={`${city}-${area}`}
                      type="button"
                      className={`suggested-button ${
                        isActive ? 'suggested-button--active' : ''
                      }`}
                      onClick={() => handleSelect(city, area)}
                    >
                      {area}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </aside>
  );
};

export default SuggestedLocationsPanel;
