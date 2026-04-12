import axios, { AxiosError } from 'axios';

const API = (import.meta.env.VITE_API_URL || 'http://localhost:3000') + '/api';

export const tenantClient = axios.create({
  baseURL: API,
});

tenantClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token') || localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

tenantClient.interceptors.response.use(
  (response) => response,
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

export const getTenantRentProgress = async () => {
  const { data } = await tenantClient.get('/tenant/rent-progress');
  return data;
};

export const getTenantActivities = async () => {
  const { data } = await tenantClient.get('/tenant/activities');
  return data;
};

export const getTenantWallet = async () => {
  const { data } = await tenantClient.get('/wallets/my-wallet');
  return data;
};

export const getAiIdProfile = async () => {
  const { data } = await tenantClient.get('/v1/personas/ai-id/me');
  return data;
};

export const getTenantAgreementStatus = async () => {
  const { data } = await tenantClient.get('/tenant/agreement-status');
  return data;
};

export const acceptTenantAgreement = async (payload: { version?: string; ipAddress?: string; deviceInfo?: string } = {}) => {
  const { data } = await tenantClient.post('/tenant/accept-agreement', payload);
  return data;
};

// ==========================================
// V2 DDD MODULE ENDPOINTS 
// ==========================================
export const payRent = async (payload: { amount: number; paymentMethodToken?: string }) => {
  // Hardcoded strictly to V2 to forcibly route through the new Double-Entry logic bounds
  const { data } = await tenantClient.post('/v2/tenants/rent/pay', payload);
  return data;
};
