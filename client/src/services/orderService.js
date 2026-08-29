import api from './api';

export const placeOrder = (data) => api.post('/orders/checkout', data).then((response) => response.data.data);
export const getMyOrders = () => api.get('/orders/my-orders').then((response) => response.data.data);
export const getMyOrder = (id) => api.get(`/orders/my-orders/${id}`).then((response) => response.data.data);
export const cancelOrder = (id) => api.patch(`/orders/my-orders/${id}/cancel`).then((response) => response.data.data);
export const getOrders = (params) => api.get('/orders', { params }).then((response) => response.data.data);
export const updateOrderStatus = (id, orderStatus) => api.patch(`/orders/${id}/status`, { orderStatus }).then((response) => response.data.data);
