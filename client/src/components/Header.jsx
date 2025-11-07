import { useEffect, useMemo, useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../state/AuthContext.jsx';
import { useMeta } from '../state/MetaContext.jsx';

const Header = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { categories } = useMeta();
  const navigate = useNavigate();
  const location = useLocation();
  const [search, setSearch] = useState('');

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    setSearch(params.get('search') || '');
  }, [location]);

  const categoryLinks = useMemo(() => categories.slice(0, 4), [categories]);

  const handleSubmit = (event) => {
    event.preventDefault();
    const params = new URLSearchParams(location.search);
    if (search) {
      params.set('search', search);
    } else {
      params.delete('search');
    }
    navigate(`/listings${params.toString() ? `?${params.toString()}` : ''}`);
  };

  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center justify-between gap-6">
          <Link to="/" className="text-xl font-semibold text-slate-900">
            Local Listings
          </Link>
          <nav className="hidden items-center gap-4 text-sm font-medium text-slate-600 md:flex">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `hover:text-slate-900 ${isActive ? 'text-slate-900' : ''}`
              }
            >
              Home
            </NavLink>
            <NavLink
              to="/listings"
              className={({ isActive }) =>
                `hover:text-slate-900 ${isActive ? 'text-slate-900' : ''}`
              }
            >
              Listings
            </NavLink>
            {isAuthenticated && (
              <>
                <NavLink
                  to="/bookmarks"
                  className={({ isActive }) =>
                    `hover:text-slate-900 ${isActive ? 'text-slate-900' : ''}`
                  }
                >
                  My bookmarks
                </NavLink>
                <NavLink
                  to="/profile"
                  className={({ isActive }) =>
                    `hover:text-slate-900 ${isActive ? 'text-slate-900' : ''}`
                  }
                >
                  My profile
                </NavLink>
              </>
            )}
          </nav>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-1 items-center gap-2">
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search for businesses..."
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
          />
          <button
            type="submit"
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Search
          </button>
        </form>

        <div className="flex items-center justify-between gap-2 text-sm">
          {isAuthenticated ? (
            <>
              <span className="hidden text-slate-600 md:inline">Hi, {user.name}</span>
              <button
                type="button"
                onClick={logout}
                className="rounded-md border border-slate-200 px-3 py-1 font-medium text-slate-600 hover:border-slate-300 hover:text-slate-900"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <NavLink
                to="/login"
                className="rounded-md px-3 py-1 font-medium text-slate-600 hover:text-slate-900"
              >
                Login
              </NavLink>
              <NavLink
                to="/register"
                className="rounded-md bg-blue-600 px-3 py-1 font-medium text-white hover:bg-blue-700"
              >
                Register
              </NavLink>
            </>
          )}
        </div>
      </div>

      {categoryLinks.length > 0 && (
        <div className="border-t border-slate-200 bg-slate-50">
          <div className="mx-auto flex max-w-6xl flex-wrap gap-2 px-4 py-3 text-sm text-slate-600">
            <span className="font-medium text-slate-700">Popular categories:</span>
            {categoryLinks.map((category) => (
              <button
                key={category.id}
                type="button"
                onClick={() => navigate(`/listings?category=${encodeURIComponent(category.label)}`)}
                className="rounded-full border border-transparent bg-white px-3 py-1 shadow-sm transition hover:border-blue-200 hover:bg-blue-50"
              >
                {category.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
