import axios, { AxiosError } from 'axios';

const API = (import.meta.env.VITE_API_URL || (import.meta.env.VITE_API_URL || 'http://localhost:3000')) + '/api';

// Create a configured axios instance for Agent calls
const agentClient = axios.create({
  baseURL: API,
});

// Request interceptor to attach JWT
agentClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor to handle RFC 7807 problem details securely
agentClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    // Check if the backend returned an RFC 7807 problem json
    if (error.response?.data && typeof error.response.data === 'object' && 'title' in error.response.data) {
      const problem = error.response.data as { type: string; title: string; status: number; detail: string };
      // Throw the standard problem object so components can handle it easily
      return Promise.reject({
        isProblemDetail: true,
        title: problem.title,
        detail: problem.detail,
        status: problem.status,
        type: problem.type
      });
    }
    // Fallback for network errors or non-RFC errors
    return Promise.reject({
      isProblemDetail: false,
      detail: error.message || 'An unexpected error occurred. Please check your connection.'
    });
  }
);

/* -------------------------------------------------------------------------- */
/*                            DASHBOARD & ANALYTICS                           */
/* -------------------------------------------------------------------------- */
export const getDashboardSummary = async () => {
  const { data } = await agentClient.get('/agent/statistics/dashboard');
  return data;
};

export const getEarnings = async () => {
  const { data } = await agentClient.get('/agent/earnings');
  return data;
};

export const getReferrals = async () => {
  const { data } = await agentClient.get('/agent/referrals');
  return data;
};

export const getAgentLeaderboard = async () => {
  const { data } = await agentClient.get('/agent/leaderboard');
  return data;
};

/* -------------------------------------------------------------------------- */
/*                               FIELD OPERATIONS                             */
/* -------------------------------------------------------------------------- */
export const recordVisit = async (payload: { tenant_id?: string; location_name: string; latitude: number; longitude: number; accuracy?: number }) => {
  const { data } = await agentClient.post('/agent/visits', payload);
  return data;
};

export const recordCollection = async (payload: { amount: number; payment_method: string; notes?: string; tenant_id?: string }) => {
  const { data } = await agentClient.post('/agent/collections', payload);
  return data;
};

export const issueReceipt = async (payload: { amount: number; payer_name: string; payer_phone: string; payment_method: string }) => {
  const { data } = await agentClient.post('/agent/receipts', payload);
  return data;
};

export const generatePaymentToken = async (payload: { amount: number; tenant_id?: string }) => {
  const { data } = await agentClient.post('/agent/tokens', payload);
  return data;
};

export const uploadDeliveryConfirmation = async (payload: { receipt_url: string; collection_id?: string }) => {
  const { data } = await agentClient.post('/agent/deliveries', payload);
  return data;
};

/* -------------------------------------------------------------------------- */
/*                                RENT REQUESTS                               */
/* -------------------------------------------------------------------------- */
export const fetchRentRequests = async () => {
  const { data } = await agentClient.get('/agent/rent-requests');
  return data;
};

export const createRentRequest = async (payload: { tenant_name: string; amount: number; duration_days: number; tenant_id?: string; phone?: string }) => {
  const { data } = await agentClient.post('/agent/rent-requests', payload);
  return data;
};

export const processRentRequest = async (id: string) => {
  const { data } = await agentClient.patch(`/agent/rent-requests/${id}/status`);
  return data;
};

/* -------------------------------------------------------------------------- */
/*                               CORE FINANCIALS                              */
/* -------------------------------------------------------------------------- */
export const getAdvances = async () => {
  const { data } = await agentClient.get('/agent/advances');
  return data;
};

export const requestAdvance = async (payload: { amount: number; reason: string; duration_days?: number }) => {
  const { data } = await agentClient.post('/agent/advances', payload);
  return data;
};

export const getTransactions = async () => {
  const { data } = await agentClient.get('/agent/transactions');
  return data;
};

export const getWalletBalance = async () => {
  // Global wallet endpoint but handled securely with agent auth context
  const { data } = await agentClient.get('/wallets/my-wallet');
  return data;
};

export const requestWithdrawal = async (payload: { amount: number; method: string; recipient_number: string; provider?: string; reference?: string }) => {
  const { data } = await agentClient.post('/agent/withdrawals', payload);
  return data;
};

export const requestDeposit = async (payload: { amount: number; method: string; reference?: string }) => {
  const { data } = await agentClient.post('/agent/deposits', payload);
  return data;
};

export const requestTransfer = async (payload: { amount: number; recipientId: string }) => {
  // Global transfer endpoint but mapped through proxy/agent context
  const { data } = await agentClient.post('/wallets/transfers', payload);
  return data;
};

// USER REGISTRATIONS
export const registerTenant = async (payload: any) => {
  const { data } = await agentClient.post('/agent/tenants', payload);
  return data;
};

export const getAssignedTenants = async () => {
  const { data } = await agentClient.get('/agent/tenants');
  return data.tenants; // Returns the exactly mapped array
};

export const getMyNetwork = async () => {
  const { data } = await agentClient.get('/agent/networks');
  return data.network; 
};

export const registerLandlord = async (payload: any) => {
  const { data } = await agentClient.post('/agent/landlords', payload);
  return data;
};

export const registerSubAgent = async (payload: any) => {
  const { data } = await agentClient.post('/agent/subagents', payload);
  return data;
};

export const registerInvestor = async (payload: any) => {
  const { data } = await agentClient.post('/agent/investors', payload);
  return data;
};

// KYC & Identity
export const submitKyc = async (payload: any) => {
  const { data } = await agentClient.post('/agent/kyc', payload);
  return data;
};
