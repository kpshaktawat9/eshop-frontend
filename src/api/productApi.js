import api from './axios';

export const getCategories = (shopId) =>
  api.get(`/storefront/${shopId}/categories`);

export const getProducts = (shopId, params = {}) =>
  api.get(`/storefront/${shopId}/products`, { params });

export const getProduct = (shopId, slug) =>
  api.get(`/storefront/${shopId}/products/${slug}`);
