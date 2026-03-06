import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
});

// Attach customer auth token automatically
api.interceptors.request.use((config) => {
  // Try to get shop id from localStorage (set by ShopContext)
  const shopId = localStorage.getItem('current_shop_id');
  const token = shopId ? localStorage.getItem(`customer_token_${shopId}`) : null;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
