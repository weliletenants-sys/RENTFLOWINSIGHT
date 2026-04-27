// src/services/userService.ts
import { apiClient } from './apiClient';

export interface UserProfile {
  id: string;
  email?: string;
  phone?: string;
  first_name?: string;
  last_name?: string;
  roles: string[];
}

export const userService = {
  getCurrentProfile: async (): Promise<UserProfile> => {
    return apiClient('/users/me', {
      method: 'GET',
    });
  },

  updateProfile: async (data: Partial<UserProfile>) => {
    return apiClient('/users/me', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }
};
