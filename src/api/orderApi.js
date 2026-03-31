import api from './axios';

export const placeOrder = (shopId, data) =>
  api.post(`/storefront/${shopId}/orders`, data);

export const trackOrder = (shopId, orderNumber) =>
  api.get(`/storefront/${shopId}/orders/${orderNumber}`);

export const getMyOrders = (shopId) =>
  api.get(`/storefront/${shopId}/customer/orders`);

export const getLiveTracking = (shopId, awb) =>
  api.get(`/storefront/${shopId}/tracking/${awb}`);
