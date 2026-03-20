import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { Menu, Search, Bell, User, LayoutDashboard, Activity, Target, Users, BookOpen, FileText } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export default function ExecutiveLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  const role: string = user?.role || '';

  // Navigation config driven by RBAC
  const navItems = [
    { name: 'CEO Overview', path: '/executive/ceo', icon: LayoutDashboard, allowed: ['CEO', 'SUPER_ADMIN'] },
    { name: 'CTO Operations', path: '/executive/cto', icon: Activity, allowed: ['CTO', 'SUPER_ADMIN'] },
    { name: 'CMO Metrics', path: '/executive/cmo', icon: Target, allowed: ['CMO', 'SUPER_ADMIN'] },
    { name: 'CRM Hub', path: '/executive/crm', icon: Users, allowed: ['CRM', 'SUPER_ADMIN'] },
    { name: 'CFO Ledger', path: '/executive/cfo', icon: BookOpen, allowed: ['CFO', 'SUPER_ADMIN'] },
    { name: 'COO Dashboard', path: '/executive/coo', icon: FileText, allowed: ['COO', 'SUPER_ADMIN'] },
  ];

  const visibleNavItems = navItems.filter((item) => item.allowed.includes(role));

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-[#111827] text-gray-300 w-64 border-r border-gray-800">
      <div className="p-6">
        <h2 className="text-xl font-bold text-white tracking-widest uppercase">Executive Hub</h2>
        <p className="text-xs text-purple-400 mt-1">{user?.role?.replace('_', ' ')} Access</p>
      </div>

      <nav className="flex-1 px-4 space-y-1 overflow-y-auto no-scrollbar">
        {visibleNavItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            onClick={() => setIsSidebarOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                isActive ? 'bg-purple-600 text-white' : 'hover:bg-gray-800 hover:text-white'
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
          &larr; Back to Main Portal
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F0F2F5] dark:bg-[#0B0F19] text-gray-900 dark:text-gray-100 flex overflow-hidden">
      
      {/* Desktop Sidebar (Fixed Left) */}
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

      {/* Mobile Sidebar Drawer */}
      <div className={`fixed inset-y-0 left-0 z-50 transform transition-transform duration-300 ease-in-out lg:hidden ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <SidebarContent />
      </div>

      {/* Main Content Wrapper */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden lg:pl-0">
        
        {/* Top Navbar */}
        <header className="h-16 shrink-0 bg-white/80 dark:bg-[#111827]/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 flex items-center justify-between px-4 lg:px-8 z-30 sticky top-0">
          
          <div className="flex items-center gap-4">
            {/* Mobile Menu Toggle */}
            <button 
              className="p-2 lg:hidden text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
              onClick={() => setIsSidebarOpen(true)}
            >
              <Menu size={24} />
            </button>
            <h1 className="text-xl font-bold tracking-tight hidden sm:block">
              {visibleNavItems.find((vi) => location.pathname.includes(vi.path))?.name || 'Executive Command'}
            </h1>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-3 lg:gap-5">
            <div className="hidden md:flex relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="text" 
                placeholder="Search metrics..." 
                className="pl-10 pr-4 py-2 bg-gray-100 dark:bg-gray-800 border-transparent focus:bg-white dark:focus:bg-[#1f2937] focus:border-purple-500 rounded-full text-sm outline-none transition-all w-48 focus:w-64"
              />
            </div>

            <button className="relative p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors">
              <Bell size={20} />
            </button>

            <div className="h-8 w-px bg-gray-200 dark:bg-gray-800 mx-1"></div>

            <button 
              className="flex items-center gap-3 p-1 pr-3 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-purple-600 flex items-center justify-center text-white shadow-sm">
                {user?.firstName?.charAt(0) || <User size={16} />}
              </div>
              <div className="hidden md:block text-left">
                <p className="text-sm font-semibold leading-none mb-1">{user?.firstName || 'Executive'}</p>
                <p className="text-xs text-gray-500 leading-none">{user?.role}</p>
              </div>
            </button>
          </div>
        </header>

        {/* Scrollable Main Area rendering strictly guarded Outlet routes */}
        <main className="flex-1 overflow-y-auto no-scrollbar scroll-smooth p-4 lg:p-8">
          <div className="mx-auto max-w-7xl animate-in fade-in slide-in-from-bottom-4 duration-500">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
