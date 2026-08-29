import api from './api';
export const getDashboard = () => api.get('/admin/dashboard').then((r) => r.data.data);
export const getAnalytics = () => api.get('/admin/analytics').then((r) => r.data.data);
export const getInventory = (params) => api.get('/admin/inventory', { params }).then((r) => r.data);
export const adjustStock = (id, change) => api.patch(`/admin/inventory/${id}/stock`, { change }).then((r) => r.data.data);
export const setAvailability = (id, isAvailable) => api.patch(`/admin/inventory/${id}/availability`, { isAvailable }).then((r) => r.data.data);
export const getUsers = (params) => api.get('/admin/users', { params }).then((r) => r.data.data);
