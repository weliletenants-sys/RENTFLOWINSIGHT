import { useState } from 'react';
import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Menu, Search, Bell, User, LayoutDashboard, Database, Activity, MapPin } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export default function ManagerLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { name: 'Command Center', path: '/admin/manager/dashboard', icon: LayoutDashboard },
    { name: 'Financial Ops', path: '/admin/manager/financial-ops', icon: Activity },
    { name: 'Company Staff', path: '/admin/manager/staff', icon: Shield },
    { name: 'Field Management', path: '/admin/manager/field', icon: MapPin },
    { name: 'Ledger Audit', path: '/admin/manager/ledger', icon: Database },
  ];

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-[#111827] text-gray-300 w-64 border-r border-gray-800">
      <div className="p-6">
        <h2 className="text-xl font-bold text-white tracking-widest uppercase mb-1">Ops Hub</h2>
        <div className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-purple-500/10 text-purple-400">
          MANAGER ACCESS
        </div>
      </div>

      <nav className="flex-1 px-4 space-y-1 overflow-y-auto no-scrollbar">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            onClick={() => setIsSidebarOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                isActive ? 'bg-purple-600 text-white shadow-md shadow-purple-900/20' : 'hover:bg-gray-800 hover:text-white'
              }`
            }
          >
            <item.icon size={20} />
            <span className="font-medium text-sm">{item.name}</span>
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-800">
        <button
          onClick={() => navigate('/dashboard')}
          className="w-full text-left px-3 py-2 text-sm text-gray-400 hover:text-white transition-colors"
        >
          &larr; Back to Platform
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F0F2F5] dark:bg-[#0B0F19] text-gray-900 dark:text-gray-100 flex overflow-hidden font-inter">
      
      {/* Desktop Sidebar */}
      <div className="hidden lg:block z-40">
        <SidebarContent />
      </div>

      {/* Mobile Drawer Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 transform transition-transform duration-300 ease-in-out lg:hidden ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <SidebarContent />
      </div>

      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        
        {/* Top Navbar */}
        <header className="h-16 shrink-0 bg-white/80 dark:bg-[#111827]/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 flex items-center justify-between px-4 lg:px-8 z-30 sticky top-0">
          
          <div className="flex items-center gap-4">
            <button 
              className="p-2 lg:hidden text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
              onClick={() => setIsSidebarOpen(true)}
            >
              <Menu size={24} />
            </button>
            <h1 className="text-xl font-bold tracking-tight hidden sm:block">
              {navItems.find((vi) => location.pathname.includes(vi.path))?.name || 'Operations Command'}
            </h1>
          </div>

          <div className="flex items-center gap-3 lg:gap-5">
            <div className="hidden md:flex relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="text" 
                placeholder="Search TID or user..." 
                className="pl-10 pr-4 py-2 bg-gray-100 dark:bg-gray-800 border-transparent focus:bg-white dark:focus:bg-[#1f2937] focus:border-purple-500 rounded-full text-sm outline-none transition-all w-48 focus:w-64"
              />
            </div>

            <button className="relative p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors">
              <Bell size={20} />
            </button>

            <div className="h-8 w-px bg-gray-200 dark:bg-gray-800 mx-1"></div>

            <button className="flex items-center gap-3 p-1 pr-3 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-500 to-indigo-600 flex items-center justify-center text-white shadow-sm">
                {user?.firstName?.charAt(0) || <User size={16} />}
              </div>
              <div className="hidden md:block text-left">
                <p className="text-sm font-semibold leading-none mb-1">{user?.firstName || 'System Manager'}</p>
                <p className="text-xs text-gray-500 leading-none">{user?.role?.replace('_', ' ')}</p>
              </div>
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto no-scrollbar p-6 lg:p-10">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
