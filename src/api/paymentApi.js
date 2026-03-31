import api from './axios';

export const initiatePayment = (shopId, orderId) =>
  api.post(`/storefront/${shopId}/orders/${orderId}/pay`);
