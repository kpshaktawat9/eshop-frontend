import api from './axios';

export const resolveShop = (host) =>
  api.get('/storefront/resolve', { params: { host } });

export const getShopInfo = (shopId) =>
  api.get(`/storefront/${shopId}/info`);
