import React, { useState } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Menu, Search, Bell, User as UserIcon, X, Maximize, ExternalLink } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { getSidebarConfig } from './executiveSidebarConfig';

interface ExecutiveDashboardLayoutProps {
  role?: string;
}

export const ExecutiveDashboardLayout: React.FC<ExecutiveDashboardLayoutProps> = ({ role = 'coo' }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const sidebarConfig = getSidebarConfig(role);

  // Derive page title from current URL mapping
  const currentPath = location.pathname;
  let pageTitle = 'Dashboard Command';
  let pageSubtitle = 'Operations Matrix';

  for (const section of sidebarConfig) {
    const item = section.items.find(i => i.path === currentPath);
    if (item) {
      pageTitle = item.title;
      pageSubtitle = section.sectionTitle;
      break;
    }
  }

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-[#111827] text-slate-300 w-64 border-r border-[#1f2937]">
      <div className="p-6 shrink-0 flex items-center justify-between">
        <div>
           <h2 className="text-xl font-bold text-white tracking-widest uppercase">Executive Hub</h2>
           <p className="text-xs text-[var(--color-primary)] font-semibold mt-1">Terminal: {role.toUpperCase()}</p>
        </div>
        <button className="lg:hidden text-slate-400 hover:text-white" onClick={() => setIsMobileMenuOpen(false)}>
           <X size={20} />
        </button>
      </div>

      <nav className="flex-1 px-4 pb-4 space-y-6 overflow-y-auto no-scrollbar">
        {sidebarConfig.map((section, idx) => (
          <div key={idx}>
             <h3 className="px-3 text-[10px] font-bold tracking-widest text-slate-500 uppercase mb-2">
                {section.sectionTitle}
             </h3>
             <div className="space-y-1">
                {section.items.map((item) => (
                   <NavLink
                     key={item.path}
                     to={item.path}
                     onClick={() => setIsMobileMenuOpen(false)}
                     className={({ isActive }) =>
                       `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors font-medium text-sm ${
                         isActive 
                           ? 'bg-[var(--color-primary)] text-white shadow-sm' 
                           : 'text-slate-400 hover:bg-[#1f2937] hover:text-white'
                       }`
                     }
                   >
                     <item.icon size={18} className={location.pathname === item.path ? 'text-white' : 'text-slate-500 group-hover:text-slate-300'} />
                     <span>{item.title}</span>
                   </NavLink>
                ))}
             </div>
          </div>
        ))}
      </nav>

      <div className="p-4 border-t border-[#1f2937] shrink-0">
        <button
          onClick={() => navigate('/admin/dashboard')}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 text-sm font-semibold text-slate-400 bg-[#1f2937]/50 hover:bg-[#1f2937] hover:text-white rounded-lg transition-colors"
        >
          <ExternalLink size={16} /> Exit Terminal
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen font-sans bg-[#f8fafc] text-slate-900 flex overflow-hidden">
      
      {/* Desktop Sidebar */}
      <div className="hidden lg:block z-40 h-screen shrink-0">
        <SidebarContent />
      </div>

      {/* Mobile Drawer Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 transform transition-transform duration-300 ease-in-out lg:hidden h-full ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <SidebarContent />
      </div>

      {/* Main Container */}
      <div className="flex-1 flex flex-col h-screen min-w-0 overflow-hidden">
        
        {/* Top Navbar */}
        <header className="h-16 shrink-0 bg-white border-b border-slate-200 flex items-center justify-between px-4 lg:px-8 z-30 shadow-sm">
          
          <div className="flex items-center gap-4">
            <button 
              className="p-2 -ml-2 lg:hidden text-slate-500 hover:bg-slate-100 rounded-lg transition-colors"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu size={24} />
            </button>
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold tracking-tight text-slate-900">
                {pageTitle}
              </h1>
              <p className="text-[11px] font-bold tracking-widest text-slate-400 uppercase">{pageSubtitle}</p>
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center space-x-2 sm:space-x-4">
             <div className="hidden md:flex relative group mr-2">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input 
                  type="text" 
                  placeholder="Global search..." 
                  className="pl-9 pr-4 py-1.5 bg-slate-100 border-transparent focus:bg-white focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary-light)] rounded-full text-sm outline-none transition-all w-48 focus:w-64"
                />
             </div>
             
             <button className="relative w-9 h-9 rounded-full bg-slate-50 text-slate-500 hover:bg-slate-100 border border-slate-200 transition-colors flex items-center justify-center">
               <Bell size={18} />
               <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
             </button>

             <div className="h-6 w-px bg-slate-200 mx-1 hidden sm:block"></div>

             <div className="flex items-center pl-2">
               <div className="hidden sm:flex flex-col text-right mr-3">
                 <span className="text-sm font-bold text-slate-800 leading-none mb-1">
                   {user?.firstName || 'Executive'}
                 </span>
                 <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider leading-none">
                   {user?.role || role.toUpperCase()} OPS
                 </span>
               </div>
               <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[var(--color-primary)] to-purple-600 border border-white shadow-sm overflow-hidden flex items-center justify-center text-white font-bold">
                 {user?.firstName?.charAt(0) || <UserIcon size={16} />}
               </div>
             </div>
          </div>
        </header>

        {/* Scrollable Main Native SPA Outlet */}
        <main className="flex-1 overflow-y-auto no-scrollbar scroll-smooth p-4 lg:p-6 xl:p-8 bg-slate-50/50">
          <div className="mx-auto max-w-screen-2xl h-full animate-in fade-in slide-in-from-bottom-2 duration-300">
            <Outlet />
          </div>
        </main>
      </div>

    </div>
  );
};
