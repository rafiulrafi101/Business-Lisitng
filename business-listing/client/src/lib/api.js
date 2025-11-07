const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const defaultHeaders = {
  'Content-Type': 'application/json',
};

const handleResponse = async (response) => {
  let payload;
  try {
    payload = await response.json();
  } catch {
    payload = {};
  }

  if (!response.ok || payload.success === false) {
    const message = payload?.error?.message || response.statusText || 'Request failed';
    const error = new Error(message);
    error.details = payload?.error?.details;
    error.status = response.status;
    throw error;
  }

  return payload.data ?? payload;
};

const request = (path, options = {}) =>
  fetch(`${API_BASE}${path}`, {
    credentials: 'include',
    ...options,
    headers: {
      ...defaultHeaders,
      ...(options.headers || {}),
    },
  }).then(handleResponse);

export const get = (path, options = {}) =>
  request(path, {
    ...options,
    method: 'GET',
    headers: {
      ...(options.headers || {}),
    },
  });

export const post = (path, body, options = {}) =>
  request(path, {
    ...options,
    method: 'POST',
    body: body ? JSON.stringify(body) : undefined,
  });

export const put = (path, body, options = {}) =>
  request(path, {
    ...options,
    method: 'PUT',
    body: body ? JSON.stringify(body) : undefined,
  });

export const del = (path, options = {}) =>
  request(path, {
    ...options,
    method: 'DELETE',
  });

export const buildQuery = (params = {}) => {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      searchParams.set(key, value);
    }
  });
  const queryString = searchParams.toString();
  return queryString ? `?${queryString}` : '';
};
