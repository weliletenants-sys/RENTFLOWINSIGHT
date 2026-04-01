import { Link } from 'react-router-dom';
import { Wallet, Briefcase, LayoutDashboard, FileText, TrendingUp } from 'lucide-react';

interface FunderBottomNavProps {
  activePage: string;
}

export default function FunderBottomNav({ activePage }: FunderBottomNavProps) {
  const tabs = [
    { label: 'Wallet', icon: Wallet, href: '/funder/wallet' },
    { label: 'Portfolio', icon: Briefcase, href: '/funder/portfolio' },
    { label: 'Dashboard', icon: LayoutDashboard, href: '/funder', isMiddle: true },
    { label: 'Projections', icon: TrendingUp, href: '/funder/projections' },
    { label: 'Reports', icon: FileText, href: '/funder/reports' },
  ];

  return (
    <>
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 z-[90] pb-safe shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
        <div className="flex items-start justify-around px-2 pt-2 pb-2 shrink-0 relative">
          {tabs.map((tab) => {
            const isActive = activePage === tab.label;

            if (tab.isMiddle) {
              return (
                <div key={tab.label} className="relative -mt-6 flex flex-col items-center z-10 mx-1 group">
                  <Link 
                    to={tab.href}
                    className={`flex items-center justify-center w-[60px] h-[60px] rounded-full border-[4px] border-white transition-all duration-300 active:scale-95 bg-[var(--color-primary)] overflow-hidden relative ${
                      isActive 
                        ? 'shadow-[0_8px_20px_var(--color-primary-shadow)] -translate-y-1' 
                        : 'shadow-lg hover:-translate-y-0.5 hover:shadow-[0_8px_15px_rgba(0,0,0,0.1)]'
                    }`}
                  >
                    {/* Add a subtle shine effect overlay */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/20 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                    
                    <img 
                      src="/welile-logo-white.png" 
                      alt="Welile Logo" 
                      className="w-10 h-10 object-contain drop-shadow-sm transition-transform duration-300 group-hover:scale-110" 
                    />
                  </Link>
                  <span className={`block text-center text-[9px] font-black mt-1.5 tracking-widest uppercase transition-colors duration-300 ${
                    isActive ? 'text-[var(--color-primary)]' : 'text-slate-500'
                  }`}>
                    {tab.label}
                  </span>
                </div>
              );
            }

            return (
              <Link
                key={tab.label}
                to={tab.href}
                className="flex flex-col items-center justify-center w-[18%] gap-1 group mt-2"
              >
                <div className={`p-1 rounded-xl transition-colors ${
                  isActive ? 'bg-[var(--color-primary-light)] text-[var(--color-primary)]' : 'text-slate-400 group-hover:bg-slate-50 group-hover:text-slate-600'
                }`}>
                  <tab.icon className={`w-[18px] h-[18px] ${isActive ? 'stroke-[2.5px]' : 'stroke-2'}`} />
                </div>
                <span className={`text-[9px] font-bold tracking-wide transition-colors ${
                  isActive ? 'text-[var(--color-primary)]' : 'text-slate-400 group-hover:text-slate-600'
                }`}>
                  {tab.label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
      
      {/* Spacer to prevent content from hiding behind the fixed bottom bar on mobile */}
      <div className="h-24 lg:hidden w-full shrink-0" />
    </>
  );
}
