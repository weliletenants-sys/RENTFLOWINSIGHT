import { useState } from 'react';
import { Link } from 'react-router-dom';
import { X, LayoutDashboard, Rocket, FileText, Settings, LogOut, Building2, Wallet, Loader2, Users } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface FunderSidebarProps {
  activePage?: string;
  onNavigate?: (page: string) => void;
  onNewsupport?: () => void; // Ghost prop kept temporarily so FunderDashboard doesn't throw a type error
  isOpen?: boolean;
  onClose?: () => void;
}

const navItems = [
  { label: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5" />, path: '/funder' },
  { label: 'Portfolio', icon: <Building2 className="w-5 h-5" />, path: '/funder/portfolio' },
  { label: 'Opportunities', icon: <Rocket className="w-5 h-5" />, path: '/funder/opportunities' },
  { label: 'Wallet', icon: <Wallet className="w-5 h-5" />, path: '/funder/wallet' },
  { label: 'Reports', icon: <FileText className="w-5 h-5" />, path: '/funder/reports' },
  { label: 'Network', icon: <Users className="w-5 h-5" />, path: '/funder/referrals' },
];

export default function FunderSidebar({ activePage = 'Dashboard', onNavigate, isOpen, onClose }: FunderSidebarProps) {
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
      
      <aside className={`fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-[var(--color-primary-border)] flex-col min-h-screen h-[100dvh] transform transition-transform duration-300 ease-in-out lg:sticky lg:top-0 lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'} flex`}>
        {/* Logo */}
        <div className="p-6 flex items-center justify-between">
          <img src="/welile-colored.png" alt="Welile Logo" className="h-8 object-contain" />
          <button className="lg:hidden p-2 -mr-2 text-slate-400 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer" onClick={onClose}>
            <X className="w-5 h-5" />
          </button>
        </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-2 space-y-1 overflow-y-auto sidebar-scroll">
        {navItems.map((item) => {
          const isActive = item.label === activePage;
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
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-all"
              style={
                isActive
                  ? {
                      background: 'var(--color-primary)',
                      color: '#fff',
                      boxShadow: '0 4px 12px var(--color-primary-shadow)',
                    }
                  : undefined
              }
            >
              <span className={isActive ? 'text-white' : 'text-slate-400'}>{item.icon}</span>
              <span className={isActive ? 'text-white' : 'text-slate-600'}>{item.label}</span>
            </Link>
          );
        })}

        <div className="space-y-1">
          <Link
            to="/funder/account"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold text-slate-500 hover:bg-slate-50 hover:text-slate-900 transition-all cursor-pointer"
            style={
              activePage === 'Settings' || activePage === 'Account'
                ? {
                    background: 'var(--color-primary)',
                    color: '#fff',
                    boxShadow: '0 4px 12px var(--color-primary-shadow)',
                  }
                : undefined
            }
          >
            <Settings className={activePage === 'Settings' || activePage === 'Account' ? 'text-white w-5 h-5' : 'w-5 h-5'} />
            <span className={activePage === 'Settings' || activePage === 'Account' ? 'text-white' : ''}>Account Settings</span>
          </Link>

        </div>
      </nav>

      {/* Extreme Bottom Logout Section */}
      <div className="w-full mt-auto">
        <div className="border-t border-[var(--color-primary-border)]" />
        <div className="p-4">
          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className={`w-full flex items-center gap-3 px-3 py-2 text-sm font-bold text-red-500 hover:bg-red-50 rounded-lg transition-colors ${isLoggingOut ? 'opacity-70 cursor-not-allowed' : 'cursor-pointer'}`}
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
