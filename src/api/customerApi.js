import api from './axios';

export const registerCustomer = (shopId, data) =>
  api.post(`/storefront/${shopId}/customer/register`, data);

export const loginCustomer = (shopId, data) =>
  api.post(`/storefront/${shopId}/customer/login`, data);

export const logoutCustomer = (shopId) =>
  api.post(`/storefront/${shopId}/customer/logout`);

export const getMe = (shopId) =>
  api.get(`/storefront/${shopId}/customer/me`);
