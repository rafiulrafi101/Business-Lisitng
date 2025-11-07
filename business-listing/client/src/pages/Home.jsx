import Listings from './Listings.jsx';

const Home = () => (
  <div className="home">
    <section className="hero">
      <div className="container hero-inner">
        <div className="hero-content">
          <span className="hero-tag">Discover local gems</span>
          <h1>Find and share the best businesses around you</h1>
          <p>
            Search by category or neighbourhood, bookmark your favourites, and manage your own
            listings in one place.
          </p>
        </div>
      </div>
    </section>
    <Listings showIntro />
  </div>
);

export default Home;
