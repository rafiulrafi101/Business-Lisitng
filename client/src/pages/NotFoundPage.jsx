import { Link } from 'react-router-dom';

const NotFoundPage = () => (
  <section className="mx-auto flex w-full max-w-xl flex-col items-center gap-4 rounded-xl border border-slate-200 bg-white p-8 text-center shadow-sm">
    <h1 className="text-3xl font-semibold text-slate-900">Page not found</h1>
    <p className="text-sm text-slate-600">
      The page you are looking for doesn't exist or has been moved. Try going back to the homepage.
    </p>
    <Link
      to="/"
      className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700"
    >
      Back to home
    </Link>
  </section>
);

export default NotFoundPage;
