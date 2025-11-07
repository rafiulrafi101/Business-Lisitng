/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import * as api from '../lib/api';

const MetaContext = createContext(null);

export const MetaProvider = ({ children }) => {
  const [categories, setCategories] = useState([]);
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadMeta = useCallback(async () => {
    try {
      setLoading(true);
      const [categoryData, locationData] = await Promise.all([
        api.get('/meta/categories'),
        api.get('/meta/locations'),
      ]);
      setCategories(categoryData.categories ?? []);
      setLocations(locationData.locations ?? []);
      setError(null);
    } catch (err) {
      setError(err.message || 'Failed to load metadata');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadMeta();
  }, [loadMeta]);

  const value = useMemo(
    () => ({
      categories,
      locations,
      loading,
      error,
      refresh: loadMeta,
    }),
    [categories, locations, loading, error, loadMeta],
  );

  return <MetaContext.Provider value={value}>{children}</MetaContext.Provider>;
};

export const useMeta = () => {
  const context = useContext(MetaContext);
  if (!context) {
    throw new Error('useMeta must be used within MetaProvider');
  }
  return context;
};
