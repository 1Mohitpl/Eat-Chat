export const API_BASE_URL = "http://localhost:5000/api";

const TOKEN_KEY = "beyuumi_token";
const USER_KEY = "beyuumi_user";

const request = async (endpoint, options = {}) => {
  const res = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data.message || "Something went wrong");
  }
  return data;
};

export const getToken = () => {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch (e) {
    return null;
  }
};

export const getUser = () => {
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
};

export const setAuth = ({ token, ...user }) => {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
};

export const clearAuth = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  // orders cache is per-user — never leak it to the next user on this device
  localStorage.removeItem("beyuumi_orders");
};

export const registerUser = async ({ name, email, password }) => {
  const data = await request("/auth/register", {
    method: "POST",
    body: JSON.stringify({ name, email, password }),
  });
  return data;
};

export const loginUser = async ({ email, password }) => {
  const data = await request("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
  return data;
};

export const forgotPassword = async ({ email }) => {
  const data = await request("/auth/forgot-password", {
    method: "POST",
    body: JSON.stringify({ email }),
  });
  return data;
};

export const resetPassword = async ({ token, password }) => {
  const data = await request("/auth/reset-password", {
    method: "POST",
    body: JSON.stringify({ token, password }),
  });
  return data;
};

export const fetchProfile = async () => {
  const token = getToken();
  const data = await request("/auth/profile", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return data;
};

/* ---------------- orders (server-side, scoped to the logged-in user) ---------------- */

const authHeaders = () => ({
  headers: {
    Authorization: `Bearer ${getToken()}`,
  },
});

export const createOrder = async (order) => {
  const data = await request("/orders", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify(order),
  });
  return data.order;
};

export const fetchOrders = async () => {
  const data = await request("/orders", authHeaders());
  return data.orders || [];
};

export const fetchOrder = async (id) => {
  const data = await request(`/orders/${encodeURIComponent(id)}`, authHeaders());
  return data.order;
};
