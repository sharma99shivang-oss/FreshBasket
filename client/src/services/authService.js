import api, { setAccessToken } from './api';

const session = (response) => {
  const data = response.data.data;
  if (data.accessToken) setAccessToken(data.accessToken);
  return data;
};

export const register = (payload) => api.post('/auth/register', payload).then(session);
export const login = (payload) => api.post('/auth/login', payload).then(session);
export const restoreSession = () => api.post('/auth/refresh').then(session);
export const logout = () => api.post('/auth/logout').finally(() => setAccessToken(null));
export const requestPasswordReset = (email) => api.post('/auth/forgot-password', { email }).then((response) => response.data.data);
export const resetPassword = ({ token, password, confirmPassword }) => api.post(`/auth/reset-password/${token}`, { password, confirmPassword }).then(session);
