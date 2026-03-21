import { useState, useEffect } from 'react';
import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

export default function SuperAdminLayout() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    if (user && user.role !== 'SUPER_ADMIN') {
      navigate('/dashboard', { replace: true });
    }
  }, [user, navigate]);

  const searchParams = new URLSearchParams(location.search);
  const mode = searchParams.get('mode') || 'view';
  const isImpersonating = mode === 'impersonate';

  const navItems = [
    { name: 'Dashboard Access', path: '/admin/dashboard', icon: 'dashboard' },
    { name: 'User Management', path: '/admin/users', icon: 'group' },
    { name: 'Audit Logs', path: '/admin/audit', icon: 'receipt_long' },
    { name: 'System Config', path: '/admin/config', icon: 'settings' },
  ];

  const pageTitle = navItems.find((vi) => location.pathname === vi.path)?.name || 'Executive Portals Hub';

  return (
    <div className="font-body text-on-surface min-h-[max(884px,100dvh)] bg-surface flex selection:bg-primary/20 relative">
      
      {/* Global Security Banner - Z-Index 60 */}
      <div className={`fixed top-0 left-0 right-0 z-[60] h-1 w-full pointer-events-none ${isImpersonating ? 'bg-error' : 'bg-secondary-container'}`} />

      {/* Navigation Drawer - Z-Index 40 (As Requested) */}
      <aside className={`h-screen w-64 fixed left-0 top-0 bg-[#0B0F19] font-headline antialiased tracking-tight shadow-[4px_0px_24px_rgba(0,0,0,0.3)] z-40 flex flex-col py-8 px-4 transition-transform duration-300 pointer-events-auto ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
        <div className="mb-10 px-4">
          <span className="text-2xl font-bold text-white tracking-tighter">Sovereign</span>
        </div>

        <nav className="flex-1 space-y-2">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => setIsSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 active:scale-95 ${
                  isActive 
                  ? 'text-white bg-primary-container/10 shadow-[0_0_15px_rgba(146,52,235,0.3)] border-r-2 border-[#9234eb]' 
                  : 'text-gray-400 hover:text-gray-200 hover:bg-white/5 border-r-2 border-transparent'
                }`
              }
            >
              <span className={`material-symbols-outlined ${location.pathname === item.path ? 'active-icon' : ''}`} data-icon={item.icon}>{item.icon}</span>
              <span className="font-medium">{item.name}</span>
            </NavLink>
          ))}
        </nav>

        <div className="mt-auto px-4">
          <button 
            onClick={() => navigate('/dashboard')}
            className="w-full flex items-center justify-between py-4 border-t border-white/10 group cursor-pointer pointer-events-auto"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-primary-container flex items-center justify-center text-xs font-bold text-white">
                {user?.firstName?.charAt(0) || 'SU'}
              </div>
              <div className="flex flex-col text-left">
                <span className="text-xs text-white font-semibold group-hover:text-primary-fixed transition-colors">{user?.firstName || 'Admin Profile'}</span>
                <span className="text-[10px] text-gray-500">{user?.role === 'SUPER_ADMIN' ? 'Super User' : user?.role || 'Executive'}</span>
              </div>
            </div>
            <span className="material-symbols-outlined text-gray-500 group-hover:text-white transition-colors text-sm" data-icon="logout">logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content Wrapper - Content Z-Index 10 */}
      <main className="flex-1 lg:ml-64 min-h-screen bg-surface relative z-10 flex flex-col pt-20"> {/* PT-20 for absolute header space */}
        
        {/* TopAppBar - Z-Index 30 (As Requested) */}
        <header className="fixed top-0 left-0 right-0 lg:left-64 z-30 bg-[#faf8ff]/90 backdrop-blur-xl flex justify-between items-center px-6 lg:px-10 h-20 pointer-events-auto border-b border-outline-variant/5">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="lg:hidden p-2 rounded-full hover:bg-slate-100/50 transition-colors duration-300 text-primary-container cursor-pointer pointer-events-auto"
            >
              <span className="material-symbols-outlined" data-icon="menu">menu</span>
            </button>
            <h1 className="font-headline font-semibold text-slate-900 text-xl tracking-tight hidden sm:block">
              {pageTitle}
            </h1>
          </div>

          <div className="flex items-center gap-4 lg:gap-6">
            {/* Security Badge */}
            <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-bold tracking-widest uppercase ${
              isImpersonating 
                ? 'bg-error-container text-error shadow-[0_0_10px_rgba(186,26,26,0.2)]' 
                : 'bg-secondary-container text-on-secondary-container'
            }`}>
              <span className="material-symbols-outlined text-sm" style={{fontVariationSettings: "'FILL' 1"}}>
                {isImpersonating ? 'gpp_bad' : 'verified_user'}
              </span>
              {isImpersonating ? 'IMPERSONATION MODE' : 'VIEW MODE'}
            </div>

            <div className="flex items-center gap-4">
              <button className="relative p-2 rounded-full hover:bg-slate-100/50 transition-colors duration-300 text-slate-500 cursor-pointer pointer-events-auto">
                <span className="material-symbols-outlined" data-icon="notifications">notifications</span>
                <span className="absolute top-2 right-2 w-2 h-2 bg-error rounded-full border-2 border-surface"></span>
              </button>
              
              <div className="w-10 h-10 rounded-xl bg-surface-variant overflow-hidden shadow-sm hidden sm:block">
                <div className="w-full h-full flex items-center justify-center text-primary font-bold">
                  {user?.firstName?.charAt(0) || 'SU'}
                </div>
              </div>
            </div>
          </div>
        </header>

        {isImpersonating && (
          <div className="w-full bg-error text-on-error py-1.5 px-4 text-center text-xs font-bold tracking-widest uppercase z-30 shadow-md pointer-events-auto">
            Warning: Actions performed here will be permanently logged under the target user's identity.
          </div>
        )}

        {/* Page Canvas Container - Ensures content is exactly where it needs to be */}
        <div className="flex-1 p-6 lg:p-10 max-w-7xl mx-auto w-full relative z-10 pointer-events-auto">
          <Outlet />
        </div>

        {/* Mobile Drawer Overlay - Conditionally Rendered Modal Overlay (Z-Index 35) */}
        {isSidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[35] lg:hidden pointer-events-auto"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}
      </main>
    </div>
  );
}
