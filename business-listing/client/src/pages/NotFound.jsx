import { Link } from 'react-router-dom';

const NotFound = () => (
  <section className="container not-found">
    <div className="card not-found-card">
      <h1>404</h1>
      <p>We couldn&apos;t find that page.</p>
      <Link to="/" className="btn btn-primary">
        Back to home
      </Link>
    </div>
  </section>
);

export default NotFound;
