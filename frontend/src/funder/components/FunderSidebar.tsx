import {
  LayoutDashboard,
  PieChart,
  Rocket,
  ArrowLeftRight,
  Banknote,
  Wallet,
  FileText,
  Settings,
} from 'lucide-react';

interface FunderSidebarProps {
  activePage?: string;
  onNewsupport?: () => void; // Ghost prop kept temporarily so FunderDashboard doesn't throw a type error
}

const navItems = [
  { label: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
  { label: 'Portfolio', icon: <PieChart className="w-5 h-5" /> },
  { label: 'Opportunities', icon: <Rocket className="w-5 h-5" /> },
  { label: 'Transactions', icon: <ArrowLeftRight className="w-5 h-5" /> },
  { label: 'Payouts', icon: <Banknote className="w-5 h-5" /> },
  { label: 'Wallet', icon: <Wallet className="w-5 h-5" /> },
  { label: 'Reports', icon: <FileText className="w-5 h-5" /> },
];

export default function FunderSidebar({ activePage = 'Dashboard' }: FunderSidebarProps) {
  return (
    <aside className="hidden lg:flex w-72 bg-white border-r border-[var(--color-primary-border)] flex-col sticky top-0 h-screen z-40">
      {/* Logo */}
      <div className="p-6 flex items-center gap-3">
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center"
          style={{ background: 'var(--color-primary)', boxShadow: '0 4px 12px var(--color-primary-shadow)' }}
        >
          <Wallet className="w-5 h-5 text-white" />
        </div>
        <h2 className="text-xl font-bold tracking-tight text-slate-900">Welile</h2>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-2 space-y-1 overflow-y-auto sidebar-scroll">
        {navItems.map((item) => {
          const isActive = item.label === activePage;
          return (
            <a
              key={item.label}
              href="#"
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
            </a>
          );
        })}

        <div className="pt-4 mt-4 border-t border-[var(--color-primary-border)]">
          <a
            href="#"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold text-slate-500 hover:bg-slate-50 hover:text-slate-900 transition-all"
          >
            <Settings className="w-5 h-5" />
            <span>Account Settings</span>
          </a>
        </div>
      </nav>
      
      {/* 
        New support CTA was temporarily removed per user request:
        "for now remove supports in the sidebar"
      */}
      
    </aside>
  );
}
