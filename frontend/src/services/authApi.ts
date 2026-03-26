import axios from 'axios';

const api = axios.create({
  baseURL: (import.meta.env.VITE_API_URL || (import.meta.env.VITE_API_URL || 'http://localhost:3000')) + '/api/auth',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const loginUser = async (credentials: { phone: string; password: string }) => {
  const response = await api.post('/sessions', credentials);
  return response.data;
};

export const registerUser = async (userData: {
  phone: string;
  password: string;
  firstName: string;
  lastName: string;
  role: string;
  email?: string;
}) => {
  const response = await api.post('/registrations', userData);
  return response.data;
};

export const sendOTP = async (data: { phone: string }) => {
  const response = await api.post('/otp', data);
  return response.data;
};

export const verifyOTP = async (data: { phone: string; otp_code: string }) => {
  const response = await api.post('/otp/verifications', data);
  return response.data;
};

export const logoutUser = async (token: string) => {
  const response = await api.delete('/sessions', {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};
