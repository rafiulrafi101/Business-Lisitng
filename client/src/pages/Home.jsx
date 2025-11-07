import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SuggestedLocationsPanel } from '../components/SuggestedLocationsPanel';

export const Home = () => {
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    navigate(`/listings?${params.toString()}`);
  };

  const handleLocationClick = (city, area) => {
    const params = new URLSearchParams({ city, area });
    navigate(`/listings?${params.toString()}`);
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Find Local Businesses in Your Area
            </h1>
            <p className="text-xl mb-8 text-blue-100">
              Discover and connect with trusted local businesses
            </p>
            <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  placeholder="Search for businesses..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="flex-1 px-6 py-4 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-300"
                />
                <button
                  type="submit"
                  className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-bold px-8 py-4 rounded-lg transition-colors duration-200"
                >
                  Search
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <h2 className="text-3xl font-bold mb-6">Popular Categories</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {['Haircut', 'Laundry', 'Electronics', 'Fashion', 'Market'].map((category) => (
                <button
                  key={category}
                  onClick={() => navigate(`/listings?category=${category}`)}
                  className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 text-center"
                >
                  <div className="text-4xl mb-2">
                    {category === 'Haircut' && '✂️'}
                    {category === 'Laundry' && '🧺'}
                    {category === 'Electronics' && '💻'}
                    {category === 'Fashion' && '👗'}
                    {category === 'Market' && '🛒'}
                  </div>
                  <h3 className="font-semibold text-gray-900">{category}</h3>
                </button>
              ))}
            </div>

            <div className="mt-12">
              <h2 className="text-3xl font-bold mb-6">Why Choose BizList?</h2>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <div className="text-3xl mb-3">🔍</div>
                  <h3 className="text-xl font-semibold mb-2">Easy to Find</h3>
                  <p className="text-gray-600">
                    Search and filter businesses by category, location, and more.
                  </p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <div className="text-3xl mb-3">⭐</div>
                  <h3 className="text-xl font-semibold mb-2">Trusted Listings</h3>
                  <p className="text-gray-600">
                    All businesses are verified and maintained by our community.
                  </p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <div className="text-3xl mb-3">📱</div>
                  <h3 className="text-xl font-semibold mb-2">Always Updated</h3>
                  <p className="text-gray-600">
                    Get the latest contact info and business hours at your fingertips.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <SuggestedLocationsPanel onLocationClick={handleLocationClick} />
          </div>
        </div>
      </div>
    </div>
  );
};
