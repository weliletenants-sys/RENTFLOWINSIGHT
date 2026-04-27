import { useQuery } from '@tanstack/react-query';
import { 
  getCeoKpis, 
  getCeoGrowthMetrics, 
  getCeoCharts, 
  getCeoRentRequestsTable,
  getCeoRevenue,
  getCeoUserAcquisition,
  getCeoLiquidityHealth,
  getCeoStaffPerformance,
  getCeoAngelPool
} from '../services/execApi';

const FIVE_MINUTES = 5 * 60 * 1000;

export const useCeoKpis = () => {
  return useQuery({
    queryKey: ['ceo', 'kpis'],
    queryFn: getCeoKpis,
    staleTime: FIVE_MINUTES,
    refetchInterval: FIVE_MINUTES,
  });
};

export const useCeoGrowthMetrics = () => {
  return useQuery({
    queryKey: ['ceo', 'growth'],
    queryFn: getCeoGrowthMetrics,
    staleTime: FIVE_MINUTES,
    refetchInterval: FIVE_MINUTES,
  });
};

export const useCeoCharts = () => {
  return useQuery({
    queryKey: ['ceo', 'charts'],
    queryFn: getCeoCharts,
    staleTime: FIVE_MINUTES,
    refetchInterval: FIVE_MINUTES,
  });
};

export const useCeoRentRequestsTable = () => {
  return useQuery({
    queryKey: ['ceo', 'rentRequestsTable'],
    queryFn: getCeoRentRequestsTable,
    staleTime: FIVE_MINUTES,
    refetchInterval: FIVE_MINUTES,
  });
};

export const useCeoRevenue = () => {
  return useQuery({
    queryKey: ['ceo', 'revenue'],
    queryFn: getCeoRevenue,
    staleTime: FIVE_MINUTES,
    refetchInterval: FIVE_MINUTES,
  });
};

export const useCeoUserAcquisition = () => {
  return useQuery({
    queryKey: ['ceo', 'userAcquisition'],
    queryFn: getCeoUserAcquisition,
    staleTime: FIVE_MINUTES,
    refetchInterval: FIVE_MINUTES,
  });
};

export const useCeoLiquidityHealth = () => {
  return useQuery({
    queryKey: ['ceo', 'liquidityHealth'],
    queryFn: getCeoLiquidityHealth,
    staleTime: FIVE_MINUTES,
    refetchInterval: FIVE_MINUTES,
  });
};

export const useCeoStaffPerformance = () => {
  return useQuery({
    queryKey: ['ceo', 'staffPerformance'],
    queryFn: getCeoStaffPerformance,
    staleTime: FIVE_MINUTES,
    refetchInterval: FIVE_MINUTES,
  });
};

export const useCeoAngelPool = () => {
  return useQuery({
    queryKey: ['ceo', 'angelPool'],
    queryFn: getCeoAngelPool,
    staleTime: FIVE_MINUTES,
    refetchInterval: FIVE_MINUTES,
  });
};
