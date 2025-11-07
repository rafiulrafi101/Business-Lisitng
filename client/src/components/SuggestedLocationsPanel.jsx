import { useMemo } from 'react';
import { useMeta } from '../state/MetaContext.jsx';

const SuggestedLocationsPanel = ({ onSelect }) => {
  const { locations } = useMeta();

  const suggestions = useMemo(
    () =>
      locations.slice(0, 8).map((location) => ({
        id: `${location.city}-${location.area}`,
        city: location.city,
        area: location.area,
      })),
    [locations],
  );

  return (
    <aside className="sticky top-24 hidden h-max min-w-[230px] rounded-lg border border-slate-200 bg-white p-4 shadow-sm lg:block">
      <h2 className="text-sm font-semibold text-slate-800">Suggested locations</h2>
      <p className="mt-1 text-xs text-slate-500">Tap to filter listings quickly.</p>
      <div className="mt-3 flex flex-col gap-2">
        {suggestions.map((suggestion) => (
          <button
            key={suggestion.id}
            type="button"
            onClick={() => onSelect?.(suggestion)}
            className="rounded-md border border-slate-200 px-3 py-2 text-left text-sm text-slate-600 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
          >
            <span className="block font-medium">{suggestion.area}</span>
            <span className="text-xs text-slate-500">{suggestion.city}</span>
          </button>
        ))}
        {suggestions.length === 0 && (
          <p className="text-sm text-slate-500">No suggestions available yet.</p>
        )}
      </div>
    </aside>
  );
};

export default SuggestedLocationsPanel;
