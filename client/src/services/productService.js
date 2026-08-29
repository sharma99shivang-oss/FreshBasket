import api from './api';

export const getProducts = async (params = {}) => (await api.get('/products', { params })).data;
export const getProductSuggestions = async (q) => (await api.get('/products/suggestions', { params: { q } })).data;
export const getProduct = async (id) => (await api.get(`/products/${id}`)).data;
export const createProduct = async (data) => (await api.post('/products', data, { headers: { 'Content-Type': 'multipart/form-data' } })).data;
export const updateProduct = async (id, data) => (await api.put(`/products/${id}`, data, { headers: { 'Content-Type': 'multipart/form-data' } })).data;
export const deleteProduct = async (id) => (await api.delete(`/products/${id}`)).data;
