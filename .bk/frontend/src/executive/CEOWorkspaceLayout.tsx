import { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  Menu, Search, Bell, Activity, Users, Wallet,
  LineChart, Briefcase, Plus, LayoutDashboard
} from 'lucide-react';

export default function CEOWorkspaceLayout({ children }: { children?: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { user, logout } = useAuth();

  const navItems = [
    { name: 'Platform Overview', path: '/admin/executive/ceo', icon: LayoutDashboard },
    { name: 'Revenue & Growth', path: '/admin/executive/ceo/revenue', icon: LineChart },
    { name: 'Users & Coverage', path: '/admin/executive/ceo/users', icon: Users },
    { name: 'Financial Health', path: '/admin/executive/ceo/health', icon: Wallet },
    { name: 'Staff Performance', path: '/admin/executive/ceo/staff', icon: Activity },
    { name: 'Angel Pool', path: '/admin/executive/ceo/angel', icon: Briefcase },
  ];

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-white border-r border-[#e2e8f0] font-sans">
      <div className="p-6 pb-8">
        {/* Simulating the bold Welile logo from the screenshot */}
        <h2 className="text-2xl font-extrabold text-[#0B0F19] tracking-tighter">
          Welile
        </h2>
      </div>

      <div className="px-4 text-xs font-semibold text-slate-400 uppercase tracking-widest mb-4">
        Discover
      </div>

      <nav className="flex-1 px-3 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === '/admin/executive/ceo'}
            onClick={() => setIsSidebarOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 ${
                isActive 
                  ? 'bg-purple-50 text-purple-700 font-semibold shadow-sm' 
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900 font-medium'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <item.icon size={18} className={isActive ? 'text-purple-600' : 'text-slate-400'} />
                <span className="text-[13px]">{item.name}</span>
              </>
            )}
          </NavLink>
        ))}

        <button className="flex items-center gap-3 px-3 py-2.5 mt-8 text-slate-500 hover:text-slate-900 transition-colors w-full text-left">
          <Plus size={18} className="text-slate-400" />
          <span className="text-[13px] font-medium">Edit Dashboard</span>
        </button>
      </nav>
    </div>
  );

  return (
    <div className="flex flex-col h-screen w-full bg-[#f8fafc] font-sans overflow-hidden">
      
      {/* Super Top Admin Bar (Purple) exactly as shown in screenshot */}
      <div className="h-8 shrink-0 bg-[#8b5cf6] flex items-center justify-between px-4 z-50 shadow-sm border-b border-purple-700">
        <div className="text-white text-xs font-semibold tracking-wide">CEO</div>
        <div className="flex items-center gap-2 px-3 py-0.5 bg-white/20 rounded-md">
          <div className="w-4 h-4 bg-white/40 rounded-full flex items-center justify-center">
            <div className="w-2 h-2 bg-white rounded-full"></div>
          </div>
          <span className="text-white text-[11px] font-bold">CEO</span>
        </div>
        <button 
          onClick={logout}
          className="text-white/90 hover:text-white text-[11px] font-semibold transition-colors flex items-center gap-1 cursor-pointer"
        >
          Sign Out
        </button>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Desktop Sidebar */}
        <div className="hidden lg:block w-64 shrink-0 z-40 bg-white">
          <SidebarContent />
        </div>

        {/* Mobile Drawer Overlay */}
        {isSidebarOpen && (
          <div 
            className="fixed inset-0 bg-slate-900/40 z-40 lg:hidden backdrop-blur-sm transition-opacity"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Mobile Sidebar */}
        <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white transform transition-transform duration-300 ease-in-out lg:hidden ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <SidebarContent />
        </div>

        {/* Main Content Pane */}
        <div className="flex-1 flex flex-col min-w-0">
          
          {/* Dashboard Header */}
          <header className="h-[72px] shrink-0 bg-white border-b border-[#e2e8f0] flex items-center justify-between px-4 md:px-8 z-30 relative shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)]">
            <div className="flex items-center gap-4">
              <button 
                className="p-2 -ml-2 lg:hidden text-slate-500 hover:bg-slate-100 rounded-lg transition-colors"
                onClick={() => setIsSidebarOpen(true)}
              >
                <Menu size={20} />
              </button>
              <div className="hidden lg:block p-1 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer mr-2">
                 <Menu size={20} />
              </div>
              <h1 className="text-xl font-bold text-slate-900 tracking-tight">CEO Overview</h1>
            </div>

            <div className="flex items-center gap-4 md:gap-6">
              <div className="hidden md:flex relative group">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input 
                  type="text" 
                  placeholder="Search metrics..." 
                  className="pl-10 pr-4 py-2 bg-slate-100 hover:bg-slate-200/80 focus:bg-white border focus:border-purple-500 border-transparent rounded-full text-[13px] outline-none transition-all w-56 focus:w-72 shadow-inner"
                />
              </div>

              <button className="relative p-2 text-slate-400 hover:text-slate-600 transition-colors">
                <Bell size={20} />
              </button>

              <div className="h-8 w-px bg-slate-200 hidden md:block"></div>

              <div className="flex items-center gap-3 cursor-pointer group">
                <div className="w-9 h-9 rounded-full bg-indigo-600 flex items-center justify-center text-white text-sm font-bold shadow-sm group-hover:shadow-md transition-shadow">
                  {user?.firstName?.charAt(0) || 'T'}
                </div>
                <div className="hidden md:block text-left">
                  <p className="text-[13px] font-bold text-slate-900 leading-none">{user?.firstName || 'Test'} {user?.lastName || 'CEO'}</p>
                </div>
              </div>
            </div>
          </header>

          {/* Render Area */}
          <main className="flex-1 overflow-y-auto no-scrollbar bg-[#f8fafc]">
             {children ? children : <Outlet />}
          </main>

        </div>
      </div>
    </div>
  );
}
