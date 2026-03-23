import axios from 'axios';

const API = '/api';

const getAuthHeaders = () => {
<<<<<<< HEAD
  const token = localStorage.getItem('access_token') || localStorage.getItem('token');
=======
  const token = localStorage.getItem('access_token');
>>>>>>> efb2962c76c54fc5bbc6b5913845d1c851fb5c3e
  return {
    headers: {
      Authorization: token ? `Bearer ${token}` : '',
      'Content-Type': 'application/json',
    },
  };
};

export interface DashboardStatsResponse {
  totalBalance: number;
  availableLiquid: number;
  totalInvested: number;
  expectedYield: number;
  activePortfolios: number;
  pendingPortfolios: number;
  virtualHouses: number;
}

export const getFunderDashboardStats = async (): Promise<DashboardStatsResponse> => {
  const response = await axios.get(`${API}/funder/statistics/dashboard`, getAuthHeaders());
  return response.data.data;
};

export const fundRentPool = async (amount: number) => {
  const response = await axios.post(`${API}/funder/fund`, { amount }, getAuthHeaders());
  return response.data;
};

export const requestWithdrawal = async (portfolio_id: string, amount: number) => {
  const response = await axios.post(`${API}/funder/withdrawals`, { portfolio_id, amount }, getAuthHeaders());
  return response.data;
};

export const getFunderPortfolios = async () => {
  const response = await axios.get(`${API}/funder/portfolios`, getAuthHeaders());
  return response.data.data;
};

export const getFunderActivities = async () => {
  const response = await axios.get(`${API}/funder/activities`, getAuthHeaders());
  return response.data.data;
};

export const getFunderOpportunities = async () => {
  const response = await axios.get(`${API}/funder/opportunities`, getAuthHeaders());
  return response.data.data;
};

export const updateFunderProfile = async (firstName: string, lastName: string, email: string, phone: string) => {
  const response = await axios.put(`${API}/funder/kyc/profile`, { firstName, lastName, email, phone }, getAuthHeaders());
  return response.data;
};

export const uploadFunderAvatar = async (formData: FormData) => {
  // Overriding content-type for multipart boundaries
  const token = localStorage.getItem('access_token');
  const response = await axios.post(`${API}/funder/kyc/avatar`, formData, {
    headers: {
      Authorization: token ? `Bearer ${token}` : '',
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

// --- SECURITY & 2FA ---
export const changeFunderPassword = async (currentPassword: string, newPassword: string) => {
  const response = await axios.put(`${API}/auth/security/password`, { currentPassword, newPassword }, getAuthHeaders());
  return response.data;
};

export const enableFunder2FA = async () => {
  const response = await axios.post(`${API}/auth/security/2fa/enable`, {}, getAuthHeaders());
  return response.data;
};

export const verifyFunder2FA = async (otp: string) => {
  const response = await axios.post(`${API}/auth/security/2fa/verify`, { otp }, getAuthHeaders());
  return response.data;
};
