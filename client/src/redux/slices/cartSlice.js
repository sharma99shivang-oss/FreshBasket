import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import * as cartService from '../../services/cartService';

const storedItems = JSON.parse(localStorage.getItem('freshbasket-cart') || '[]');
const persist = (items) => localStorage.setItem('freshbasket-cart', JSON.stringify(items));
const message = (error) => error.response?.data?.message || 'Unable to update your cart';
const applyRemote = (state, payload) => { state.items = payload.items; state.totals = payload.totals; persist(state.items); };

export const fetchCart = createAsyncThunk('cart/fetch', async (_, { rejectWithValue }) => { try { return await cartService.getCart(); } catch (error) { return rejectWithValue(message(error)); } });
export const addRemoteItem = createAsyncThunk('cart/addRemote', async ({ productId, quantity = 1 }, { rejectWithValue }) => { try { return await cartService.addCartItem(productId, quantity); } catch (error) { return rejectWithValue(message(error)); } });
export const updateRemoteQuantity = createAsyncThunk('cart/updateRemote', async ({ productId, quantity }, { rejectWithValue }) => { try { return await cartService.updateCartItem(productId, quantity); } catch (error) { return rejectWithValue(message(error)); } });
export const removeRemoteItem = createAsyncThunk('cart/removeRemote', async (productId, { rejectWithValue }) => { try { return await cartService.removeCartItem(productId); } catch (error) { return rejectWithValue(message(error)); } });
export const clearRemoteCart = createAsyncThunk('cart/clearRemote', async (_, { rejectWithValue }) => { try { return await cartService.clearCart(); } catch (error) { return rejectWithValue(message(error)); } });

const cartSlice = createSlice({
  name: 'cart', initialState: { items: storedItems, totals: null, status: 'idle', error: null },
  reducers: {
    addItem: (state, { payload }) => { const item = state.items.find(({ _id }) => _id === payload._id); if (item) item.quantity = Math.min(item.quantity + 1, item.stock || Infinity); else state.items.push({ ...payload, quantity: 1 }); persist(state.items); },
    updateQuantity: (state, { payload: { id, quantity } }) => { const item = state.items.find(({ _id }) => _id === id); if (item) item.quantity = Math.max(1, Math.min(quantity, item.stock || Infinity)); persist(state.items); },
    removeItem: (state, { payload }) => { state.items = state.items.filter(({ _id }) => _id !== payload); persist(state.items); },
    clearCart: (state) => { state.items = []; state.totals = null; persist([]); },
  },
  extraReducers: (builder) => builder
    .addCase(fetchCart.pending, (state) => { state.status = 'loading'; })
    .addCase(fetchCart.fulfilled, (state, action) => { state.status = 'idle'; applyRemote(state, action.payload); })
    .addCase(fetchCart.rejected, (state, action) => { state.status = 'idle'; state.error = action.payload; })
    .addMatcher((action) => [addRemoteItem.fulfilled.type, updateRemoteQuantity.fulfilled.type, removeRemoteItem.fulfilled.type, clearRemoteCart.fulfilled.type].includes(action.type), (state, action) => { applyRemote(state, action.payload); })
    .addMatcher((action) => [addRemoteItem.rejected.type, updateRemoteQuantity.rejected.type, removeRemoteItem.rejected.type, clearRemoteCart.rejected.type].includes(action.type), (state, action) => { state.error = action.payload; }),
});

export const { addItem, updateQuantity, removeItem, clearCart } = cartSlice.actions;
export const selectCartCount = (state) => state.cart.items.reduce((sum, item) => sum + item.quantity, 0);
export const selectCartTotal = (state) => state.cart.items.reduce((sum, item) => sum + (item.discountPrice ?? item.price) * item.quantity, 0);
export default cartSlice.reducer;
