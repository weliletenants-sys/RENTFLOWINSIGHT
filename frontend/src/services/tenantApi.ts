import axios from 'axios';

const API = '/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('access_token') || localStorage.getItem('token');
  return {
    headers: {
      Authorization: token ? `Bearer ${token}` : '',
      'Content-Type': 'application/json',
    },
  };
};

export const getTenantRentProgress = async () => {
  const response = await axios.get(`${API}/tenant/rent-progress`, getAuthHeaders());
  return response.data;
};

export const getTenantActivities = async () => {
  const response = await axios.get(`${API}/tenant/activities`, getAuthHeaders());
  return response.data;
};

export const getTenantWallet = async () => {
  // Utilizing the global wallet sub-system
  const response = await axios.get(`${API}/wallets/my-wallet`, getAuthHeaders());
  return response.data;
};

export const getAiIdProfile = async () => {
  const response = await axios.get(`${API}/v1/personas/ai-id/me`, getAuthHeaders());
  return response.data;
};

export const getTenantAgreementStatus = async () => {
  const response = await axios.get(`${API}/tenant/agreement-status`, getAuthHeaders());
  return response.data;
};

export const acceptTenantAgreement = async (payload: { version?: string; ipAddress?: string; deviceInfo?: string } = {}) => {
  const response = await axios.post(`${API}/tenant/accept-agreement`, payload, getAuthHeaders());
  return response.data;
};
