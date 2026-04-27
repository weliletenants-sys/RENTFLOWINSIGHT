import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    // Force dark mode on mounting the layout
    document.documentElement.classList.add('dark');
    return () => {
      document.documentElement.classList.remove('dark');
    };
  }, []);

  if (!user || user.role !== 'SUPER_ADMIN') {
    return (
      <div className="flex bg-white h-screen items-center justify-center text-[#ffb4ab]">
        Unauthorized. Clearance Level 4 Required.
      </div>
    );
  }

  const navItems = [
    { label: 'System Overview', icon: 'dashboard', path: '/admin/dashboard', active: location.pathname === '/admin/dashboard' },
    { label: 'User Matrix', icon: 'table_chart', path: '/admin/users', active: location.pathname === '/admin/users' },
    { label: 'Role Intelligence', icon: 'psychology', path: '/admin/intelligence', active: location.pathname === '/admin/intelligence' },
    { label: 'Audit Logs', icon: 'history', path: '/admin/audit', active: location.pathname === '/admin/audit' },
    { label: 'Identity & Access', icon: 'fingerprint', path: '/admin/identity', active: location.pathname === '/admin/identity' },
    { label: 'Global Config', icon: 'settings', path: '/admin/config', active: location.pathname === '/admin/config' },
  ];

  const platformViews = [
    { label: 'CEO View', icon: 'monitoring', path: '/ceo/dashboard' },
    { label: 'COO View', icon: 'account_tree', path: '/coo/dashboard' },
    { label: 'CFO View', icon: 'account_balance', path: '/cfo' },
    { label: 'Funder Portal', icon: 'payments', path: '/funder' },
    { label: 'Agent Hub', icon: 'real_estate_agent', path: '/dashboard/agent/clients' },
    { label: 'Tenant View', icon: 'door_front', path: '/dashboard/tenant/profile' },
  ];

  return (
    <div className="bg-white text-slate-900 font-inter selection:bg-[#9234eb]/30 min-h-screen relative">
      
      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 transition-opacity"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* NavigationDrawer Shell */}
      <aside className={`fixed left-0 top-0 h-full flex flex-col z-50 w-64 bg-white border-r border-slate-200 transform transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-6">
          <span className="text-xl font-black tracking-tighter text-[#9234eb]">WELILE</span>
        </div>
        <nav className="flex-1 px-4 space-y-1 mt-4 overflow-y-auto pb-4 custom-scrollbar">
          <div className="mb-2 mt-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-4">System Settings</div>
          {navItems.map((item, idx) => (
            <button
              key={idx}
              onClick={() => { navigate(item.path); setIsSidebarOpen(false); }}
              className={`flex items-center gap-3 w-full text-left px-4 py-2 rounded-lg transition-all duration-150 ${
                item.active 
                  ? 'bg-slate-50 text-[#9234eb] font-bold' 
                  : 'text-slate-500 hover:bg-slate-50 hover:text-[#9234eb]'
              }`}
            >
              <span className="material-symbols-outlined text-lg" data-icon={item.icon}>{item.icon}</span>
              <span className="font-label text-[11px] uppercase tracking-wider">{item.label}</span>
            </button>
          ))}

          <div className="mt-8 mb-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-4">Platform Views</div>
          {platformViews.map((item, idx) => (
            <button
              key={`pv-${idx}`}
              onClick={() => { navigate(item.path); setIsSidebarOpen(false); }}
              className="flex items-center gap-3 w-full text-left px-4 py-2 rounded-lg transition-all duration-150 text-slate-500 hover:bg-[#9234eb]/10 hover:text-[#9234eb]"
            >
              <span className="material-symbols-outlined text-lg opacity-80" data-icon={item.icon}>{item.icon}</span>
              <span className="font-label text-[11px] uppercase tracking-wider">{item.label}</span>
            </button>
          ))}
        </nav>
        
        <div className="p-4 border-t border-slate-200">
          <div className="flex items-center gap-3 p-2 bg-slate-100 rounded-lg">
            <div className="w-8 h-8 rounded-full bg-[#9234eb] flex items-center justify-center text-[10px] font-bold text-white">SA</div>
            <div className="flex flex-col">
              <span className="text-xs font-bold leading-none">Super Admin</span>
              <span className="text-[10px] font-label text-slate-500">Lvl 4 Clearance</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Wrapper */}
      <main className="min-h-screen flex flex-col transition-all duration-300">
        {/* TopAppBar */}
        <header className="flex justify-between items-center w-full px-4 sm:px-6 h-14 sticky top-0 bg-white/70 backdrop-blur-xl z-30 border-b border-slate-200 shadow-[0_20px_40px_rgba(146,52,235,0.08)]">
          <div className="flex items-center gap-4">
            <button onClick={() => setIsSidebarOpen(true)} className="text-slate-500 hover:text-[#9234eb] flex items-center shrink-0">
               <span className="material-symbols-outlined text-2xl">menu</span>
            </button>
            <span className="material-symbols-outlined text-[#9234eb] cursor-pointer hidden sm:block" data-icon="search">search</span>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[#4edea3] animate-pulse shadow-[0_0_8px_#4EDEA3]"></div>
              <span className="font-label text-xs tracking-widest text-[#4edea3] font-bold uppercase">System: Operational</span>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-4 text-slate-500 font-label text-[10px] tracking-tighter uppercase">
              <span className="opacity-50">Local Time:</span>
              <span>{new Date().toISOString().split('T')[1].slice(0, 8)} UTC</span>
            </div>
            <img 
              alt="Admin Avatar" 
              className="w-8 h-8 rounded-full border border-[#9234eb]/20" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAx0uLZxcf3aKzagPFEnbJDur3DgHWmfq18awgMNPEn8GidAb2ZrT8SwrQQ1WTo8m79eB_fJ3gNguzuC3NZfreNytiBHhgQ1RtsOz5Ygf1qVo0mvUpOEU8FsQmghufAxkNSavihFwm_7d5crbOPFcrZrGXFsbAM0788Kq2YU50l-lySkUg0cYHPZkP7f9RYsxGzIztZkKA8jB8D1GOVkNEmGZnBjEK9cxySy1kSLa3fcFL_rmhAEUrSWm-nvxrmsgqsjtySAhODUjjc"
            />
          </div>
        </header>

        {/* Dashboard Canvas (Children injection) */}
        {children}

      </main>

      {/* Contextual FAB */}
      <div className="fixed bottom-6 right-6 flex flex-col items-end gap-3 pointer-events-none">
        <div className="bg-[#393939]/80 backdrop-blur px-4 py-2 rounded-full border border-[#9234eb]/20 shadow-2xl pointer-events-auto cursor-help opacity-0 hover:opacity-100 transition-opacity">
          <span className="font-label text-[10px] uppercase tracking-widest text-[#9234eb] font-bold">Press ⌘ + K for Command Palette</span>
        </div>
      </div>
      
    </div>
  );
}
