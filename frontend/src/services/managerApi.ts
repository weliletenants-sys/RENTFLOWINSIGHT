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
  }
};
