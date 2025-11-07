import { Link } from 'react-router-dom';

const ListingCard = ({
  listing,
  onBookmarkToggle,
  isBookmarked = false,
  showActions = false,
  onEdit,
  onDelete,
}) => (
  <article className="flex flex-col overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm transition hover:shadow-md">
    {listing.imageUrl ? (
      <img
        src={listing.imageUrl}
        alt={listing.name}
        className="h-48 w-full object-cover"
        loading="lazy"
      />
    ) : (
      <div className="flex h-48 w-full items-center justify-center bg-slate-100 text-slate-400">
        No image
      </div>
    )}
    <div className="flex flex-1 flex-col gap-3 p-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">{listing.name}</h3>
          <p className="text-sm font-medium text-blue-600">{listing.category}</p>
        </div>
        {onBookmarkToggle && (
          <button
            type="button"
            onClick={() => onBookmarkToggle(listing.id)}
            className={`rounded-full border px-3 py-1 text-xs font-semibold transition ${
              isBookmarked
                ? 'border-blue-200 bg-blue-100 text-blue-700'
                : 'border-slate-200 text-slate-500 hover:border-blue-200 hover:text-blue-600'
            }`}
          >
            {isBookmarked ? 'Bookmarked' : 'Bookmark'}
          </button>
        )}
      </div>
      <p className="text-sm text-slate-600">
        {listing.shortDescription?.length > 120
          ? `${listing.shortDescription.slice(0, 120)}…`
          : listing.shortDescription}
      </p>
      <div className="flex flex-wrap gap-2 text-xs text-slate-500">
        <span className="rounded-full bg-slate-100 px-2 py-1">
          {listing.location?.city} · {listing.location?.area}
        </span>
        <span className="rounded-full bg-slate-100 px-2 py-1">{listing.phone}</span>
      </div>
      <div className="mt-auto flex items-center justify-between pt-3">
        <Link
          to={`/listings/${listing.id}`}
          className="text-sm font-semibold text-blue-600 hover:text-blue-700"
        >
          View details →
        </Link>
        {showActions && (
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => onEdit?.(listing)}
              className="rounded-md border border-slate-200 px-3 py-1 text-xs font-medium text-slate-600 hover:border-blue-200 hover:text-blue-600"
            >
              Edit
            </button>
            <button
              type="button"
              onClick={() => onDelete?.(listing)}
              className="rounded-md border border-red-200 px-3 py-1 text-xs font-medium text-red-600 hover:bg-red-50"
            >
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  </article>
);

export default ListingCard;
