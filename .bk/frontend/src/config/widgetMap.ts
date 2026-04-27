import { PERMISSIONS, type Permission } from './permissions';

export const WIDGET_PERMISSIONS: Record<string, Permission[]> = {
  general_ledger: [PERMISSIONS.VIEW_LEDGER],
  user_matrix: [PERMISSIONS.MANAGE_USERS],
  financial_transactions: [PERMISSIONS.VIEW_TRANSACTIONS],
  coo_analytics: [PERMISSIONS.VIEW_AGENT_COLLECTIONS],
  system_config: [PERMISSIONS.CONFIG_SYSTEM],
  audit_logs: [PERMISSIONS.VIEW_AUDIT],

  // Consumer Portal Modules
  tenant_wallet: [PERMISSIONS.VIEW_OWN_WALLET],
  rent_progress: [PERMISSIONS.VIEW_OWN_RENT_STATUS],
  funder_portfolio: [PERMISSIONS.VIEW_OWN_PORTFOLIO],
  agent_collections: [PERMISSIONS.MANAGE_OWN_COLLECTIONS]
};
