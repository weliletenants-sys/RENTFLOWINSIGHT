import { 
  Activity, ClipboardList, Users, Wallet, BarChart3, 
  FileText, AlertTriangle, Banknote, Handshake, Receipt, TrendingUp, UserCheck 
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export interface SidebarNode {
  title: string;
  path: string;
  icon: LucideIcon;
}

export interface SidebarSection {
  sectionTitle: string;
  items: SidebarNode[];
}

export const cooSidebarConfig: SidebarSection[] = [
  {
    sectionTitle: 'Financial Operations',
    items: [
      { title: 'Overview', path: '/admin/coo/overview', icon: Activity },
      { title: 'Rent Approvals', path: '/admin/coo/rent-approvals', icon: ClipboardList },
      { title: 'Transactions', path: '/admin/coo/transactions', icon: ClipboardList },
      { title: 'Agent Collections', path: '/admin/coo/collections', icon: Users },
      { title: 'Wallets', path: '/admin/coo/wallets', icon: Wallet },
      { title: 'Agents', path: '/admin/coo/agent-activity', icon: Activity },
      { title: 'Payment Analytics', path: '/admin/coo/analytics', icon: BarChart3 }
    ]
  },
  {
    sectionTitle: 'Governance',
    items: [
      { title: 'Reports', path: '/admin/coo/reports', icon: FileText },
      { title: 'Alerts', path: '/admin/coo/alerts', icon: AlertTriangle },
      { title: 'Withdrawal Approvals', path: '/admin/coo/withdrawals', icon: Banknote },
      { title: 'Partners', path: '/admin/coo/partners', icon: Handshake },
      { title: 'Partner Finance', path: '/admin/coo/partner-finance', icon: Receipt },
      { title: 'Partner Top-ups', path: '/admin/coo/partner-topups', icon: TrendingUp },
      { title: 'Staff Performance', path: '/admin/coo/staff-performance', icon: UserCheck }
    ]
  }
];

export const getSidebarConfig = (role: string): SidebarSection[] => {
  switch (role.toLowerCase()) {
    case 'coo':
      return cooSidebarConfig;
    default:
      return [];
  }
};
