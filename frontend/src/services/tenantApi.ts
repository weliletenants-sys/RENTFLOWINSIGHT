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
