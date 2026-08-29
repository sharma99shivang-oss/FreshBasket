import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import * as wishlistService from '../../services/wishlistService';

const message = (error) => error.response?.data?.message || 'Unable to update your wishlist';
export const fetchWishlist = createAsyncThunk('wishlist/fetch', async (_, { rejectWithValue }) => { try { return await wishlistService.getWishlist(); } catch (error) { return rejectWithValue(message(error)); } });
export const addWishlist = createAsyncThunk('wishlist/add', async (productId, { rejectWithValue }) => { try { return await wishlistService.addWishlistItem(productId); } catch (error) { return rejectWithValue(message(error)); } });
export const removeWishlist = createAsyncThunk('wishlist/remove', async (productId, { rejectWithValue }) => { try { return await wishlistService.removeWishlistItem(productId); } catch (error) { return rejectWithValue(message(error)); } });

const wishlistSlice = createSlice({ name: 'wishlist', initialState: { items: [], status: 'idle', error: null }, reducers: { clearWishlist: (state) => { state.items = []; } }, extraReducers: (builder) => builder.addCase(fetchWishlist.pending, (state) => { state.status = 'loading'; }).addCase(fetchWishlist.fulfilled, (state, action) => { state.status = 'idle'; state.items = action.payload; }).addCase(fetchWishlist.rejected, (state, action) => { state.status = 'idle'; state.error = action.payload; }).addMatcher((action) => [addWishlist.fulfilled.type, removeWishlist.fulfilled.type].includes(action.type), (state, action) => { state.items = action.payload; }).addMatcher((action) => [addWishlist.rejected.type, removeWishlist.rejected.type].includes(action.type), (state, action) => { state.error = action.payload; }) });
export const { clearWishlist } = wishlistSlice.actions;
export const selectWishlistIds = (state) => new Set(state.wishlist.items.map((item) => item._id));
export default wishlistSlice.reducer;
