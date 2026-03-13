import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth, type Role } from '../contexts/AuthContext';
import { 
  Home, 
  Wallet, 
  User, 
  LogOut, 
  FileText, 
  Users, 
  Settings, 
  Grid, 
  Search, 
  Briefcase 
} from 'lucide-react';

export default function DesktopSidebar() {
  const { role, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const menuItems: Record<NonNullable<Role>, Array<{icon: any, label: string, path: string}>> = {
    TENANT: [
      { icon: Home, label: 'Dashboard', path: '/dashboard' },
      { icon: Wallet, label: 'Wallet', path: '/dashboard/wallet' },
      { icon: FileText, label: 'Agreements', path: '/dashboard/agreements' },
      { icon: User, label: 'Profile', path: '/dashboard/profile' },
    ],
    AGENT: [
      { icon: Home, label: 'Home', path: '/dashboard' },
      { icon: Users, label: 'Clients', path: '/dashboard/clients' },
      { icon: Search, label: 'Tracking', path: '/dashboard/tracking' },
      { icon: Settings, label: 'Settings', path: '/dashboard/settings' },
    ],
    LANDLORD: [
      { icon: Grid, label: 'Dashboard', path: '/dashboard' },
      { icon: Home, label: 'Properties', path: '/dashboard/properties' },
      { icon: Users, label: 'Tenants', path: '/dashboard/tenants' },
      { icon: Wallet, label: 'Earnings', path: '/dashboard/earnings' },
    ],
    FUNDER: [
      { icon: Home, label: 'Home', path: '/dashboard' },
      { icon: Briefcase, label: 'Portfolio', path: '/dashboard/portfolio' },
      { icon: Wallet, label: 'Wallet', path: '/dashboard/wallet' },
      { icon: User, label: 'Profile', path: '/dashboard/profile' },
    ],
  };

  const activeMenuItems = role && menuItems[role] ? menuItems[role] : [];

  return (
    <aside className="hidden lg:flex flex-col w-64 h-screen bg-[#111827] text-white fixed left-0 top-0 border-r border-[#1f2937] z-50">
      <div className="p-6">
        <h1 className="text-2xl font-black tracking-tight text-white mb-1">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D8B4FE] to-[#FCA5A5]">Welile</span>
        </h1>
        <p className="text-xs font-semibold text-gray-400 tracking-widest uppercase">{role}</p>
      </div>

      <nav className="flex-1 px-4 space-y-2 mt-4">
        {activeMenuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path || (item.path !== '/dashboard' && location.pathname.startsWith(item.path));
          return (
            <button
              key={item.label}
              onClick={() => navigate(item.path)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition ${
                isActive 
                  ? 'bg-gradient-to-r from-[#915BFE] to-[#713BF0] text-white font-bold shadow-lg shadow-purple-500/20' 
                  : 'text-gray-400 hover:bg-[#1f2937] hover:text-white font-medium'
              }`}
            >
              <Icon size={20} />
              {item.label}
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-[#1f2937]">
        <button 
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition text-red-400 hover:bg-red-500/10 font-bold"
        >
          <LogOut size={20} />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
