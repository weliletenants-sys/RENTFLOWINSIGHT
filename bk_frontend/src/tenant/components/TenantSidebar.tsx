import { useState } from 'react';
import { Link } from 'react-router-dom';
import { LayoutDashboard, Building2, TrendingUp, Settings, LogOut, Loader2, HelpCircle, Receipt } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import SidebarRoleTabs from '../../components/SidebarRoleTabs';

interface TenantSidebarProps {
  activePage?: string;
  onNavigate?: (page: string) => void;
  isOpen?: boolean;
  onClose?: () => void;
}

const navItems = [
  { label: 'Dashboard', icon: <LayoutDashboard strokeWidth={2} className="w-5 h-5" />, path: '/dashboard' },
  { label: 'Rent Schedule', icon: <Building2 strokeWidth={2} className="w-5 h-5" />, path: '/payment-schedule' },
  { label: 'Transactions', icon: <Receipt strokeWidth={2} className="w-5 h-5" />, path: '/my-receipts' },
  { label: 'Projections', icon: <TrendingUp strokeWidth={2} className="w-5 h-5" />, path: '/calculator' },
  { label: 'Settings', icon: <Settings strokeWidth={2} className="w-5 h-5" />, path: '/settings' },
];

export default function TenantSidebar({ activePage = 'Dashboard', onNavigate, isOpen, onClose }: TenantSidebarProps) {
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
      
      <aside className={`fixed inset-y-0 left-0 z-50 w-[260px] bg-white border-r border-slate-100 flex-col min-h-screen h-[100dvh] transform transition-transform duration-300 ease-in-out lg:sticky lg:top-0 lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'} flex`}>
        {/* Logo Section */}
        <div className="p-8 pb-10 flex items-center justify-between">
          <div className="flex flex-col">
            <h1 className="text-xl font-bold tracking-tight text-[#0f3b7d]">WELILE</h1>
            <p className="text-[10px] font-semibold text-slate-400 tracking-widest mt-0.5">TENANT PORTAL</p>
          </div>
        </div>

        {/* Dynamic Role Switcher Tass */}
        <SidebarRoleTabs />

        {/* Navigation List */}
        <nav className="flex-1 flex flex-col space-y-1">
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
                  if (onClose) onClose(); 
                }}
                className={`flex items-center gap-4 px-8 py-3.5 relative transition-all duration-200 group ${isActive ? 'bg-[#f4f7fa]' : 'hover:bg-slate-50'}`}
              >
                {isActive && (
                   <div className="absolute left-0 top-0 bottom-0 w-[4px] bg-[#1a56db]" />
                )}
                <span className={`${isActive ? 'text-[#1a56db]' : 'text-slate-500 group-hover:text-slate-700'}`}>
                  {item.icon}
                </span>
                <span className={`text-sm font-semibold tracking-wide ${isActive ? 'text-[#1a56db]' : 'text-slate-600 group-hover:text-slate-900'}`}>
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>

        {/* Bottom Section - Upgrade Style CTA and Logout */}
        <div className="pb-8 px-6 space-y-6">
           <div className="w-full">
              <button className="w-full bg-[#032f7a] hover:bg-[#021f52] shadow-[0_4px_12px_rgba(3,47,122,0.25)] text-white font-bold text-sm py-3 rounded-full transition-colors active:scale-95">
                Support Hub
              </button>
           </div>
           
           <div className="flex flex-col gap-2 pt-4">
              <button className="w-full flex items-center gap-3 px-3 py-2 text-sm font-semibold text-slate-500 hover:text-slate-800 transition-colors">
                <HelpCircle className="w-5 h-5 text-slate-400" />
                Help Center
              </button>
              <button
                onClick={handleLogout}
                disabled={isLoggingOut}
                className={`w-full flex items-center gap-3 px-3 py-2 text-sm font-semibold transition-colors ${isLoggingOut ? 'opacity-70 cursor-not-allowed text-slate-400' : 'text-slate-500 hover:text-red-600'}`}
              >
                {isLoggingOut ? <Loader2 className="w-5 h-5 animate-spin" /> : <LogOut className="w-5 h-5" />}
                <span>{isLoggingOut ? 'Logging out...' : 'Logout'}</span>
              </button>
           </div>
        </div>
      </aside>
    </>
  );
}
