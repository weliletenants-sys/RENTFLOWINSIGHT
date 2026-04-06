import axios from 'axios';
import { v7 as uuidv7 } from 'uuid';

const API = '/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('access_token') || localStorage.getItem('token');
  return {
    headers: {
      Authorization: token ? `Bearer ${token}` : '',
      'Content-Type': 'application/json',
      'Idempotency-Key': uuidv7(),
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
  verifiedPersonas?: string[];
  walletBuckets?: { type: string, balance: number }[];
  nextOfKinName?: string | null;
  nextOfKinPhone?: string | null;
}

export const getFunderDashboardStats = async (): Promise<DashboardStatsResponse> => {
  const response = await axios.get(`${API}/funder/statistics/dashboard`, getAuthHeaders());
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

export const disableFunder2FA = async () => {
  const response = await axios.post(`${API}/auth/security/2fa/disable`, {}, getAuthHeaders());
  return response.data;
};

export const getSessions = async () => {
  const response = await axios.get(`${API}/auth/security/sessions`, getAuthHeaders());
  return response.data;
};

export const revokeSession = async (id: string) => {
  const response = await axios.delete(`${API}/auth/security/sessions/${id}`, getAuthHeaders());
  return response.data;
};

export const revokeAllOtherSessions = async () => {
  const response = await axios.delete(`${API}/auth/security/sessions`, getAuthHeaders());
  return response.data;
};

export type PayoutMethodView = {
  id: string;
  provider: string;
  account_name: string;
  account_number: string;
  is_primary: boolean;
  created_at: string;
};

export const getPayoutMethods = async () => {
  const response = await axios.get(`${API}/funder/payout-methods`, getAuthHeaders());
  return response.data;
};

export const addPayoutMethod = async (data: { provider: string; account_name: string; account_number: string; is_primary: boolean }) => {
  const response = await axios.post(`${API}/funder/payout-methods`, data, getAuthHeaders());
  return response.data;
};

export const setPrimaryPayoutMethod = async (id: string) => {
  const response = await axios.put(`${API}/funder/payout-methods/${id}/primary`, {}, getAuthHeaders());
  return response.data;
};

export const deletePayoutMethod = async (id: string) => {
  const response = await axios.delete(`${API}/funder/payout-methods/${id}`, getAuthHeaders());
  return response.data;
};

// --- ESCROW & PORTFOLIOS ---

export const getRewardMode = async () => {
  const response = await axios.get(`${API}/funder/financial/reward-mode`, getAuthHeaders());
  return response.data;
};

export const updateRewardMode = async (mode: 'compound' | 'payout') => {
  const response = await axios.put(`${API}/funder/financial/reward-mode`, { mode }, getAuthHeaders());
  return response.data;
};

export const getWalletOperations = async () => {
  const response = await axios.get(`${API}/funder/financial/wallet-operations`, getAuthHeaders());
  return response.data;
};

export const requestWalletWithdrawal = async (amount: number) => {
  const response = await axios.post(`${API}/funder/financial/wallet-withdraw`, { amount }, getAuthHeaders());
  return response.data;
};

export const requestDeposit = async (payload: { amount: number, provider: string, external_tx_id: string }) => {
  const response = await axios.post(`${API}/funder/financial/wallet-deposit`, payload, getAuthHeaders());
  return response.data;
};

export const transferFunds = async (payload: { type: 'internal' | 'p2p', amount: number, sourceBucket?: string, targetIdentifier?: string }) => {
  const response = await axios.post(`${API}/funder/financial/transfer`, payload, getAuthHeaders());
  return response.data;
};

export const getPortfolios = async () => {
  const response = await axios.get(`${API}/funder/financial/portfolios`, getAuthHeaders());
  return response.data;
};

// --- PROXY MANDATES ---

export const getProxyMandates = async () => {
  const response = await axios.get(`${API}/funder/proxy/mandates`, getAuthHeaders());
  return response.data;
};

export const createProxyMandate = async (data: { agent_code: string; daily_limit: number }) => {
  const response = await axios.post(`${API}/funder/proxy/mandates`, data, getAuthHeaders());
  return response.data;
};

export const updateProxyLimit = async (id: string, daily_limit: number) => {
  const response = await axios.put(`${API}/funder/proxy/mandates/${id}/limit`, { daily_limit }, getAuthHeaders());
  return response.data;
};

export const revokeProxyMandate = async (id: string) => {
  const response = await axios.put(`${API}/funder/proxy/mandates/${id}/revoke`, {}, getAuthHeaders());
  return response.data;
};

export const restoreProxyMandate = async (id: string) => {
  const response = await axios.put(`${API}/funder/proxy/mandates/${id}/restore`, {}, getAuthHeaders());
  return response.data;
};

export const getFunderPortfolios = async () => {
  const response = await axios.get(`${API}/funder/portfolios`, getAuthHeaders());
  return response.data.data;
};

export const getFunderPortfolioDetails = async (code: string) => {
  const response = await axios.get(`${API}/funder/portfolios/${code}`, getAuthHeaders());
  return response.data.data;
};

export const fundRentPool = async (payload: { amount: number; roi_mode: string; duration_months: number; auto_renew: boolean; account_name?: string }) => {
  const response = await axios.post(`${API}/funder/fund`, payload, getAuthHeaders());
  return response.data;
};

export const requestWithdrawal = async (portfolio_id: string, amount: number) => {
  const response = await axios.post(`${API}/funder/withdrawals`, { portfolio_id, amount }, getAuthHeaders());
  return response.data;
};

export const getFunderActivities = async () => {
  const response = await axios.get(`${API}/funder/activities`, getAuthHeaders());
  return response.data.data;
};

export const getFunderOpportunities = async () => {
  const response = await axios.get(`${API}/funder/opportunities`, getAuthHeaders());
  return response.data.data;
};

export const topupFunderPortfolio = async (portfolio_code: string, amount: number) => {
  const response = await axios.put(`${API}/funder/portfolios/${portfolio_code}/topup`, { amount }, getAuthHeaders());
  return response.data;
};

export const getFunderReportsStatsRaw = async (year?: string | number) => {
  const url = year ? `${API}/funder/reports/stats?year=${year}` : `${API}/funder/reports/stats`;
  const response = await axios.get(url, getAuthHeaders());
  return response.data.data;
};

export const updatePortfolioDetails = async (code: string, data: { account_name?: string, roi_mode?: string }) => {
  const response = await axios.patch(`${API}/funder/portfolios/${code}`, data, getAuthHeaders());
  return response.data;
};

export const getFunderReferralStats = async () => {
  const response = await axios.get(`${API}/funder/referrals/stats`, getAuthHeaders());
  return response.data.data;
};

export const getFunderROILeaderboard = async () => {
  const response = await axios.get(`${API}/funder/referrals/leaderboard`, getAuthHeaders());
  return response.data.data;
};
