const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

export const getStoredTokens = () => {
  const access = localStorage.getItem('mc_access_token');
  const refresh = localStorage.getItem('mc_refresh_token');
  return { access, refresh };
};

export const setStoredTokens = (access, refresh) => {
  if (access) localStorage.setItem('mc_access_token', access);
  if (refresh) localStorage.setItem('mc_refresh_token', refresh);
};

export const clearStoredTokens = () => {
  localStorage.removeItem('mc_access_token');
  localStorage.removeItem('mc_refresh_token');
  localStorage.removeItem('mc_user');
};

export const getStoredUser = () => {
  try {
    const userStr = localStorage.getItem('mc_user');
    return userStr ? JSON.parse(userStr) : null;
  } catch (e) {
    return null;
  }
};

export const setStoredUser = (user) => {
  if (user) localStorage.setItem('mc_user', JSON.stringify(user));
};

// Refresh expired access token
async function refreshAccessToken() {
  const { refresh } = getStoredTokens();
  if (!refresh) return null;

  try {
    const res = await fetch(`${API_BASE_URL}/auth/refresh/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh }),
    });

    if (res.ok) {
      const data = await res.json();
      setStoredTokens(data.access, data.refresh || refresh);
      return data.access;
    }
  } catch (err) {
    console.error('Failed to refresh token:', err);
  }

  clearStoredTokens();
  return null;
}

// Universal fetch wrapper
export async function apiRequest(endpoint, options = {}) {
  let { access } = getStoredTokens();
  const url = `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  if (access) {
    headers['Authorization'] = `Bearer ${access}`;
  }

  let response = await fetch(url, {
    ...options,
    headers,
  });

  // Handle 401 Unauthorized by trying refresh once
  if (response.status === 401 && access) {
    const newAccess = await refreshAccessToken();
    if (newAccess) {
      headers['Authorization'] = `Bearer ${newAccess}`;
      response = await fetch(url, {
        ...options,
        headers,
      });
    }
  }

  // Parse response
  let data;
  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    data = await response.json();
  } else {
    data = await response.text();
  }

  if (!response.ok) {
    let errorMsg = 'An error occurred';
    if (typeof data === 'object' && data !== null) {
      if (data.error) errorMsg = data.error;
      else if (data.detail) errorMsg = data.detail;
      else {
        // Collect field errors
        const messages = [];
        for (const [key, val] of Object.entries(data)) {
          const valStr = Array.isArray(val) ? val.join(' ') : String(val);
          messages.push(`${key}: ${valStr}`);
        }
        if (messages.length > 0) errorMsg = messages.join('\n');
      }
    } else if (typeof data === 'string' && data) {
      errorMsg = data;
    }
    const err = new Error(errorMsg);
    err.status = response.status;
    err.data = data;
    throw err;
  }

  return data;
}

export const api = {
  get: (endpoint) => apiRequest(endpoint, { method: 'GET' }),
  post: (endpoint, body) => apiRequest(endpoint, { method: 'POST', body: JSON.stringify(body) }),
  patch: (endpoint, body) => apiRequest(endpoint, { method: 'PATCH', body: JSON.stringify(body) }),
  put: (endpoint, body) => apiRequest(endpoint, { method: 'PUT', body: JSON.stringify(body) }),
  delete: (endpoint) => apiRequest(endpoint, { method: 'DELETE' }),
};
