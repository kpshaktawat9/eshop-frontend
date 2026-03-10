import api from './axios';

export const getCategories = (shopId) =>
  api.get(`/storefront/${shopId}/categories`);

export const getCarousels = (shopId) =>
  api.get(`/storefront/${shopId}/carousels`);

export const getDeals = (shopId) =>
  api.get(`/storefront/${shopId}/deals`);

export const getProducts = (shopId, params = {}) =>
  api.get(`/storefront/${shopId}/products`, { params });

export const getProduct = (shopId, slug) =>
  api.get(`/storefront/${shopId}/products/${slug}`);
