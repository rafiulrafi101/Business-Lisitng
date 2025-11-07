import { Link } from 'react-router-dom';
import { useAuth } from '../state/AuthContext.jsx';

const placeholderImage = 'https://placehold.co/600x400?text=Business';

const ListingCard = ({ listing, onBookmarkToggle, actions }) => {
  const { user } = useAuth();
  const isBookmarked = listing.isBookmarked ?? false;

  const handleBookmarkClick = (event) => {
    event.preventDefault();
    if (onBookmarkToggle) {
      onBookmarkToggle(listing);
    }
  };

  return (
    <article className="listing-card card">
      <Link to={`/listings/${listing.id}`} className="listing-card-image">
        <img src={listing.imageUrl || placeholderImage} alt={`${listing.name} cover`} loading="lazy" />
      </Link>
      <div className="listing-card-content">
        <div className="listing-card-header">
          <div>
            <p className="listing-card-category">{listing.category}</p>
            <Link to={`/listings/${listing.id}`} className="listing-card-title">
              {listing.name}
            </Link>
          </div>
          {user && (
            <button
              type="button"
              className={`bookmark-btn ${isBookmarked ? 'bookmark-btn--active' : ''}`}
              onClick={handleBookmarkClick}
              aria-label={isBookmarked ? 'Remove bookmark' : 'Save to bookmarks'}
            >
              {isBookmarked ? '★' : '☆'}
            </button>
          )}
        </div>
        <p className="listing-card-meta">
          {listing.location?.city}, {listing.location?.area}
        </p>
        <p className="listing-card-description">{listing.shortDescription}</p>
        <div className="listing-card-footer">
          <Link to={`/listings/${listing.id}`} className="btn btn-secondary">
            View details
          </Link>
          {actions ? <div className="listing-card-actions">{actions}</div> : null}
        </div>
      </div>
    </article>
  );
};

export default ListingCard;
