import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { 
  getAgentLeaderboard, 
  getAdvances, 
  requestAdvance, 
  generatePaymentToken, 
  uploadDeliveryConfirmation,
  getDashboardSummary,
  getEarnings,
  getReferrals,
  fetchRentRequests,
  getAssignedTenants
} from '../../services/agentApi';

export const agentKeys = {
  all: ['agent'] as const,
  leaderboard: () => [...agentKeys.all, 'leaderboard'] as const,
  advances: () => [...agentKeys.all, 'advances'] as const,
  dashboardSummary: () => [...agentKeys.all, 'dashboardSummary'] as const,
  earnings: () => [...agentKeys.all, 'earnings'] as const,
  referrals: () => [...agentKeys.all, 'referrals'] as const,
  rentRequests: () => [...agentKeys.all, 'rentRequests'] as const,
  assignedTenants: () => [...agentKeys.all, 'assignedTenants'] as const,
};

// Error Handler helper based on api.md RFC 7807 problem details
export const handleApiError = (error: any, fallbackMessage: string) => {
  if (error?.isProblemDetail) {
    toast.error(`${error.title}: ${error.detail}`);
  } else {
    toast.error(error?.detail || error?.message || fallbackMessage);
  }
};

/* -------------------------------------------------------------------------- */
/*                                  QUERIES                                   */
/* -------------------------------------------------------------------------- */

export const useAgentLeaderboard = () => {
  return useQuery({
    queryKey: agentKeys.leaderboard(),
    queryFn: getAgentLeaderboard,
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });
};

export const useAdvances = () => {
  return useQuery({
    queryKey: agentKeys.advances(),
    queryFn: getAdvances,
    staleTime: 1000 * 60 * 2,
  });
};

export const useAgentDashboardSummary = () => {
  return useQuery({
    queryKey: agentKeys.dashboardSummary(),
    queryFn: getDashboardSummary,
    staleTime: 1000 * 60 * 5, // Cache for 5 mins
  });
};

export const useAgentEarnings = () => {
  return useQuery({
    queryKey: agentKeys.earnings(),
    queryFn: getEarnings,
    staleTime: 1000 * 60 * 5,
  });
};

export const useAgentReferrals = () => {
  return useQuery({
    queryKey: agentKeys.referrals(),
    queryFn: getReferrals,
    staleTime: 1000 * 60 * 5,
  });
};

export const useAgentRentRequests = () => {
  return useQuery({
    queryKey: agentKeys.rentRequests(),
    queryFn: fetchRentRequests,
    staleTime: 1000 * 60 * 2,
  });
};

export const useAgentClients = () => {
  return useQuery({
    queryKey: agentKeys.assignedTenants(),
    queryFn: getAssignedTenants,
    staleTime: 1000 * 60 * 5,
  });
};

/* -------------------------------------------------------------------------- */
/*                                 MUTATIONS                                  */
/* -------------------------------------------------------------------------- */

export const useRequestAdvanceMutation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: requestAdvance,
    onSuccess: (data) => {
      toast.success(data?.message || 'Advance requested successfully!');
      queryClient.invalidateQueries({ queryKey: agentKeys.advances() });
    },
    onError: (error) => {
      handleApiError(error, 'Failed to request advance');
    }
  });
};

export const useGenerateTokenMutation = () => {
  return useMutation({
    mutationFn: generatePaymentToken,
    onSuccess: () => {
      toast.success('Offline payment token generated!');
    },
    onError: (error) => {
      handleApiError(error, 'Failed to generate token');
    }
  });
};

export const useConfirmDeliveryMutation = () => {
  return useMutation({
    mutationFn: uploadDeliveryConfirmation,
    onSuccess: () => {
      toast.success('Rent delivery successfully confirmed!');
    },
    onError: (error) => {
      handleApiError(error, 'Failed to confirm delivery');
    }
  });
};
