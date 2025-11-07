/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { api } from '../lib/api.js';

const MetaContext = createContext({
  categories: [],
  locations: [],
  refreshMeta: async () => {},
});

export const MetaProvider = ({ children }) => {
  const [categories, setCategories] = useState([]);
  const [locations, setLocations] = useState([]);

  const refreshMeta = async () => {
    const [cats, locs] = await Promise.all([api.get('/meta/categories'), api.get('/meta/locations')]);
    setCategories(cats);
    setLocations(locs);
  };

  useEffect(() => {
    refreshMeta().catch(() => {
      setCategories([]);
      setLocations([]);
    });
  }, []);

  const value = useMemo(
    () => ({
      categories,
      locations,
      refreshMeta,
    }),
    [categories, locations],
  );

  return <MetaContext.Provider value={value}>{children}</MetaContext.Provider>;
};

export const useMeta = () => {
  const ctx = useContext(MetaContext);
  if (!ctx) {
    throw new Error('useMeta must be used within MetaProvider');
  }
  return ctx;
};
