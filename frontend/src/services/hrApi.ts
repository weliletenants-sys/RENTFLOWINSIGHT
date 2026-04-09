import axios from 'axios';

const api = axios.create({
  baseURL: '/api/admin/hr', // Pointing to the new admin-scoped HR router
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Basic formatting mapping RFC 7807 problem responses into thrown JS Errors for React Query
    if (error.response?.data?.problem) {
        throw new Error(error.response.data.title || 'An error occurred with the HR API');
    }
    throw error;
  }
);

export const hrApi = {
  getOverview: async () => {
    const { data } = await api.get('/overview');
    return data;
  },
  
  getEmployees: async () => {
    const { data } = await api.get('/employees');
    return data;
  },
  
  getPendingLeave: async () => {
    const { data } = await api.get('/leave');
    return data;
  },
  
  approveLeave: async (id: string, payload: { status: 'approved' | 'rejected', reason?: string }) => {
    const { data } = await api.post(`/leave/${id}/approve`, payload);
    return data;
  },
  
  issueDisciplinary: async (payload: { user_id: string, type: string, severity: string, description: string }) => {
    const { data } = await api.post('/disciplinary', payload);
    return data;
  },
  
  submitPayroll: async (payload: { batch_name: string, period_start: string, period_end: string, total_amount: number }) => {
    const { data } = await api.post('/payroll', payload);
    return data;
  }
};
