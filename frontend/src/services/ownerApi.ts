import { apiClient } from './apiClient';

export 



// Overview
export const getOwnerOverview = async () => {
  const { data } = await apiClient.get('/owner/overview');
  return data;
};

// Properties
export const getOwnerProperties = async () => {
  const { data } = await apiClient.get('/owner/properties');
  return data;
};

export const registerOwnerProperty = async (payload: { address: string; units: number }) => {
  const { data } = await apiClient.post('/owner/properties', payload);
  return data;
};

// Tenants
export const getOwnerTenants = async () => {
  const { data } = await apiClient.get('/owner/tenants');
  return data;
};

export const inviteOwnerTenant = async (payload: { phone: string; propertyId: string; unit: string }) => {
  const { data } = await apiClient.post('/owner/tenants/invite', payload);
  return data;
};

export const enrollWelileHomes = async (payload: { tenantId: string }) => {
  const { data } = await apiClient.post('/owner/tenants/welile-homes/enroll', payload);
  return data;
};

// Finances
export const getOwnerHistory = async () => {
  const { data } = await apiClient.get('/owner/finance/history');
  return data;
};
