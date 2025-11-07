const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const handleResponse = async (response) => {
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Something went wrong');
  }

  return data;
};

const fetchWithCredentials = async (url, options = {}) => {
  const response = await fetch(`${API_URL}${url}`, {
    ...options,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  return handleResponse(response);
};

// Auth API
export const authAPI = {
  register: (data) =>
    fetchWithCredentials('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  login: (data) =>
    fetchWithCredentials('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  logout: () =>
    fetchWithCredentials('/auth/logout', {
      method: 'POST',
    }),
};

// User API
export const userAPI = {
  getMe: () => fetchWithCredentials('/users/me'),

  getMyBookmarks: () => fetchWithCredentials('/users/me/bookmarks'),

  toggleBookmark: (listingId) =>
    fetchWithCredentials(`/users/me/bookmarks/${listingId}`, {
      method: 'POST',
    }),
};

// Listing API
export const listingAPI = {
  getListings: (params) => {
    const query = new URLSearchParams(params).toString();
    return fetchWithCredentials(`/listings?${query}`);
  },

  getListingById: (id) => fetchWithCredentials(`/listings/${id}`),

  getMyListings: () => fetchWithCredentials('/listings/my-listings'),

  createListing: (data) =>
    fetchWithCredentials('/listings', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  updateListing: (id, data) =>
    fetchWithCredentials(`/listings/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  deleteListing: (id) =>
    fetchWithCredentials(`/listings/${id}`, {
      method: 'DELETE',
    }),
};

// Meta API
export const metaAPI = {
  getCategories: () => fetchWithCredentials('/meta/categories'),

  getLocations: () => fetchWithCredentials('/meta/locations'),
};

// Admin API
export const adminAPI = {
  getStats: () => fetchWithCredentials('/admin/stats'),
};
