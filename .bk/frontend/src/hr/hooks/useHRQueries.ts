import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { hrApi } from '../../services/hrApi';
import toast from 'react-hot-toast';

export const HR_KEYS = {
  overview: ['hr', 'overview'] as const,
  employees: ['hr', 'employees'] as const,
  leave: ['hr', 'leave'] as const,
};

export function useHROverview() {
  return useQuery({
    queryKey: HR_KEYS.overview,
    queryFn: hrApi.getOverview,
    staleTime: 60 * 1000, 
  });
}

export function useHREmployees() {
  return useQuery({
    queryKey: HR_KEYS.employees,
    queryFn: hrApi.getEmployees,
  });
}

export function useHRPendingLeave() {
  return useQuery({
    queryKey: HR_KEYS.leave,
    queryFn: hrApi.getPendingLeave,
  });
}

export function useApproveLeave() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status, reason }: { id: string, status: 'approved' | 'rejected', reason?: string }) => 
      hrApi.approveLeave(id, { status, reason }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: HR_KEYS.leave });
      queryClient.invalidateQueries({ queryKey: HR_KEYS.overview });
      toast.success('Leave request updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update leave request');
    }
  });
}

export function useIssueDisciplinary() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: hrApi.issueDisciplinary,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: HR_KEYS.overview });
      toast.success('Disciplinary action recorded');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to record disciplinary action');
    }
  });
}

export function useSubmitPayroll() {
  return useMutation({
    mutationFn: hrApi.submitPayroll,
    onSuccess: () => {
      toast.success('Payroll batch submitted to CFO');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to submit payroll batch');
    }
  });
}
