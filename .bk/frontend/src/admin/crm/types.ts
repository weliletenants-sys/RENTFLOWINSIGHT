export interface NotificationItem {
  id: string;
  user_id: string;
  user_name: string;
  subject: string;
  message: string;
  type: string;
  is_read: boolean;
  created_at: string;
}
