import { useEffect, useState } from 'react';
import { api } from '../lib/api.js';

const AdminStatsPage = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    api
      .get('/admin/stats')
      .then((data) => {
        setStats(data);
        setError(null);
      })
      .catch((err) => {
        setError(err.message);
        setStats(null);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="space-y-6">
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-semibold text-slate-900">Admin dashboard</h1>
        <p className="mt-1 text-sm text-slate-600">Quick overview of platform statistics.</p>
      </div>

      {loading && (
        <div className="rounded-lg border border-slate-200 bg-white p-6 text-center text-slate-600">
          Loading statistics…
        </div>
      )}

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-center text-sm text-red-700">
          {error}
        </div>
      )}

      {stats && (
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm text-slate-500">Total users</p>
            <p className="mt-2 text-3xl font-semibold text-slate-900">{stats.users}</p>
          </div>
          <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm text-slate-500">Total listings</p>
            <p className="mt-2 text-3xl font-semibold text-slate-900">{stats.totalListings}</p>
          </div>
          <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm text-slate-500">Active listings</p>
            <p className="mt-2 text-3xl font-semibold text-slate-900">{stats.activeListings}</p>
          </div>
        </div>
      )}
    </section>
  );
};

export default AdminStatsPage;
