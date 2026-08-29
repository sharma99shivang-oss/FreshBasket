import api from './api';

export const getAddresses = () => api.get('/addresses').then((response) => response.data.data);
export const createAddress = (data) => api.post('/addresses', data).then((response) => response.data.data);
export const updateAddress = (id, data) => api.put(`/addresses/${id}`, data).then((response) => response.data.data);
export const deleteAddress = (id) => api.delete(`/addresses/${id}`).then((response) => response.data.data);
