import { useEffect, useMemo, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../state/AuthContext.jsx';

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [search, setSearch] = useState('');

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    setSearch(params.get('search') || '');
  }, [location.search]);

  const categoryLinks = useMemo(
    () => [
      { label: 'Haircut', value: 'Haircut' },
      { label: 'Laundry', value: 'Laundry' },
      { label: 'Electronics', value: 'Electronics' },
      { label: 'Fashion', value: 'Fashion' },
      { label: 'Market', value: 'Market' },
    ],
    [],
  );

  const navigateWithParams = (params) => {
    const query = params.toString();
    navigate(`/listings${query ? `?${query}` : ''}`);
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    const params = new URLSearchParams(location.search);
    if (search) {
      params.set('search', search);
    } else {
      params.delete('search');
    }
    params.delete('page');
    navigateWithParams(params);
  };

  const handleCategoryClick = (value) => {
    const params = new URLSearchParams();
    params.set('category', value);
    navigateWithParams(params);
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <header className="header">
      <div className="container header-inner">
        <div className="header-brand">
          <Link to="/">LocalBiz Finder</Link>
        </div>

        <form className="header-search" onSubmit={handleSearchSubmit}>
          <label className="sr-only" htmlFor="header-search-input">
            Search listings
          </label>
          <input
            id="header-search-input"
            className="input"
            type="search"
            placeholder="Search businesses"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </form>

        <nav className="header-nav">
          <Link to="/listings" className="header-link">
            Browse
          </Link>
          <div className="header-categories">
            {categoryLinks.map((category) => (
              <button
                key={category.value}
                type="button"
                className="header-category-btn"
                onClick={() => handleCategoryClick(category.value)}
              >
                {category.label}
              </button>
            ))}
          </div>
          {user ? (
            <div className="header-auth">
              <Link to="/profile" className="header-link">
                My Profile
              </Link>
              <Link to="/bookmarks" className="header-link">
                Bookmarks
              </Link>
              <Link to="/listings/new" className="btn btn-primary header-cta">
                Add Listing
              </Link>
              <button type="button" className="btn btn-outline" onClick={handleLogout}>
                Logout
              </button>
            </div>
          ) : (
            <div className="header-auth">
              <Link to="/login" className="btn btn-outline">
                Login
              </Link>
              <Link to="/register" className="btn btn-primary header-cta">
                Register
              </Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
