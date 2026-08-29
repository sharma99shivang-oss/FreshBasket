import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import * as authService from '../../services/authService';

const message = (error) => error.response?.data?.message || 'Something went wrong. Please try again.';
export const restoreAuth = createAsyncThunk('auth/restore', async (_, { rejectWithValue }) => { try { return await authService.restoreSession(); } catch (error) { return rejectWithValue(message(error)); } });
export const loginUser = createAsyncThunk('auth/login', async (payload, { rejectWithValue }) => { try { return await authService.login(payload); } catch (error) { return rejectWithValue(message(error)); } });
export const registerUser = createAsyncThunk('auth/register', async (payload, { rejectWithValue }) => { try { return await authService.register(payload); } catch (error) { return rejectWithValue(message(error)); } });
export const resetUserPassword = createAsyncThunk('auth/resetPassword', async (payload, { rejectWithValue }) => { try { return await authService.resetPassword(payload); } catch (error) { return rejectWithValue(message(error)); } });
export const logoutUser = createAsyncThunk('auth/logout', async (_, { rejectWithValue }) => { try { await authService.logout(); } catch (error) { return rejectWithValue(message(error)); } });

const authSlice = createSlice({
  name: 'auth',
  initialState: { user: null, accessToken: null, status: 'idle', initialized: false, error: null },
  reducers: { clearAuthError: (state) => { state.error = null; } },
  extraReducers: (builder) => builder
    .addCase(restoreAuth.pending, (state) => { state.status = 'loading'; })
    .addCase(restoreAuth.fulfilled, (state, action) => { state.status = 'idle'; state.initialized = true; state.user = action.payload.user; state.accessToken = action.payload.accessToken; })
    .addCase(restoreAuth.rejected, (state) => { state.status = 'idle'; state.initialized = true; })
    .addMatcher((action) => [loginUser.fulfilled.type, registerUser.fulfilled.type, resetUserPassword.fulfilled.type].includes(action.type), (state, action) => { state.status = 'idle'; state.user = action.payload.user; state.accessToken = action.payload.accessToken; state.error = null; })
    .addMatcher((action) => [loginUser.pending.type, registerUser.pending.type, resetUserPassword.pending.type].includes(action.type), (state) => { state.status = 'loading'; state.error = null; })
    .addMatcher((action) => [loginUser.rejected.type, registerUser.rejected.type, resetUserPassword.rejected.type].includes(action.type), (state, action) => { state.status = 'idle'; state.error = action.payload; })
    .addMatcher((action) => [logoutUser.fulfilled.type, logoutUser.rejected.type].includes(action.type), (state) => { Object.assign(state, { user: null, accessToken: null, status: 'idle', error: null, initialized: true }); }),
});

export const { clearAuthError } = authSlice.actions;
export default authSlice.reducer;
