export interface NotificationItem {
  id: string;
  user_id: string;
  user_name: string;
  subject: string;
  message: string;
  type: 'support' | 'inquiry' | 'alert' | 'warning' | 'info' | 'security';
  is_read: boolean;
  created_at: string;
}

export const mockNotifications: NotificationItem[] = [
  {
    id: 'notif_1',
    user_id: 'usr_abc123',
    user_name: 'John Doe',
    subject: 'Cannot access my wallet',
    message: 'I tried to withdraw my funds but it says my account is restricted. Can you please help?',
    type: 'support',
    is_read: false,
    created_at: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 mins ago
  },
  {
    id: 'notif_2',
    user_id: 'usr_xyz789',
    user_name: 'System',
    subject: 'High volume withdrawal alert',
    message: '3 users have requested aggregate withdrawals exceeding 5M UGX in the last hour.',
    type: 'alert',
    is_read: true,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
  },
  {
    id: 'notif_3',
    user_id: 'usr_def456',
    user_name: 'Jane Smith',
    subject: 'House viewing question',
    message: 'What time is the agent coming to open the house for viewing?',
    type: 'inquiry',
    is_read: false,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(), // 5 hours ago
  },
  {
    id: 'notif_4',
    user_id: 'usr_sys111',
    user_name: 'System',
    subject: 'Low Buffer Warning',
    message: 'Platform solvency coverage ratio dropped below 1.25x. Currently at 1.15x.',
    type: 'warning',
    is_read: false,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(), // 12 hours ago
  },
  {
    id: 'notif_5',
    user_id: 'usr_ghi789',
    user_name: 'Peter K.',
    subject: 'Rent collection success',
    message: 'Your rent has been successfully paid directly to the landlord account.',
    type: 'info',
    is_read: true,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
  },
  {
    id: 'notif_6',
    user_id: 'usr_fra001',
    user_name: 'System',
    subject: 'Account frozen due to suspicious activity',
    message: 'Multiple failed PIN attempts detected on Wallet WRF-8921. Account frozen pending verification.',
    type: 'security',
    is_read: false,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 36).toISOString(), // 36 hours ago
  },
  {
    id: 'notif_7',
    user_id: 'usr_mno555',
    user_name: 'Sarah M.',
    subject: 'Need help updating my KYC',
    message: 'My National ID was rejected during registration but the photo is very clear.',
    type: 'support',
    is_read: true,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(), // 2 days ago
  },
  {
    id: 'notif_8',
    user_id: 'usr_pqr999',
    user_name: 'James O.',
    subject: 'Change phone number',
    message: 'I lost my phone and want to move my account to a new number.',
    type: 'inquiry',
    is_read: false,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(), // 3 days ago
  }
];
