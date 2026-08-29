import axios from 'axios';

const api = axios.create({
  // Vite proxies this path during local development, avoiding cross-origin cookies and CORS.
  baseURL: import.meta.env.VITE_API_URL || '/api',
  timeout: 10_000,
  withCredentials: true,
});

let accessToken = null;
let refreshPromise = null;

export const setAccessToken = (token) => { accessToken = token; };

api.interceptors.request.use((config) => {
  if (accessToken) config.headers.Authorization = `Bearer ${accessToken}`;
  return config;
});

api.interceptors.response.use(undefined, async (error) => {
  const original = error.config;
  if (error.response?.status !== 401 || original?._retry || original?.url?.includes('/auth/refresh')) return Promise.reject(error);
  original._retry = true;
  try {
    refreshPromise ??= api.post('/auth/refresh').then((response) => response.data.data.accessToken).finally(() => { refreshPromise = null; });
    accessToken = await refreshPromise;
    original.headers.Authorization = `Bearer ${accessToken}`;
    return api(original);
  } catch (refreshError) {
    accessToken = null;
    return Promise.reject(refreshError);
  }
});

export default api;
