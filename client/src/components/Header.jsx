import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../lib/AuthContext';

export const Header = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <Link to="/" className="text-2xl font-bold text-blue-600">
              BizList
            </Link>
            <nav className="hidden md:flex space-x-6">
              <Link to="/listings" className="text-gray-700 hover:text-blue-600">
                Browse
              </Link>
              {isAuthenticated && (
                <Link to="/listings/new" className="text-gray-700 hover:text-blue-600">
                  Add Listing
                </Link>
              )}
            </nav>
          </div>

          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <Link
                  to="/bookmarks"
                  className="text-gray-700 hover:text-blue-600 hidden sm:block"
                >
                  Bookmarks
                </Link>
                <Link to="/profile" className="text-gray-700 hover:text-blue-600">
                  {user?.name}
                </Link>
                <button
                  onClick={handleLogout}
                  className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-md text-sm font-medium"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-blue-600 font-medium"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
