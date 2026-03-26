import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || '';

export const managerApi = {
  getPoolBalance: async () => {
    const response = await axios.get(`${API_URL}/api/v1/manager/pool-balance`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });
    return response.data;
  },
  getPendingRentRequests: async () => {
    const response = await axios.get(`${API_URL}/api/v1/manager/rent-requests/pending`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });
    return response.data;
  },
  deployCapital: async (requestId: string) => {
    const response = await axios.post(`${API_URL}/api/v1/manager/rent-requests/${requestId}/deploy`, {}, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });
    return response.data;
  },
  getPendingDeposits: async () => {
    const response = await axios.get(`${API_URL}/api/v1/manager/ops/deposits/pending`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });
    return response.data;
  },
  approveDeposit: async (id: string) => {
    const response = await axios.post(`${API_URL}/api/v1/manager/ops/deposits/${id}/approve`, {}, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });
    return response.data;
  },
  getLedgerRecords: async () => {
    const response = await axios.get(`${API_URL}/api/v1/manager/ops/ledger`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });
    return response.data;
  },
  getAllUsers: async (params: { page: number; limit: number; search?: string; role?: string }) => {
    const { page, limit, search, role } = params;
    let url = `${API_URL}/api/v1/manager/users?page=${page}&limit=${limit}`;
    if (search) url += `&search=${search}`;
    if (role) url += `&role=${role}`;
    
    const response = await axios.get(url, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });
    return response.data;
  },
  updateUserRole: async (id: string, role: string) => {
    const response = await axios.patch(`${API_URL}/api/v1/manager/users/${id}/role`, { role }, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });
    return response.data;
  },
  getAgentFloats: async (params: { page: number; limit: number }) => {
    const { page, limit } = params;
    const response = await axios.get(`${API_URL}/api/v1/manager/agents/float?page=${page}&limit=${limit}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });
    return response.data;
  },
  issueAgentAdvance: async (id: string, data: { principal: number; cycle_days?: number; daily_rate?: number; note?: string }) => {
    const response = await axios.post(`${API_URL}/api/v1/manager/agents/${id}/advance`, data, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });
    return response.data;
  },
  getTenantStatuses: async (params: { page: number; limit: number; filter?: string }) => {
    const { page, limit, filter } = params;
    let url = `${API_URL}/api/v1/manager/tenants/status?page=${page}&limit=${limit}`;
    if (filter && filter !== 'all') url += `&filter=${filter}`;
    const response = await axios.get(url, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
    return response.data;
  },
  triggerTenantEviction: async (id: string, legal_reason: string) => {
    const response = await axios.post(`${API_URL}/api/v1/manager/tenants/${id}/eviction`, { legal_reason }, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });
    return response.data;
  }
};
