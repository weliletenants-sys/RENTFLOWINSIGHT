import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, Bell, Search, CheckCircle, TrendingUp, Info, Settings, LogOut, LifeBuoy, Activity, BadgeCheck, Loader2, ShieldCheck, ArrowDownLeft, ArrowUpRight, PieChart } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import WelileAIIDBadge from '../../components/layout/WelileAIIDBadge';

interface AgentDashboardHeaderProps {
  user: { fullName: string; role: string; avatarUrl?: string; isVerified?: boolean };
  pageTitle?: string;
  onNotificationClick?: () => void;
  onAvatarClick?: () => void;
  onMenuClick?: () => void;
}

export default function AgentDashboardHeader({
  user, pageTitle = 'Dashboard', onNotificationClick, onAvatarClick, onMenuClick
}: AgentDashboardHeaderProps) {
  const [showNotifs, setShowNotifs] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const { logout, user: authUser } = useAuth();
  const currentDate = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

  // Close notifications on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setShowNotifs(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setShowProfile(false);
      }
    }
    if (showNotifs || showProfile) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showNotifs, showProfile]);

  const [notifications, setNotifications] = useState<any[]>([]);

  useEffect(() => {
    const fetchNotifs = async () => {
      try {
        const token = localStorage.getItem('access_token');
        if (!token) return;
        const res = await fetch('/api/notifications', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        if (data.status === 'success') {
          const mapped = data.data.map((n: any) => ({
            id: n.id,
            title: n.title,
            desc: n.message,
            time: new Date(n.created_at).toLocaleDateString(),
            unread: !n.is_read,
            type: n.type
          }));
          setNotifications(mapped);
        }
      } catch (e) {
        console.error('Silent background notification fetch failed', e);
      }
    };
    fetchNotifs();
  }, []);

  const unreadCount = notifications.filter((n: any) => n.unread).length;

  const handleMarkAllRead = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const token = localStorage.getItem('access_token');
      const res = await fetch('/api/notifications/read-all', {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        setNotifications(notifications.map((n: any) => ({ ...n, unread: false })));
      }
    } catch (err) {}
  };

  const handleReadSingle = async (id: string | number) => {
    try {
      const token = localStorage.getItem('access_token');
      const res = await fetch(`/api/notifications/${id}/read`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        setNotifications(notifications.map((n: any) => n.id === id ? { ...n, unread: false } : n));
      }
    } catch (err) {}
  };

  const IconMap: any = {
    success:       <CheckCircle   className="w-5 h-5 text-green-500" />,
    update:        <TrendingUp    className="w-5 h-5 text-[#8b5cf6]" />,
    info:          <Info          className="w-5 h-5 text-blue-500" />,
    KYC_SUBMITTED: <ShieldCheck   className="w-5 h-5 text-blue-600" />,
    INVESTMENT:    <ArrowDownLeft className="w-5 h-5 text-emerald-500" />,
    investment:    <PieChart      className="w-5 h-5 text-[#8b5cf6]" />,
    WITHDRAWAL:    <ArrowUpRight  className="w-5 h-5 text-orange-500" />,
  };
  const DefaultIcon = <Activity className="w-5 h-5 text-slate-400" />;

  return (
    <div
      className="flex sticky top-0 z-30 px-4 lg:px-8 pb-3 pt-3 lg:pb-2 lg:pt-0 min-h-[4rem] lg:h-20 items-center justify-between border-b w-full bg-white/85 dark:bg-[#121212]/85 backdrop-blur-md border-slate-100 dark:border-slate-800"
    >
      {/* Left: Hamburger & page title */}
      <div className="flex items-center gap-3">
        <button 
          onClick={onMenuClick}
          className="lg:hidden p-2 -ml-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
        >
          <Menu className="w-6 h-6" />
        </button>
        <div className="lg:hidden">
          <img src="/welile-colored.png" alt="Welile" className="h-6 object-contain dark:hidden" />
          <img src="/welile-white.png" alt="Welile" className="h-6 object-contain hidden dark:block" />
        </div>
        <div className="hidden lg:block">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{pageTitle}</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">Welcome back, {user.fullName}</p>
        </div>
      </div>

      {/* Right: search + bell + avatar */}
      <div className="flex items-center gap-3 lg:gap-6">
        <div className="hidden sm:block">
          <WelileAIIDBadge />
        </div>
        
        <div className="relative hidden sm:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search clients..."
            className="pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-sm w-64 focus:outline-none focus:ring-2 focus:ring-[#8b5cf6]/50 text-slate-800 dark:text-slate-100 placeholder:text-slate-400"
          />
        </div>

        {/* Notifications */}
        <div className="relative" ref={notifRef}>
          <button 
            onClick={() => {
              setShowNotifs(!showNotifs);
              if (onNotificationClick) onNotificationClick();
            }} 
            className="p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors relative focus:outline-none cursor-pointer"
          >
            <Bell className="w-6 h-6" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-red-500 text-[8px] font-bold text-white ring-2 ring-white dark:ring-[#121212]">
                {unreadCount}
              </span>
            )}
          </button>
          
          {showNotifs && (
            <div className="absolute right-0 mt-3 w-[320px] bg-white dark:bg-[#1e1e1e] rounded-2xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.15)] border border-slate-100 dark:border-slate-800 overflow-hidden z-[100] transform origin-top-right transition-all">
              {/* Dropdown Header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-slate-50 dark:border-slate-800 bg-slate-50/50 dark:bg-[#121212]/50">
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-slate-900 dark:text-white text-sm">Notifications</h4>
                  {unreadCount > 0 && (
                    <span className="bg-purple-50 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400 text-[10px] font-bold px-2 py-0.5 rounded-full">
                      {unreadCount} new
                    </span>
                  )}
                </div>
                {unreadCount > 0 && (
                  <button 
                    onClick={handleMarkAllRead}
                    className="text-[11px] font-bold text-[#8b5cf6] hover:underline"
                  >
                    Mark all read
                  </button>
                )}
              </div>
              
              {/* Notification List */}
              <div className="flex flex-col max-h-[380px] overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                {notifications.length === 0 ? (
                  <div className="p-8 text-center text-slate-500 text-sm">No new notifications.</div>
                ) : (
                  notifications.map((notif: any) => (
                    <div 
                      key={notif.id}
                      onClick={() => handleReadSingle(notif.id)}
                      className={`flex items-start gap-4 p-4 border-b border-slate-50 dark:border-slate-800 cursor-pointer transition-all group relative ${notif.unread ? 'bg-purple-50 dark:bg-purple-900/20 hover:bg-purple-100/50 dark:hover:bg-purple-900/40' : 'hover:bg-slate-50 dark:hover:bg-slate-800/50 opacity-80'}`}
                    >
                      {/* Icon */}
                      <div className="flex-shrink-0 mt-0.5 p-2 bg-white dark:bg-slate-800 rounded-full shadow-sm border border-slate-100 dark:border-slate-700 group-hover:scale-110 transition-transform">
                        {IconMap[notif.type] ?? DefaultIcon}
                      </div>
  
                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start mb-1">
                          <p className={`text-xs ${notif.unread ? 'font-bold text-slate-900 dark:text-white' : 'font-semibold text-slate-700 dark:text-slate-300'}`}>
                            {notif.title}
                          </p>
                          <p className="text-[10px] text-slate-400 dark:text-slate-500 font-medium whitespace-nowrap ml-2">
                            {notif.time}
                          </p>
                        </div>
                        <p className={`text-[11px] leading-relaxed ${notif.unread ? 'text-slate-600 dark:text-slate-400' : 'text-slate-500 dark:text-slate-500'}`}>
                          {notif.desc}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Footer */}
              <div className="p-3 bg-slate-50 dark:bg-[#121212] border-t border-slate-100 dark:border-slate-800 text-center">
                <button className="text-xs font-bold text-slate-500 hover:text-[#8b5cf6] transition-colors">
                  View all notifications
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Profile Dropdown Container */}
        <div className="relative" ref={profileRef}>
          <div
            className="flex items-center gap-3 pl-4 border-l border-slate-200 dark:border-slate-800 cursor-pointer"
            onClick={() => {
              setShowProfile(!showProfile);
              if (onAvatarClick) onAvatarClick();
            }}
          >
            <div className="text-right hidden sm:block">
              <p className="text-sm font-bold leading-none text-slate-900 dark:text-white">{authUser?.firstName || user.fullName}</p>
              <p className="text-[10px] text-slate-500 uppercase tracking-wider">{currentDate}</p>
            </div>
            <div className="relative">
              <img 
                src={(authUser as any)?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${authUser?.firstName || 'User'}&backgroundColor=8b5cf6`} 
                alt={user.fullName} 
                className="w-10 h-10 rounded-full object-cover border-2 border-slate-100 dark:border-slate-800"
              />
              {authUser?.isVerified && (
                <div className="absolute -top-0 -right-1 bg-white dark:bg-[#121212] rounded-full p-[1px]">
                  <BadgeCheck className="w-3.5 h-3.5 text-[#8b5cf6]" />
                </div>
              )}
            </div>
          </div>

          {/* Dropdown Menu */}
          {showProfile && (
            <div className="absolute right-0 mt-3 w-64 bg-white dark:bg-[#1e1e1e] rounded-2xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.15)] border border-slate-100 dark:border-slate-800 overflow-hidden z-[100] transform origin-top-right transition-all animate-in zoom-in-95 duration-200">
              <div className="p-4 border-b border-slate-50 dark:border-slate-800 bg-slate-50/50 dark:bg-[#121212]/50">
                <p className="font-bold text-slate-900 dark:text-white truncate">{user.fullName}</p>
                <p className="text-xs text-slate-500 truncate mb-2">{authUser?.email || 'agent@rentflowinsight.com'}</p>
                {authUser?.isVerified && (
                  <div className="flex items-center gap-1 text-[#8b5cf6] bg-purple-50 dark:bg-purple-900/30 w-fit px-2 py-0.5 rounded text-[10px] font-bold tracking-widest uppercase">
                    <CheckCircle className="w-3 h-3" />
                    Verified Agent
                  </div>
                )}
              </div>
              
              <div className="p-2 space-y-0.5 border-b border-slate-50 dark:border-slate-800">
                <Link to="/dashboard/agent/settings" onClick={() => setShowProfile(false)} className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <Settings className="w-4 h-4 text-slate-400" />
                  Account Settings
                </Link>
                <Link to="/agent-wallet" onClick={() => setShowProfile(false)} className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <Activity className="w-4 h-4 text-slate-400" />
                  Earning Logs
                </Link>
                <button onClick={() => setShowProfile(false)} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <LifeBuoy className="w-4 h-4 text-slate-400" />
                  Help & Support
                </button>
              </div>

              <div className="p-2">
                <button 
                  onClick={async () => {
                    setIsLoggingOut(true);
                    await logout();
                  }}
                  disabled={isLoggingOut} 
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold text-red-600 dark:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors ${isLoggingOut ? 'opacity-70 cursor-not-allowed' : 'cursor-pointer'}`}
                >
                  {isLoggingOut ? <Loader2 className="w-4 h-4 animate-spin" /> : <LogOut className="w-4 h-4" />}
                  {isLoggingOut ? 'Logging out...' : 'Sign out'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
