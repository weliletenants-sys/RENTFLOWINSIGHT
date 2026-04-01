import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, Bell, Search, CheckCircle, Info, Settings, LogOut, FileText, BadgeCheck, Loader2 } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import WelileAIIDBadge from '../../components/layout/WelileAIIDBadge';

interface TenantDashboardHeaderProps {
  user: { fullName: string; role: string; avatarUrl?: string; isVerified?: boolean };
  onNotificationClick?: () => void;
  onAvatarClick?: () => void;
  onMenuClick?: () => void;
}

export default function TenantDashboardHeader({
  user, onNotificationClick, onAvatarClick, onMenuClick
}: TenantDashboardHeaderProps) {
  const [showNotifs, setShowNotifs] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const { logout, user: authUser } = useAuth();
  
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
         setShowNotifs(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
         setShowProfile(false);
      }
    }
    if (showNotifs || showProfile) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showNotifs, showProfile]);

  const unreadCount = 0; 
  const avatarImage = (authUser as any)?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${authUser?.firstName || 'Tenant'}&backgroundColor=0f3b7d`;

  return (
    <div className="flex sticky top-0 z-30 px-6 lg:px-12 min-h-[5rem] items-center justify-between border-b border-slate-100 bg-white shadow-sm w-full">
      {/* Left Menu Toggle (Mobile Only) */}
      <div className="flex items-center gap-3 w-1/4">
        <button 
          onClick={onMenuClick}
          className="lg:hidden p-2 -ml-2 text-slate-500 hover:text-slate-800 transition-colors"
        >
          <Menu className="w-6 h-6" />
        </button>
      </div>

      {/* Center Search Bar */}
      <div className="flex-1 flex justify-start lg:justify-start lg:-ml-12">
        <div className="relative w-full max-w-[400px]">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search transactions, assets..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border-none rounded-md text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all font-medium"
          />
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center justify-end w-1/4 gap-6">
        
        <div className="hidden sm:block">
          <WelileAIIDBadge />
        </div>

        <div className="flex items-center gap-5" ref={notifRef}>
          <button 
            onClick={() => setShowNotifs(!showNotifs)} 
            className="text-slate-500 hover:text-slate-700 transition-colors relative"
          >
            <Bell strokeWidth={2} className="w-5 h-5" />
          </button>
          
          <button className="text-slate-500 hover:text-slate-700 transition-colors hidden sm:block">
            <Settings strokeWidth={2} className="w-5 h-5" />
          </button>

          {showNotifs && (
            <div className="absolute top-14 right-16 w-80 bg-white rounded-xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.15)] border border-slate-100 overflow-hidden z-50 transform origin-top-right">
              <div className="p-4 text-center">
                 <Info className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                 <p className="text-sm font-semibold text-slate-600">No new notifications</p>
              </div>
            </div>
          )}
        </div>

        {/* Profile Dropdown */}
        <div className="relative" ref={profileRef}>
          <button
            className="flex items-center gap-2 cursor-pointer focus:outline-none hover:scale-105 transition-transform"
            onClick={() => setShowProfile(!showProfile)}
          >
            <div className="relative">
              <img 
                src={avatarImage} 
                alt={user.fullName} 
                className="w-9 h-9 rounded-full object-cover shadow-sm bg-slate-100" 
              />
              {authUser?.isVerified && (
                <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-[1px]">
                  <BadgeCheck className="w-3.5 h-3.5 text-blue-600" />
                </div>
              )}
            </div>
          </button>

          {showProfile && (
            <div className="absolute right-0 mt-3 w-56 bg-white rounded-xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] border border-slate-100 overflow-hidden z-50">
              <div className="p-4 border-b border-slate-50 bg-slate-50">
                <p className="font-bold text-slate-800 text-sm truncate">{user.fullName}</p>
                <p className="text-xs text-slate-500 truncate mb-1">{authUser?.email || 'tenant@rentflow.com'}</p>
              </div>
              
              <div className="p-2 space-y-0.5 border-b border-slate-50">
                <Link to="/settings" onClick={() => setShowProfile(false)} className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-semibold text-slate-600 hover:bg-[#f4f7fa] hover:text-[#0f3b7d] transition-colors">
                  <Settings className="w-4 h-4" /> Account
                </Link>
                <Link to="/my-receipts" onClick={() => setShowProfile(false)} className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-semibold text-slate-600 hover:bg-[#f4f7fa] hover:text-[#0f3b7d] transition-colors">
                  <FileText className="w-4 h-4" /> Transactions
                </Link>
              </div>

              <div className="p-2">
                <button 
                  onClick={async () => {
                    setIsLoggingOut(true);
                    await logout();
                  }}
                  disabled={isLoggingOut} 
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-bold text-slate-500 hover:bg-red-50 hover:text-red-600 transition-colors ${isLoggingOut ? 'opacity-70 cursor-not-allowed' : 'cursor-pointer'}`}
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
