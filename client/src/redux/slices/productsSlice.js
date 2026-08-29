import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getProducts } from '../../services/productService';

export const fetchProducts = createAsyncThunk('products/fetch', getProducts);

const productsSlice = createSlice({
  name: 'products',
  initialState: { items: [], pagination: null, status: 'idle', error: null },
  extraReducers: (builder) => builder
    .addCase(fetchProducts.pending, (state) => { state.status = 'loading'; state.error = null; })
    .addCase(fetchProducts.fulfilled, (state, action) => { state.status = 'succeeded'; state.items = action.payload.data; state.pagination = action.payload.pagination; })
    .addCase(fetchProducts.rejected, (state, action) => { state.status = 'failed'; state.error = action.error.message; }),
});

export default productsSlice.reducer;
