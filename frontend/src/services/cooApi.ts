import axios from 'axios';

const API = '/api'; // Proxied to localhost:3000 by vite

// Attach headers correctly based on localStorage auth mechanisms
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
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
