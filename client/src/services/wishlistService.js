import api from './api';

export const getWishlist = () => api.get('/wishlist').then((response) => response.data.data);
export const addWishlistItem = (productId) => api.post('/wishlist/items', { productId }).then((response) => response.data.data);
export const removeWishlistItem = (productId) => api.delete(`/wishlist/items/${productId}`).then((response) => response.data.data);
