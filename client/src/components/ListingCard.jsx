import { Link } from 'react-router-dom';

export const ListingCard = ({ listing }) => {
  return (
    <Link
      to={`/listings/${listing._id}`}
      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200"
    >
      <div className="h-48 bg-gray-200 overflow-hidden">
        {listing.imageUrl ? (
          <img
            src={listing.imageUrl}
            alt={listing.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/400x300?text=No+Image';
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            No Image
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-1 truncate">{listing.name}</h3>
        <div className="flex items-center space-x-2 mb-2 text-sm text-gray-600">
          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium">
            {listing.category}
          </span>
          <span>•</span>
          <span>
            {listing.location.city}, {listing.location.area}
          </span>
        </div>
        <p className="text-gray-600 text-sm line-clamp-2">{listing.shortDescription}</p>
      </div>
    </Link>
  );
};
