import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  getTenantRentProgress,
  getTenantActivities,
  getTenantWallet,
  getAiIdProfile,
  getTenantAgreementStatus,
  acceptTenantAgreement 
} from '../../services/tenantApi';

// Query Keys
const keys = {
  rentProgress: ['tenant', 'rentProgress'] as const,
  activities: ['tenant', 'activities'] as const,
  wallet: ['tenant', 'wallet'] as const,
  aiIdProfile: ['tenant', 'aiIdProfile'] as const,
  agreementStatus: ['tenant', 'agreementStatus'] as const,
};

export const useTenantRentProgress = () => {
  return useQuery({
    queryKey: keys.rentProgress,
    queryFn: getTenantRentProgress,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useTenantActivities = () => {
  return useQuery({
    queryKey: keys.activities,
    queryFn: getTenantActivities,
    staleTime: 1000 * 60 * 5,
  });
};

export const useTenantWallet = () => {
  return useQuery({
    queryKey: keys.wallet,
    queryFn: getTenantWallet,
    staleTime: 1000 * 60 * 2,
  });
};

export const useAiIdProfile = () => {
  return useQuery({
    queryKey: keys.aiIdProfile,
    queryFn: getAiIdProfile,
    staleTime: 1000 * 60 * 15,
  });
};

export const useTenantAgreementStatus = () => {
  return useQuery({
    queryKey: keys.agreementStatus,
    queryFn: getTenantAgreementStatus,
    staleTime: Infinity, // Seldom changes once accepted
  });
};

export const useAcceptTenantAgreement = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: acceptTenantAgreement,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: keys.agreementStatus });
    },
  });
};
