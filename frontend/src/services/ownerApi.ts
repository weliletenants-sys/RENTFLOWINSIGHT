import axios, { AxiosError } from 'axios';

const API = (import.meta.env.VITE_API_URL || 'http://localhost:3000') + '/api';

export const ownerClient = axios.create({
  baseURL: API,
});

ownerClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token') || localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

ownerClient.interceptors.response.use(
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

// Overview
export const getOwnerOverview = async () => {
  const { data } = await ownerClient.get('/owner/overview');
  return data;
};

// Properties
export const getOwnerProperties = async () => {
  const { data } = await ownerClient.get('/owner/properties');
  return data;
};

export const registerOwnerProperty = async (payload: { address: string; units: number }) => {
  const { data } = await ownerClient.post('/owner/properties', payload);
  return data;
};

// Tenants
export const getOwnerTenants = async () => {
  const { data } = await ownerClient.get('/owner/tenants');
  return data;
};

export const inviteOwnerTenant = async (payload: { phone: string; propertyId: string; unit: string }) => {
  const { data } = await ownerClient.post('/owner/tenants/invite', payload);
  return data;
};

export const enrollWelileHomes = async (payload: { tenantId: string }) => {
  const { data } = await ownerClient.post('/owner/tenants/welile-homes/enroll', payload);
  return data;
};

// Finances
export const getOwnerHistory = async () => {
  const { data } = await ownerClient.get('/owner/finance/history');
  return data;
};
