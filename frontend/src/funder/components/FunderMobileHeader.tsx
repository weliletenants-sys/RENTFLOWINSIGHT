import { Bell, User } from 'lucide-react';

interface FunderMobileHeaderProps {
  user: { fullName: string; avatarUrl?: string };
  notificationCount?: number;
  onNotificationClick?: () => void;
  onAvatarClick?: () => void;
}

export default function FunderMobileHeader({ user, notificationCount = 0, onNotificationClick, onAvatarClick }: FunderMobileHeaderProps) {
  const firstName = user.fullName.split(' ')[0];

  return (
    <header className="lg:hidden px-6 pt-6 pb-2 flex justify-between items-center">
      <div className="flex items-center gap-3 cursor-pointer" onClick={onAvatarClick}>
        {user.avatarUrl ? (
          <img src={user.avatarUrl} alt={user.fullName} className="w-12 h-12 rounded-full border-2 shadow-sm object-cover" style={{ borderColor: 'var(--color-primary-border)' }} />
        ) : (
          <div className="w-12 h-12 rounded-full border-2 shadow-sm flex items-center justify-center" style={{ background: 'var(--color-primary-light)', borderColor: 'var(--color-primary-border)' }}>
            <User className="w-6 h-6" style={{ color: 'var(--color-primary)' }} />
          </div>
        )}
        <div>
          <p className="text-xs text-gray-500 font-medium uppercase tracking-tight">Welcome Back,</p>
          <h1 className="text-lg font-bold text-gray-900 leading-tight">{firstName}</h1>
        </div>
      </div>

      <button onClick={onNotificationClick} className="relative w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm">
        <Bell className="w-5 h-5 text-gray-700" />
        {notificationCount > 0 && (
          <span className="absolute top-0 right-0 block h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-white" />
        )}
      </button>
    </header>
  );
}
