const API_URL = "http://localhost:3001/api";

const getToken = () => localStorage.getItem("token");

export const request = async (path, options = {}) => {
  const token = getToken();
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  });

  const data = await response.json().catch(() => null);
  if (!response.ok) throw new Error(data?.message || "No se pudo completar la accion.");
  return data;
};

export const authApi = {
  login: (payload) => request("/auth/login", { method: "POST", body: JSON.stringify(payload) }),
  register: (payload) => request("/auth/register", { method: "POST", body: JSON.stringify(payload) }),
};

export const productsApi = {
  list: () => request("/products"),
  create: (payload) => request("/products", { method: "POST", body: JSON.stringify(payload) }),
  update: (id, payload) => request(`/products/${id}`, { method: "PUT", body: JSON.stringify(payload) }),
  remove: (id) => request(`/products/${id}`, { method: "DELETE" }),
};

export const ordersApi = {
  list: () => request("/orders"),
  create: (items) => request("/orders", { method: "POST", body: JSON.stringify({ items }) }),
  update: (id, status) => request(`/orders/${id}`, { method: "PUT", body: JSON.stringify({ status }) }),
  remove: (id) => request(`/orders/${id}`, { method: "DELETE" }),
};

export const usersApi = {
  list: () => request("/users"),
  create: (payload) => request("/users", { method: "POST", body: JSON.stringify(payload) }),
  update: (id, payload) => request(`/users/${id}`, { method: "PUT", body: JSON.stringify(payload) }),
  remove: (id) => request(`/users/${id}`, { method: "DELETE" }),
};
