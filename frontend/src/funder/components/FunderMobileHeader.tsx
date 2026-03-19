import { useState, useRef, useEffect } from 'react';
import { Bell, User, CheckCircle, TrendingUp, Info } from 'lucide-react';

interface FunderMobileHeaderProps {
  user: { fullName: string; avatarUrl?: string };
  notificationCount?: number;
  onNotificationClick?: () => void;
  onAvatarClick?: () => void;
}

export default function FunderMobileHeader({ user, onNotificationClick, onAvatarClick }: FunderMobileHeaderProps) {
  const [showNotifs, setShowNotifs] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const firstName = user.fullName.split(' ')[0];

  // Close notifications on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setShowNotifs(false);
      }
    }
    if (showNotifs) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showNotifs]);

  // Demo Notifications State
  const [notifications, setNotifications] = useState([
    { id: 1, title: 'New Payout Received', desc: 'You received UGX 462,500 from Kampala Heights.', time: '2 hours ago', unread: true, type: 'success' },
    { id: 2, title: 'Portfolio Update', desc: 'Entebbe Views property valuation increased by 4%.', time: '1 day ago', unread: true, type: 'update' },
    { id: 3, title: 'System Alert', desc: 'Your monthly tax statement is ready for download.', time: '3 days ago', unread: false, type: 'info' },
  ]);

  const unreadCount = notifications.filter(n => n.unread).length;

  const handleMarkAllRead = (e: React.MouseEvent) => {
    e.stopPropagation();
    setNotifications(notifications.map(n => ({ ...n, unread: false })));
  };

  const handleReadSingle = (id: number) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, unread: false } : n));
  };

  const IconMap: any = {
    success: <CheckCircle className="w-5 h-5 text-green-500" />,
    update: <TrendingUp className="w-5 h-5 text-[var(--color-primary)]" />,
    info: <Info className="w-5 h-5 text-blue-500" />
  };

  return (
    <header className="lg:hidden px-6 pt-6 pb-2 relative z-50">
      <div className="flex justify-between items-center relative">
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

        <div className="relative" ref={notifRef}>
          <button 
            onClick={() => {
              setShowNotifs(!showNotifs);
              if (onNotificationClick) onNotificationClick();
            }} 
            className="relative w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm focus:outline-none cursor-pointer"
          >
            <Bell className="w-5 h-5 text-gray-700" />
            {unreadCount > 0 && (
              <span className="absolute top-0 right-0 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-red-500 text-[8px] font-bold text-white ring-2 ring-white">
                {unreadCount}
              </span>
            )}
          </button>

          {showNotifs && (
            <div className="absolute right-0 top-full mt-3 w-[calc(100vw-3rem)] max-w-[320px] bg-white rounded-2xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.15)] border border-slate-100 overflow-hidden z-[60] transform origin-top-right transition-all">
              {/* Dropdown Header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-slate-50 bg-slate-50/50">
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-slate-900 text-sm">Notifications</h4>
                  {unreadCount > 0 && (
                    <span className="bg-[var(--color-primary-faint)] text-[var(--color-primary)] text-[10px] font-bold px-2 py-0.5 rounded-full">
                      {unreadCount} new
                    </span>
                  )}
                </div>
                {unreadCount > 0 && (
                  <button 
                    onClick={handleMarkAllRead}
                    className="text-[11px] font-bold text-[var(--color-primary)] hover:underline"
                  >
                    Mark all read
                  </button>
                )}
              </div>
              
              {/* Notification List */}
              <div className="flex flex-col max-h-[380px] overflow-y-auto custom-scrollbar">
                {notifications.map((notif) => (
                  <div 
                    key={notif.id}
                    onClick={() => handleReadSingle(notif.id)}
                    className={`flex items-start gap-4 p-4 border-b border-slate-50 cursor-pointer transition-all hover:bg-slate-50 group relative ${notif.unread ? 'bg-[var(--color-primary-faint)]/30' : 'opacity-80'}`}
                  >
                    {/* Icon */}
                    <div className="flex-shrink-0 mt-0.5 p-2 bg-white rounded-full shadow-sm border border-slate-100 group-hover:scale-110 transition-transform">
                      {IconMap[notif.type]}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start mb-1">
                        <p className={`text-xs ${notif.unread ? 'font-bold text-slate-900' : 'font-semibold text-slate-700'}`}>
                          {notif.title}
                        </p>
                        <p className="text-[10px] text-slate-400 font-medium whitespace-nowrap ml-2">
                          {notif.time}
                        </p>
                      </div>
                      <p className={`text-[11px] leading-relaxed ${notif.unread ? 'text-slate-600' : 'text-slate-500'}`}>
                        {notif.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Footer */}
              <div className="p-3 bg-slate-50 border-t border-slate-100 text-center">
                <button className="text-xs font-bold text-slate-500 hover:text-[var(--color-primary)] transition-colors">
                  View all notifications
                </button>
              </div>
            </div>
          )}
        </div>

      </div>
    </header>
  );
}
