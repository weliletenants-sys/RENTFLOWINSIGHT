import axios from 'axios';

// =========================================
// EXECUTIVE API TYPES
// =========================================

export interface CeoKpisResponse {
  totalUsers: number;
  tenantsFunded: number;
  rentFinanced: number;
  totalLandlords: number;
  partnersInvestors: number;
  platformRevenue: number;
  rentRepaidPercentage: number;
  activeAgents: number;
}

export interface CeoGrowthMetricsResponse {
  activeUsers: number;
  newUsers: number;
  retentionRate: number;
  referralRate: number;
  dailyTransactions: number;
}

export interface CeoChartsResponse {
  tenantGrowth: { date: string; new_tenants: number }[];
  capitalRaised: { month: string; amount: number }[];
  rentRepayment: { month: string; repaid: number }[];
}

export interface CeoRentRequestTableItem {
  id: string;
  tenant_name: string;
  amount: number;
  status: string;
  created_at: string;
  amount_repaid: number;
  remaining_balance: number;
}

export interface CeoRevenueResponse {
  trajectory: { month: string; tenant_fees: number; service_income: number; total: number }[];
}

export interface CeoUserAcquisitionResponse {
  funnel: { stage: string; count: number }[];
  demographics: { name: string; value: number }[];
  totalUsers: number;
  activeUsers: number;
}

export interface CeoLiquidityHealthResponse {
  totalSystemLiquidity: number;
  totalCapitalDeployed: number;
  capitalUtilizationPercentage: string | number;
  defaultRate: string | number;
  successRate: string | number;
  reserveBuffer: number;
}

export interface CeoStaffPerformanceResponse {
  activityHeatmap: { hour: string; volume: number }[];
  slaCompliance: { metric: string; target: string; actual: string; status: 'compliant' | 'warning' }[];
}

export interface CeoAngelPoolResponse {
  tier1Count: number;
  tier2Count: number;
  averagePortfolioSize: number;
  globalRegions: number;
  liquidityVelocity: { month: string; velocity: number }[];
}

// =========================================
// API SERVICES
// =========================================

const BASE_URL = '/api/v1/executive/ceo';

export const getCeoKpis = async (): Promise<CeoKpisResponse> => {
  const response = await axios.get(`${BASE_URL}/kpis`);
  return response.data;
};

export const getCeoGrowthMetrics = async (): Promise<CeoGrowthMetricsResponse> => {
  const response = await axios.get(`${BASE_URL}/growth-metrics`);
  return response.data;
};

export const getCeoCharts = async (): Promise<CeoChartsResponse> => {
  const response = await axios.get(`${BASE_URL}/charts`);
  return response.data;
};

export const getCeoRentRequestsTable = async (): Promise<CeoRentRequestTableItem[]> => {
  const response = await axios.get(`${BASE_URL}/rent-requests`);
  return response.data;
};

export const getCeoRevenue = async (): Promise<CeoRevenueResponse> => {
  const response = await axios.get(`${BASE_URL}/revenue-trajectory`);
  return response.data;
};

export const getCeoUserAcquisition = async (): Promise<CeoUserAcquisitionResponse> => {
  const response = await axios.get(`${BASE_URL}/user-acquisition`);
  return response.data;
};

export const getCeoLiquidityHealth = async (): Promise<CeoLiquidityHealthResponse> => {
  const response = await axios.get(`${BASE_URL}/liquidity-health`);
  return response.data;
};

export const getCeoStaffPerformance = async (): Promise<CeoStaffPerformanceResponse> => {
  const response = await axios.get(`${BASE_URL}/staff-performance`);
  return response.data;
};

export const getCeoAngelPool = async (): Promise<CeoAngelPoolResponse> => {
  const response = await axios.get(`${BASE_URL}/angel-pool`);
  return response.data;
};
