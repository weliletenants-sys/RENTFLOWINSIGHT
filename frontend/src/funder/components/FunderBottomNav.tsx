import { Home, PieChart, ClipboardList, User } from 'lucide-react';

interface FunderBottomNavProps {
  activePage?: string;
}

const navItems = [
  { label: 'Home', icon: <Home className="w-6 h-6" /> },
  { label: 'Portfolio', icon: <PieChart className="w-6 h-6" /> },
  { label: 'Activity', icon: <ClipboardList className="w-6 h-6" /> },
  { label: 'Account', icon: <User className="w-6 h-6" /> },
];

export default function FunderBottomNav({ activePage = 'Home' }: FunderBottomNavProps) {
  return (
    <nav
      className="lg:hidden fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] bg-white rounded-[28px] py-4 px-6 flex justify-between items-center z-50 border border-[var(--color-primary-border)]"
      style={{ boxShadow: '0 25px 60px var(--color-primary-shadow)' }}
    >
      {navItems.map((item) => {
        const isActive = item.label === activePage;
        return (
          <button
            key={item.label}
            className={`flex flex-col items-center gap-1 transition-opacity ${
              isActive ? 'opacity-100' : 'opacity-40 hover:opacity-70'
            }`}
          >
            <span style={isActive ? { color: 'var(--color-primary)' } : { color: '#374151' }}>
              {item.icon}
            </span>
            <span
              className="text-[9px] font-bold uppercase tracking-wider"
              style={isActive ? { color: 'var(--color-primary)' } : { color: '#374151' }}
            >
              {item.label}
            </span>
            {isActive && (
              <div
                className="w-1 h-1 rounded-full"
                style={{ background: 'var(--color-primary)' }}
              />
            )}
          </button>
        );
      })}
    </nav>
  );
}
