import axios from 'axios';

const executiveApi = axios.create({
  baseURL: 'http://localhost:3000/api/executive',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to attach the auth token automatically
executiveApi.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default executiveApi;
