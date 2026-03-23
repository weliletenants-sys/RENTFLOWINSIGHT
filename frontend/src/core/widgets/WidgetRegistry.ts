import { lazy } from 'react';

// Using lazy loading for better performance, so we don't load the entire admin portal code if unnecessary
const GeneralLedger = lazy(() => import('../../components/widgets/GeneralLedger'));
const UserMatrix = lazy(() => import('../../components/widgets/UserMatrix'));
const AuditLogs = lazy(() => import('../../components/widgets/AuditLogs'));

// Consumer Widgets
const TenantWallet = lazy(() => import('../../tenant/components/WalletCard'));
const RentProgress = lazy(() => import('../../tenant/components/RentProgressCard'));
const FunderPortfolio = lazy(() => import('../../funder/components/FunderPortfolioList'));
const AgentCollections = lazy(() => import('../../agent/components/AgentDailyOpsCard'));

export const WIDGET_REGISTRY: Record<string, React.ComponentType<any>> = {
  general_ledger: GeneralLedger,
  user_matrix: UserMatrix,
  audit_logs: AuditLogs,
  
  // Consumers
  tenant_wallet: TenantWallet,
  rent_progress: RentProgress,
  funder_portfolio: FunderPortfolio,
  agent_collections: AgentCollections
};
