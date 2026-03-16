import { Bell, Search, User } from 'lucide-react';

interface FunderDashboardHeaderProps {
  user: { fullName: string; role: string; avatarUrl?: string };
  pageTitle?: string;
  onNotificationClick?: () => void;
  onAvatarClick?: () => void;
}

export default function FunderDashboardHeader({
  user, pageTitle = 'Dashboard', onNotificationClick, onAvatarClick,
}: FunderDashboardHeaderProps) {
  return (
    <div
      className="hidden lg:flex sticky top-0 z-30 px-8 h-20 items-center justify-between border-b"
      style={{
        background: 'rgba(244,240,255,0.85)',
        backdropFilter: 'blur(12px)',
        borderColor: 'var(--color-primary-border)',
      }}
    >
      {/* Left: page title */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">{pageTitle}</h1>
        <p className="text-xs text-slate-500">Welcome back, {user.fullName}</p>
      </div>

      {/* Right: search + bell + avatar */}
      <div className="flex items-center gap-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search portfolios..."
            className="pl-10 pr-4 py-2 bg-white border rounded-lg text-sm w-64 focus:outline-none focus:ring-2 text-slate-800"
            style={{ borderColor: 'var(--color-primary-border)', '--tw-ring-color': 'var(--color-primary-light)' } as React.CSSProperties}
          />
        </div>

        <button onClick={onNotificationClick} className="p-2 text-slate-500 hover:bg-white rounded-lg transition-colors">
          <Bell className="w-6 h-6" />
        </button>

        <div
          className="flex items-center gap-3 pl-4 border-l cursor-pointer"
          style={{ borderColor: 'var(--color-primary-border)' }}
          onClick={onAvatarClick}
        >
          <div className="text-right hidden sm:block">
            <p className="text-sm font-bold leading-none text-slate-900">{user.fullName}</p>
            <p className="text-[10px] text-slate-500 uppercase tracking-wider">{user.role}</p>
          </div>
          {user.avatarUrl ? (
            <img src={user.avatarUrl} alt={user.fullName} className="w-10 h-10 rounded-full object-cover border-2" style={{ borderColor: 'var(--color-primary-border)' }} />
          ) : (
            <div
              className="w-10 h-10 rounded-full border-2 flex items-center justify-center"
              style={{ background: 'var(--color-primary-light)', borderColor: 'var(--color-primary-border)' }}
            >
              <User className="w-5 h-5" style={{ color: 'var(--color-primary)' }} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
