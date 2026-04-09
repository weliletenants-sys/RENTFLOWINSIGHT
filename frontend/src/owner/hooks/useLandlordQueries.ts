import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import {
  getOwnerOverview,
  getOwnerProperties,
  getOwnerTenants,
  getOwnerHistory,
  registerOwnerProperty,
  inviteOwnerTenant,
  enrollWelileHomes
} from '../../services/ownerApi';

export const useLandlordOverview = () => {
  return useQuery({
    queryKey: ['ownerOverview'],
    queryFn: getOwnerOverview,
  });
};

export const useLandlordProperties = () => {
  return useQuery({
    queryKey: ['ownerProperties'],
    queryFn: getOwnerProperties,
  });
};

export const useLandlordTenants = () => {
  return useQuery({
    queryKey: ['ownerTenants'],
    queryFn: getOwnerTenants,
  });
};

export const useLandlordHistory = () => {
  return useQuery({
    queryKey: ['ownerHistory'],
    queryFn: getOwnerHistory,
  });
};

export const useRegisterPropertyMutation = (onSuccessCallback?: () => void) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: registerOwnerProperty,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ownerProperties'] });
      queryClient.invalidateQueries({ queryKey: ['ownerOverview'] });
      toast.success('Property registered successfully!');
      if (onSuccessCallback) onSuccessCallback();
    },
    onError: (error: any) => {
      toast.error(error?.detail || 'Failed to register property');
    }
  });
};

export const useInviteTenantMutation = (onSuccessCallback?: () => void) => {
  return useMutation({
    mutationFn: inviteOwnerTenant,
    onSuccess: () => {
      toast.success('Registration invite sent to tenant!');
      if (onSuccessCallback) onSuccessCallback();
    },
    onError: (error: any) => {
      toast.error(error?.detail || 'Failed to send invite');
    }
  });
};

export const useEnrollWelileHomesMutation = (onSuccessCallback?: () => void) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: enrollWelileHomes,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ownerTenants'] });
      queryClient.invalidateQueries({ queryKey: ['ownerOverview'] });
      toast.success('Tenant successfully enrolled in the guaranteed rent program.');
      if (onSuccessCallback) onSuccessCallback();
    },
    onError: (error: any) => {
      toast.error(error?.detail || 'Failed to enroll tenant');
    }
  });
};
