import { apiClient } from './apiClient';


const executiveApi = axios.create({
  baseURL: (import.meta.env.VITE_API_URL || (import.meta.env.VITE_API_URL || 'http://localhost:3000')) + '/api/admin/executive',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to attach the auth token automatically
executiveApi.interceptors.request.use((config) => {
  const token = sessionStorage.getItem('access_token') || localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default executiveApi;
