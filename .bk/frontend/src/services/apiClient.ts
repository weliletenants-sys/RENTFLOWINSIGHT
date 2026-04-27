import axios, { AxiosError } from 'axios';

// The singleton API client ensuring global headers, standard interceptors, and consistent routing structure natively
export const apiClient = axios.create({
  baseURL: (import.meta.env.VITE_API_URL || '') + '/api/v2',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to eagerly attach JWT from multiple exact stores
apiClient.interceptors.request.use((config) => {
  const token = sessionStorage.getItem('access_token') || localStorage.getItem('access_token') || localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor rigidly extracting RFC 7807 problem details or underlying standardized errors natively
apiClient.interceptors.response.use(
  (response) => {
    // Attempt standard DDD extraction unwrapping if explicitly defined
    return response;
  },
  (error: AxiosError) => {
    if (error.response?.data && typeof error.response.data === 'object' && 'title' in error.response.data) {
      const problem = error.response.data as { type: string; title: string; status: number; detail: string };
      return Promise.reject({
        isProblemDetail: true,
        title: problem.title,
        detail: problem.detail,
        status: problem.status,
        type: problem.type
      });
    }
    return Promise.reject({
      isProblemDetail: false,
      detail: error.message || 'An unexpected error occurred. Please check your connection.'
    });
  }
);

