import api from './api';

export const getCart = () => api.get('/cart').then((response) => response.data.data);
export const addCartItem = (productId, quantity = 1) => api.post('/cart/items', { productId, quantity }).then((response) => response.data.data);
export const updateCartItem = (productId, quantity) => api.patch(`/cart/items/${productId}`, { quantity }).then((response) => response.data.data);
export const removeCartItem = (productId) => api.delete(`/cart/items/${productId}`).then((response) => response.data.data);
export const clearCart = () => api.delete('/cart').then((response) => response.data.data);
