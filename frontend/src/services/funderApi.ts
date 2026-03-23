import axios from 'axios';

const API = '/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
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
