export const PERMISSIONS = {
  // Financial
  VIEW_LEDGER: 'view_ledger',
  VIEW_TRANSACTIONS: 'view_transactions',
  APPROVE_WITHDRAWALS: 'approve_withdrawals',
  APPROVE_DEPOSITS: 'approve_deposits',
  
  // Administrative
  MANAGE_USERS: 'manage_users',
  VIEW_AUDIT: 'view_audit',
  CONFIG_SYSTEM: 'config_system',
  
  // Operational
  VIEW_AGENT_COLLECTIONS: 'view_agent_collections',
  APPROVE_RENT_REQUESTS: 'approve_rent_requests',
  
  // Consumer Isolation
  VIEW_OWN_WALLET: 'view_own_wallet',
  VIEW_OWN_RENT_STATUS: 'view_own_rent_status',
  VIEW_OWN_PORTFOLIO: 'view_own_portfolio',
  MANAGE_OWN_COLLECTIONS: 'manage_own_collections'
} as const;

export type Permission = typeof PERMISSIONS[keyof typeof PERMISSIONS] | '*';
