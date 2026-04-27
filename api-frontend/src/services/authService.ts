// src/services/authService.ts
import { apiClient, setAuthToken, removeAuthToken } from './apiClient';

export interface LoginParams {
  phone?: string;
  email?: string;
  password?: string;
  otp?: string;
}

export interface RegisterParams {
  phone?: string;
  email?: string;
  password?: string;
  role: string;
  firstName?: string;
  lastName?: string;
}

export const authService = {
  login: async (params: LoginParams) => {
    const data = await apiClient('/auth/login', {
      method: 'POST',
      body: JSON.stringify(params),
    });
    if (data.token) setAuthToken(data.token);
    return data;
  },

  register: async (params: RegisterParams) => {
    const data = await apiClient('/auth/register', {
      method: 'POST',
      body: JSON.stringify(params),
    });
    if (data.token) setAuthToken(data.token);
    return data;
  },

  logout: async () => {
    try {
      await apiClient('/auth/logout', { method: 'POST' });
    } catch (e) {
      // Ignore errors on logout
    } finally {
      removeAuthToken();
    }
  },

  verifyOtp: async (phone: string, otp: string) => {
    const data = await apiClient('/auth/verify-otp', {
      method: 'POST',
      body: JSON.stringify({ phone, otp }),
    });
    if (data.token) setAuthToken(data.token);
    return data;
  },

  requestOtp: async (phone: string) => {
    return apiClient('/auth/request-otp', {
      method: 'POST',
      body: JSON.stringify({ phone }),
    });
  },

  resetPassword: async (phone: string, otp: string, newPassword: string) => {
    return apiClient('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ phone, otp, newPassword }),
    });
  }
};
