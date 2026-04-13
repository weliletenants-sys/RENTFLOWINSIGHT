// Shared types for the Funder Dashboard activity feed and portfolio list

export type ActivityCategory =
  | 'reward'
  | 'investment'
  | 'support'
  | 'withdrawal'
  | 'deposit'
  | 'refund';

export type ActivityStatus = 'ACTIVE' | 'PENDING' | 'COMPLETED' | 'PAUSED';

export interface ActivityItem {
  id: string;
  title: string;
  category: ActivityCategory;
  status: ActivityStatus;
  provider?: string;
  date: string;
  timestamp?: string;
  amount: number;
  isCredit: boolean;
}

export type PortfolioStatus = 'active' | 'pending' | 'pending_approval' | 'cancelled';

export interface PortfolioItem {
  id: string;
  portfolioCode: string;
  assetName?: string;
  investedAmount: number;
  supportedAmount?: number;
  totalEarned: number;
  expectedAmount?: number;
  roiPercent?: number;
  durationMonths?: number;
  payoutType?: 'Monthly' | 'Compounding';
  nextPayoutDate?: string;
  maturityDate?: string;
  status: PortfolioStatus;
}
