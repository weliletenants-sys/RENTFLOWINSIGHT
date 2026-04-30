import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getCfoOverview,
  getCfoRoiDashboard,
  getCfoPredictiveRunway,
  getCfoReconciliations,
  getCfoLedger,
  getCfoStatements,
  getPendingWithdrawals,
  approveWithdrawalRequest,
  rejectWithdrawalRequest,
  getPendingCommissions,
  approveCommissionPayout,
  rejectCommissionPayout
} from '../services/cfoApi';

// 5 Minute Caching exactly as requested
const CFO_STALE_TIME = 5 * 60 * 1000;

export const useCfoOverview = () => {
  return useQuery({
    queryKey: ['cfo', 'overview'],
    queryFn: getCfoOverview,
    staleTime: CFO_STALE_TIME,
  });
};

export const useCfoRoiDashboard = () => {
  return useQuery({
    queryKey: ['cfo', 'roi-dashboard'],
    queryFn: getCfoRoiDashboard,
    staleTime: CFO_STALE_TIME,
  });
};

export const useCfoLedger = (filters = {}) => {
  return useQuery({
    queryKey: ['cfo', 'ledger', filters],
    queryFn: () => getCfoLedger(filters),
    staleTime: CFO_STALE_TIME,
  });
};

export const useCfoStatements = () => {
  return useQuery({
    queryKey: ['cfo', 'statements'],
    queryFn: getCfoStatements,
    staleTime: CFO_STALE_TIME,
  });
};

export const useCfoReconciliations = () => {
  return useQuery({
    queryKey: ['cfo', 'reconciliations'],
    queryFn: getCfoReconciliations,
    staleTime: CFO_STALE_TIME,
  });
};

export const useCfoPendingWithdrawals = () => {
  return useQuery({
    queryKey: ['cfo', 'pending-withdrawals'],
    queryFn: getPendingWithdrawals,
  });
};

export const useCfoWithdrawalMutations = () => {
  const queryClient = useQueryClient();

  const approve = useMutation({
    mutationFn: (data: { id: string; reason?: string }) => approveWithdrawalRequest(data.id, data.reason),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['cfo', 'pending-withdrawals'] })
  });

  const reject = useMutation({
    mutationFn: (data: { id: string; reason: string }) => rejectWithdrawalRequest(data.id, data.reason),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['cfo', 'pending-withdrawals'] })
  });

  return { approve, reject };
};

export const useCfoPendingCommissions = () => {
  return useQuery({
    queryKey: ['cfo', 'pending-commissions'],
    queryFn: getPendingCommissions,
  });
};

export const useCfoCommissionMutations = () => {
  const queryClient = useQueryClient();

  const approve = useMutation({
    mutationFn: (id: string) => approveCommissionPayout(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['cfo', 'pending-commissions'] })
  });

  const reject = useMutation({
    mutationFn: (data: { id: string; reason: string }) => rejectCommissionPayout(data.id, data.reason),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['cfo', 'pending-commissions'] })
  });

  return { approve, reject };
};
