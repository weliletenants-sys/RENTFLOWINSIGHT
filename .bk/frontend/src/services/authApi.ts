import { apiClient } from './apiClient';

export const loginUser = async (credentials: { phone: string; password: string }) => {
  const response = await apiClient.post('/auth/login', credentials);
  return response.data;
};

export const loginAdmin = async (credentials: { phone: string; password: string }) => {
  // Now natively points to V2 Domain Admin Auth endpoint!
  const response = await apiClient.post('/admin/auth/login', credentials);
  return response.data;
};

export const registerUser = async (userData: {
  phone: string;
  password: string;
  firstName: string;
  lastName: string;
  role: string;
  email?: string;
  referrer_id?: string;
}) => {
  const response = await apiClient.post('/auth/register', userData);
  return response.data;
};

export const sendOTP = async (data: { phone: string }) => {
  const response = await apiClient.post('/auth/otp', data);
  return response.data;
};

export const verifyOTP = async (data: { phone: string; otp_code: string }) => {
  const response = await apiClient.post('/auth/otp/verifications', data);
  return response.data;
};

export const logoutUser = async (token: string) => {
  const response = await apiClient.post('/auth/logout', {}, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};
