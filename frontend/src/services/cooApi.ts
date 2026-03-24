import axios from 'axios';

const API = '/api'; // Proxied to localhost:3000 by vite

// Attach headers correctly based on localStorage auth mechanisms
const getAuthHeaders = () => {
  const token = localStorage.getItem('access_token') || localStorage.getItem('token');
  return {
    headers: {
      Authorization: token ? `Bearer ${token}` : '',
      'Content-Type': 'application/json',
    },
  };
};

// Global Problem Details RFC 7807 Interface
export interface ProblemDetails {
  type: string;
  title: string;
  status: number;
  detail: string;
  instance?: string;
}

export interface COOOverviewMetrics {
  totalInvestors: number;
  totalInvestments: number;
  dailyCollections: number;
  activeAgents: number;
  activeAccounts: number;
  todaysVisits: number;
  missedPaymentsCount: number;
  pendingWithdrawalsAmount: number;
  pendingWithdrawalsCount: number;
  walletMonitoring: {
    mainFloat: number;
    agentEscrow: number;
  };
}

export const fetchOverviewMetrics = async (): Promise<COOOverviewMetrics> => {
  try {
    const response = await axios.get<COOOverviewMetrics>(`${API}/v1/coo/metrics/overview`, getAuthHeaders());
    return response.data;
  } catch (error: any) {
    if (error.response?.data?.type) {
      const problem = error.response.data as ProblemDetails;
      throw new Error(`[${problem.title}]: ${problem.detail}`);
    }
    throw new Error(error.response?.data?.message || 'Failed to fetch COO overview metrics');
  }
};

export const fetchTransactions = async () => {
  const response = await axios.get(`${API}/v1/coo/metrics/transactions`, getAuthHeaders());
  return response.data;
};

export const fetchCollections = async () => {
  const response = await axios.get(`${API}/v1/coo/metrics/collections`, getAuthHeaders());
  return response.data;
};

export const fetchWallets = async () => {
  const response = await axios.get(`${API}/v1/coo/metrics/wallets`, getAuthHeaders());
  return response.data;
};

export const fetchWithdrawals = async () => {
  const response = await axios.get(`${API}/v1/coo/metrics/withdrawals`, getAuthHeaders());
  return response.data;
};

export const fetchAnalytics = async () => {
  const response = await axios.get(`${API}/v1/coo/metrics/analytics`, getAuthHeaders());
  return response.data;
};

export const fetchPartners = async () => {
  const response = await axios.get(`${API}/v1/coo/metrics/partners`, getAuthHeaders());
  return response.data;
};

export const fetchTenants = async () => {
  const response = await axios.get(`${API}/v1/coo/metrics/tenants`, getAuthHeaders());
  return response.data;
};

export const fetchAlerts = async () => {
  const response = await axios.get(`${API}/v1/coo/metrics/alerts`, getAuthHeaders());
  return response.data;
};

export const fetchStaff = async () => {
  const response = await axios.get(`${API}/v1/coo/metrics/staff`, getAuthHeaders());
  return response.data;
};

export const fetchOpportunities = async () => {
  const response = await axios.get(`${API}/v1/coo/opportunities`, getAuthHeaders());
  return response.data;
};

export const getGlobalUsers = async () => {
  try {
    const response = await axios.get(`${API}/v1/coo/users`, getAuthHeaders());
    return response.data.data.users;
  } catch (error: any) {
    if (error.response?.data?.type) {
      const problem = error.response.data as ProblemDetails;
      throw new Error(`[${problem.title}]: ${problem.detail}`);
    }
    throw new Error(error.response?.data?.message || 'Failed to fetch global users list');
  }
};

export const createOpportunity = async (data: any) => {
  const response = await axios.post(`${API}/v1/coo/opportunities`, data, getAuthHeaders());
  return response.data;
};
