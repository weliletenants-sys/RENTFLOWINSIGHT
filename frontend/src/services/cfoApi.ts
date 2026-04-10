import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
});

// Attach JWT token to requests if available
api.interceptors.request.use((config) => {
  const token = sessionStorage.getItem('access_token') || localStorage.getItem('access_token') || localStorage.getItem('executive_token') || localStorage.getItem('token');
  if (token && token !== 'undefined' && token !== 'null') {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      sessionStorage.removeItem('access_token');
      sessionStorage.removeItem('user_data');
      if (typeof window !== 'undefined') {
        if (!window.location.pathname.includes('/login')) {
          window.location.replace('/admin/login');
        }
      }
    }
    return Promise.reject(error);
  }
);

// Overview & Analytics
export const getCfoOverview = async () => {
  const response = await api.get('/admin/cfo/statistics/overview');
  return response.data;
};

export const getCfoRoiDashboard = async () => {
  const response = await api.get('/admin/cfo/analytics/roi');
  return response.data;
};

export const getCfoPredictiveRunway = async () => {
  const response = await api.get('/admin/cfo/analytics/runway');
  return response.data;
};

// Reconciliation & Ledger
export const getCfoReconciliations = async () => {
  const response = await api.get('/admin/cfo/reconciliations');
  return response.data;
};

export const getCfoLedger = async (filters: { startDate?: string; endDate?: string; category?: string } = {}) => {
  const response = await api.get('/admin/cfo/ledger', { params: filters });
  return response.data;
};

export const getCfoStatements = async () => {
  const response = await api.get('/admin/cfo/statements');
  return response.data;
};

// Approvals & Governance (Withdrawals)
export const getPendingWithdrawals = async () => {
  const response = await api.get('/admin/cfo/withdrawals/pending');
  return response.data;
};

export const approveWithdrawalRequest = async (id: string, reason?: string) => {
  const response = await api.post(`/admin/cfo/withdrawals/${id}/approvals`, { reason });
  return response.data;
};

export const rejectWithdrawalRequest = async (id: string, reason: string) => {
  const response = await api.post(`/admin/cfo/withdrawals/${id}/rejections`, { reason });
  return response.data;
};

// Approvals & Governance (Commissions)
export const getPendingCommissions = async () => {
  const response = await api.get('/admin/cfo/commissions/pending');
  return response.data;
};

export const approveCommissionPayout = async (id: string) => {
  const response = await api.post(`/admin/cfo/commissions/${id}/approve`);
  return response.data;
};

export const rejectCommissionPayout = async (id: string, reason: string) => {
  const response = await api.post(`/admin/cfo/commissions/${id}/reject`, { reason });
  return response.data;
};
