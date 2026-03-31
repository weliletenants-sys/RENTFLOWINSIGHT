import { useState } from 'react';
import { Link } from 'react-router-dom';
import { X, LayoutDashboard, Users, FileText, Wallet, Settings, LogOut, Loader2, Home, Trophy } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface AgentSidebarProps {
  activePage?: string;
  onNavigate?: (page: string) => void;
  isOpen?: boolean;
  onClose?: () => void;
}

const navItems = [
  { label: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5" />, path: '/dashboard' },
  { label: 'My Tenants', icon: <Users className="w-5 h-5" />, path: '/dashboard/agent/clients' },
  { label: 'Rent Requests', icon: <FileText className="w-5 h-5" />, path: '/agent-rent-requests' },
  { label: 'Wallet & Earnings', icon: <Wallet className="w-5 h-5" />, path: '/dashboard/agent/earnings' },
  { label: 'Properties', icon: <Home className="w-5 h-5" />, path: '/agent-managed-properties' },
  { label: 'Rank & Goals', icon: <Trophy className="w-5 h-5" />, path: '/rank-system' },
];

export default function AgentSidebar({ activePage = 'Dashboard', onNavigate, isOpen, onClose }: AgentSidebarProps) {
  const { logout } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    await logout();
  };

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      
      <aside className={`fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-[#e2e8f0] dark:bg-[#121212] dark:border-slate-800 flex-col min-h-screen h-[100dvh] transform transition-transform duration-300 ease-in-out lg:sticky lg:top-0 lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'} flex`}>
        {/* Logo */}
        <div className="p-6 flex items-center justify-between">
          <img src="/welile-colored.png" alt="Welile Logo" className="h-8 object-contain dark:hidden" />
          <img src="/welile-white.png" alt="Welile Logo" className="h-8 object-contain hidden dark:block" />
          <button className="lg:hidden p-2 -mr-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors cursor-pointer" onClick={onClose}>
            <X className="w-5 h-5" />
          </button>
        </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-2 space-y-1 overflow-y-auto sidebar-scroll">
        {navItems.map((item) => {
          const isActive = item.label === activePage || item.path === window.location.pathname;
          return (
            <Link
              key={item.label}
              to={item.path || '#'}
              onClick={(e) => {
                if (!item.path || item.path === '#') {
                  e.preventDefault();
                }
                onNavigate?.(item.label);
              }}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-all ${isActive ? 'text-white shadow-lg bg-[#8b5cf6]' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100'}`}
            >
              <span className={isActive ? 'text-white' : ''}>{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          );
        })}

        <div className="space-y-1 pt-4 border-t border-slate-100 dark:border-slate-800 mt-4">
          <Link
            to="/dashboard/agent/settings"
            onClick={() => onNavigate?.('Settings')}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-all ${activePage === 'Settings' ? 'bg-[#8b5cf6] text-white shadow-lg' : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100'}`}
          >
            <Settings className="w-5 h-5" />
            <span>Account Settings</span>
          </Link>

        </div>
      </nav>

      {/* Extreme Bottom Logout Section */}
      <div className="w-full mt-auto">
        <div className="border-t border-slate-100 dark:border-slate-800" />
        <div className="p-4">
          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className={`w-full flex items-center gap-3 px-3 py-2 text-sm font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors ${isLoggingOut ? 'opacity-70 cursor-not-allowed' : 'cursor-pointer'}`}
          >
            {isLoggingOut ? <Loader2 className="w-5 h-5 animate-spin" /> : <LogOut className="w-5 h-5" />}
            <span>{isLoggingOut ? 'Logging out...' : 'Log Out'}</span>
          </button>
        </div>
      </div>
    </aside>
    </>
  );
}
