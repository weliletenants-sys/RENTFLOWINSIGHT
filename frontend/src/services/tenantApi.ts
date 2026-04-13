import { apiClient } from './apiClient';


const API = (import.meta.env.VITE_API_URL || 'http://localhost:3000') + '/api';

export 


export const getTenantRentProgress = async () => {
  const { data } = await apiClient.get('/tenant/rent-progress');
  return data;
};

export const getTenantActivities = async () => {
  const { data } = await apiClient.get('/tenant/activities');
  return data;
};

export const getTenantWallet = async () => {
  const { data } = await apiClient.get('/wallets/my-wallet');
  return data;
};

export const getAiIdProfile = async () => {
  const { data } = await apiClient.get('/personas/ai-id/me');
  return data;
};

export const getTenantAgreementStatus = async () => {
  const { data } = await apiClient.get('/tenant/agreement-status');
  return data;
};

export const acceptTenantAgreement = async (payload: { version?: string; ipAddress?: string; deviceInfo?: string } = {}) => {
  const { data } = await apiClient.post('/tenant/accept-agreement', payload);
  return data;
};

// ==========================================
// V2 DDD MODULE ENDPOINTS 
// ==========================================
export const payRent = async (payload: { amount: number; paymentMethodToken?: string }) => {
  // Hardcoded strictly to V2 to forcibly route through the new Double-Entry logic bounds
  const { data } = await apiClient.post('/tenants/rent/pay', payload);
  return data;
};
