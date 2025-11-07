const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api';

const defaultHeaders = {
  'Content-Type': 'application/json',
};

const handleResponse = async (response) => {
  const data = await response.json().catch(() => ({}));

  if (!response.ok || data.success === false) {
    const errorMessage =
      data?.error?.message || data?.message || `Request failed with status ${response.status}`;
    const error = new Error(errorMessage);
    error.status = response.status;
    error.details = data?.error?.details;
    throw error;
  }

  return data.data ?? data;
};

const request = async (path, options = {}) => {
  const init = {
    credentials: 'include',
    headers: {
      ...defaultHeaders,
      ...(options.headers || {}),
    },
    ...options,
  };

  if (init.body === undefined) {
    delete init.headers['Content-Type'];
  }

  const response = await fetch(`${API_BASE_URL}${path}`, init);

  return handleResponse(response);
};

const buildQueryString = (params = {}) => {
  const entries = Object.entries(params).filter(
    ([, value]) => value !== undefined && value !== null && value !== '',
  );

  if (entries.length === 0) return '';
  const query = new URLSearchParams(entries).toString();
  return `?${query}`;
};

const withBody = (method) => (path, body, options = {}) =>
  request(path, {
    method,
    body: body !== undefined ? JSON.stringify(body) : undefined,
    ...options,
  });

export const api = {
  get: (path, options) => request(path, { method: 'GET', ...options }),
  post: withBody('POST'),
  put: withBody('PUT'),
  delete: (path, options) => request(path, { method: 'DELETE', ...options }),
  buildQueryString,
};
