import { useQuery } from '@tanstack/react-query';
import { getFunderDashboardStats, getFunderActivities, getWalletOperations, getPayoutMethods, getFunderPortfolios, getFunderOpportunities } from '../../services/funderApi';

export const funderQueryKeys = {
  wallet: ['funder_wallet'] as const,
  portfolios: ['funder_portfolios'] as const,
  opportunities: ['funder_opportunities'] as const,
  dashboard: ['funder_dashboard'] as const,
};

export const fetchFunderWalletData = async () => {
  const [stats, activities, opsData, payoutRes] = await Promise.all([
    getFunderDashboardStats(),
    getFunderActivities(),
    getWalletOperations().catch(() => ({ data: { operations: [] } })),
    getPayoutMethods().catch(() => ({ data: { payoutMethods: [] } }))
  ]);
  return { stats, activities, opsData, payoutRes };
};

export const useFunderWalletData = () => {
  return useQuery({
    queryKey: funderQueryKeys.wallet,
    queryFn: fetchFunderWalletData,
    staleTime: 1000 * 60 * 5, // 5 minutes fresh
  });
};

export const useFunderPortfoliosData = () => {
  return useQuery({
    queryKey: funderQueryKeys.portfolios,
    queryFn: getFunderPortfolios,
    staleTime: 1000 * 60 * 5,
  });
};

export const useFunderOpportunitiesData = () => {
  return useQuery({
    queryKey: funderQueryKeys.opportunities,
    queryFn: getFunderOpportunities,
    staleTime: 1000 * 60 * 5,
  });
};
