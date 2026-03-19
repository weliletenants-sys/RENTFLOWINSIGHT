import { Link } from 'react-router-dom';
import { LayoutDashboard, Rocket, Banknote, FileText, Settings, LogOut, Building2, Wallet } from 'lucide-react';

interface FunderSidebarProps {
  activePage?: string;
  onNewsupport?: () => void;
}

const navItems = [
  { label: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5" />, path: '/funder' },
  { label: 'Properties', icon: <Building2 className="w-5 h-5" />, path: '/funder/properties' },
  { label: 'Opportunities', icon: <Rocket className="w-5 h-5" />, path: '#' },
  { label: 'Payouts', icon: <Banknote className="w-5 h-5" />, path: '#' },
  { label: 'Wallet', icon: <Wallet className="w-5 h-5" />, path: '/funder/wallet' },
  { label: 'Reports', icon: <FileText className="w-5 h-5" />, path: '/funder/reports' },
];

export default function FunderSidebar({ activePage = 'Dashboard' }: FunderSidebarProps) {
  return (
    <aside className="hidden lg:flex w-72 bg-white border-r border-[var(--color-primary-border)] flex-col sticky top-0 h-screen z-40">
      {/* Logo */}
      <div className="p-6 flex items-center">
        <img src="/welile-colored.png" alt="Welile Logo" className="h-8 object-contain" />
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-2 space-y-1 overflow-y-auto sidebar-scroll">
        {navItems.map((item) => {
          const isActive = item.label === activePage;
          return (
            <Link
              key={item.label}
              to={item.path}
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
          <Link
            to="/"
            className="flex items-center gap-3 px-3 py-2 text-sm font-bold text-red-500 hover:text-red-600 transition-colors cursor-pointer"
          >
            <LogOut className="w-5 h-5" />
            <span>Log Out</span>
          </Link>
        </div>
      </div>
      
    </aside>
  );
}
