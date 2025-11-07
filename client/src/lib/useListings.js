import { useEffect, useMemo, useState } from 'react';
import { api } from './api.js';

const defaultPagination = {
  page: 1,
  total: 0,
  totalPages: 1,
  limit: 10,
};

export const useListings = (filters) => {
  const [listings, setListings] = useState([]);
  const [pagination, setPagination] = useState(defaultPagination);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const serializedFilters = useMemo(() => JSON.stringify(filters || {}), [filters]);

  useEffect(() => {
    const parsed = JSON.parse(serializedFilters);
    setLoading(true);
    setError(null);

    const query = api.buildQueryString(parsed);

    api
      .get(`/listings${query}`)
      .then((data) => {
        setListings(data.results || []);
        setPagination(data.pagination || defaultPagination);
      })
      .catch((err) => {
        setError(err.message);
        setListings([]);
        setPagination(defaultPagination);
      })
      .finally(() => setLoading(false));
  }, [serializedFilters]);

  return { listings, pagination, loading, error };
};
