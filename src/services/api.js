// ─────────────────────────────────────────────────────────
//  API Service — Central fetch wrapper
//  Base URL comes from .env → VITE_API_BASE_URL
// ─────────────────────────────────────────────────────────

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

// ── Helper: get auth headers ────────────────────────────
function authHeaders() {
  const token = localStorage.getItem('admin_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// ── Helper: generic fetch wrapper ───────────────────────
async function request(endpoint, { method = 'GET', body = null } = {}) {
  const url = `${BASE_URL}${endpoint}`;

  const options = {
    method,
    headers: {
      ...authHeaders(),
    },
  };

  if (body) {
    if (body instanceof FormData) {
      options.body = body;
      // Do not set Content-Type for FormData, browser sets it with boundary
    } else {
      options.headers['Content-Type'] = 'application/json';
      options.body = JSON.stringify(body);
    }
  }

  const res = await fetch(url, options);

  if (res.status === 401) {
    // Token is invalid or expired — clear it and redirect to login if on admin page
    // BUT skip this if we're already on the login page (prevents reload loop on bad credentials)
    const path = window.location.pathname;
    localStorage.removeItem('admin_token');
    if (path.startsWith('/admin') && path !== '/admin/login') {
      window.location.href = '/admin/login';
    }
    const text = await res.text();
    throw new Error(text || 'Unauthorized');
  }

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `Request failed with status ${res.status}`);
  }

  // 204 No Content (common for DELETE)
  if (res.status === 204) return null;

  return res.json();
}

// ═════════════════════════════════════════════════════════
//  Product API
// ═════════════════════════════════════════════════════════

export const productApi = {
  //  GET /api/products/
  getAll: () => request('/products'),

  //  POST /api/admin-panel/products/create/
  create: (data) => request('/admin-panel/products/create', {
    method: 'POST',
    body: data,
  }),

  //  PATCH /api/admin-panel/products/:id/update/
  update: (id, data) => request(`/admin-panel/products/${id}/update`, {
    method: 'PATCH',
    body: data,
  }),

  //  DELETE /api/admin-panel/products/:id/delete/
  delete: (id) => request(`/admin-panel/products/${id}/delete`, {
    method: 'DELETE',
  }),
};

// ═════════════════════════════════════════════════════════
//  Category API
// ═════════════════════════════════════════════════════════

export const categoryApi = {
  //  GET /api/admin-panel/categories/
  getAll: () => request('/admin-panel/categories'),

  //  POST /api/admin-panel/categories/create/
  create: (data) => request('/admin-panel/categories', {
    method: 'POST',
    body: data,
  }),

  //  PATCH /api/admin-panel/categories/:id/update/
  update: (id, data) => request(`/admin-panel/categories/${id}/update`, {
    method: 'PATCH',
    body: data,
  }),

  //  DELETE /api/admin-panel/categories/:id/delete/
  delete: (id) => request(`/admin-panel/categories/${id}/delete`, {
    method: 'DELETE',
  }),
};

// ═════════════════════════════════════════════════════════
//  Auth API
// ═════════════════════════════════════════════════════════

export const authApi = {
  //  POST /api/admin-panel/login/
  login: (username, password) =>
    request('/admin-panel/login', {
      method: 'POST',
      body: { username, password },
    }),
};
