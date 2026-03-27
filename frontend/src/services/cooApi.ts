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
  pendingAccounts: number;
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

export interface GetUsersParams {
  pageParam: string | null;
  search: string;
  role: string;
  status: string;
}

export const getGlobalUsers = async ({ pageParam, search, role, status }: GetUsersParams) => {
  try {
    const params = new URLSearchParams();
    if (pageParam) params.append('cursor', pageParam);
    if (search) params.append('search', search);
    if (role && role !== 'ALL') params.append('role', role);
    if (status && status !== 'ALL') params.append('status', status);
    
    const response = await axios.get(`${API}/v1/coo/users?${params.toString()}`, getAuthHeaders());
    return {
      users: response.data.data.users,
      nextCursor: response.data.pagination.next_cursor as string | null,
      hasMore: response.data.pagination.has_more as boolean
    };
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

export const deleteGlobalUsers = async (userIds: string[]) => {
  try {
    const response = await axios.delete(`${API}/v1/coo/users`, {
      ...getAuthHeaders(),
      data: { userIds }
    });
    return response.data;
  } catch (error: any) {
    if (error.response?.data?.type) {
      const problem = error.response.data as ProblemDetails;
      throw new Error(`[${problem.title}]: ${problem.detail}`);
    }
    throw new Error(error.response?.data?.message || 'Failed to bulk delete users');
  }
};

export const getGlobalUserProfile = async (id: string) => {
  try {
    const response = await axios.get(`${API}/v1/coo/users/${id}`, getAuthHeaders());
    return response.data.data.user;
  } catch (error: any) {
    if (error.response?.data?.type) {
      const problem = error.response.data as ProblemDetails;
      throw new Error(`[${problem.title}]: ${problem.detail}`);
    }
    throw new Error(error.response?.data?.message || 'Failed to retrieve user profile');
  }
};

export const updateGlobalUserProfile = async (id: string, updates: any) => {
  try {
    const response = await axios.patch(`${API}/v1/coo/users/${id}`, updates, getAuthHeaders());
    return response.data.data.user;
  } catch (error: any) {
    if (error.response?.data?.type) {
      const problem = error.response.data as ProblemDetails;
      throw new Error(`[${problem.title}]: ${problem.detail}`);
    }
    throw new Error(error.response?.data?.message || 'Failed to update user profile');
  }
};

// --- Deposit Review Workflow ---

export const getPendingDeposits = async () => {
  try {
    const response = await axios.get(`${API}/v1/coo/deposits/pending`, getAuthHeaders());
    return response.data.deposits;
  } catch (error: any) {
    if (error.response?.data?.type) {
      const problem = error.response.data as ProblemDetails;
      throw new Error(`[${problem.title}]: ${problem.detail}`);
    }
    throw new Error(error.response?.data?.message || 'Failed to fetch pending deposits');
  }
};

export const freezePartnerAccount = async (id: string, is_frozen: boolean) => {
  // reusing the existing update endpoint
  return updateGlobalUserProfile(id, { is_frozen });
};

export const fundPartnerWallet = async (id: string, data: any) => {
  try {
    const response = await axios.post(`${API}/v1/coo/partners/${id}/fund`, data, getAuthHeaders());
    return response.data;
  } catch (error: any) {
    if (error.response?.data?.type) {
      const problem = error.response.data as ProblemDetails;
      throw new Error(`[${problem.title}]: ${problem.detail}`);
    }
    throw new Error(error.response?.data?.message || 'Failed to fund wallet');
  }
};

export const suspendPartnerAccount = async (id: string, reason: string) => {
  try {
    const response = await axios.post(`${API}/v1/coo/partners/${id}/suspend`, { reason }, getAuthHeaders());
    return response.data;
  } catch (error: any) {
    if (error.response?.data?.type) {
      const problem = error.response.data as ProblemDetails;
      throw new Error(`[${problem.title}]: ${problem.detail}`);
    }
    throw new Error(error.response?.data?.message || 'Failed to suspend partner');
  }
};

export const topUpPortfolio = async (portfolioId: string, data: any) => {
  try {
    const response = await axios.post(`${API}/v1/coo/portfolios/${portfolioId}/topup`, data, getAuthHeaders());
    return response.data;
  } catch (error: any) {
    if (error.response?.data?.type) {
      const problem = error.response.data as ProblemDetails;
      throw new Error(`[${problem.title}]: ${problem.detail}`);
    }
    throw new Error(error.response?.data?.message || 'Failed to top up portfolio');
  }
};

export const renewPortfolio = async (portfolioId: string) => {
  try {
    const response = await axios.post(`${API}/v1/coo/portfolios/${portfolioId}/renew`, {}, getAuthHeaders());
    return response.data;
  } catch (error: any) {
    if (error.response?.data?.type) {
      const problem = error.response.data as ProblemDetails;
      throw new Error(`[${problem.title}]: ${problem.detail}`);
    }
    throw new Error(error.response?.data?.message || 'Failed to renew portfolio');
  }
};

export const forwardDeposit = async (id: string) => {
  try {
    const response = await axios.post(`${API}/v1/coo/deposits/${id}/forward`, {}, getAuthHeaders());
    return response.data;
  } catch (error: any) {
    if (error.response?.data?.type) {
      const problem = error.response.data as ProblemDetails;
      throw new Error(`[${problem.title}]: ${problem.detail}`);
    }
    throw new Error(error.response?.data?.message || 'Failed to forward deposit to CFO');
  }
};

export const rejectDeposit = async (id: string, reason: string) => {
  try {
    const response = await axios.post(`${API}/v1/coo/deposits/${id}/reject`, { reason }, getAuthHeaders());
    return response.data;
  } catch (error: any) {
    if (error.response?.data?.type) {
      const problem = error.response.data as ProblemDetails;
      throw new Error(`[${problem.title}]: ${problem.detail}`);
    }
    throw new Error(error.response?.data?.message || 'Failed to reject deposit');
  }
};

export const updatePartnerPortfolio = async (id: string, updates: any) => {
  try {
    const response = await axios.patch(`${API}/v1/coo/portfolios/${id}`, updates, getAuthHeaders());
    return response.data;
  } catch (error: any) {
    if (error.response?.data?.type) {
      const problem = error.response.data as ProblemDetails;
      throw new Error(`[${problem.title}]: ${problem.detail}`);
    }
    throw new Error(error.response?.data?.message || 'Failed to update portfolio details');
  }
};

export const deletePartnerPortfolio = async (id: string) => {
  try {
    const response = await axios.delete(`${API}/v1/coo/portfolios/${id}`, getAuthHeaders());
    return response.data;
  } catch (error: any) {
    if (error.response?.data?.type) {
      const problem = error.response.data as ProblemDetails;
      throw new Error(`[${problem.title}]: ${problem.detail}`);
    }
    throw new Error(error.response?.data?.message || 'Failed to delete portfolio');
  }
};

export const validatePartnersImport = async (partners: any[]) => {
  try {
    const response = await axios.post(`${API}/v1/coo/partners/import/validate`, { partners }, getAuthHeaders());
    return response.data.data;
  } catch (error: any) {
    if (error.response?.data?.type) {
      const problem = error.response.data as ProblemDetails;
      throw new Error(`[${problem.title}]: ${problem.detail}`);
    }
    throw new Error(error.response?.data?.message || 'Failed to validate partners');
  }
};

export const importPartners = async (partners: any[]) => {
  try {
    const response = await axios.post(`${API}/v1/coo/partners/import`, { partners }, getAuthHeaders());
    return response.data;
  } catch (error: any) {
    if (error.response?.data?.type) {
      const problem = error.response.data as ProblemDetails;
      throw new Error(`[${problem.title}]: ${problem.detail}`);
    }
    throw new Error(error.response?.data?.message || 'Failed to import partners');
  }
};

export const createPartnerPortfolio = async (id: string, data: any) => {
  try {
    const response = await axios.post(`${API}/v1/coo/partners/${id}/portfolios`, data, getAuthHeaders());
    return response.data;
  } catch (error: any) {
    if (error.response?.data?.type) {
      const problem = error.response.data as ProblemDetails;
      throw new Error(`[${problem.title}]: ${problem.detail}`);
    }
    throw new Error(error.response?.data?.message || 'Failed to create manual portfolio');
  }
};
