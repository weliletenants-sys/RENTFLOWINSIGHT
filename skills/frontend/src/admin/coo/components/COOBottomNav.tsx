import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, List, Users, CreditCard, AlertTriangle } from 'lucide-react';

const COOBottomNav: React.FC = () => {
  const navItems = [
    { name: 'Overview', icon: <Home size={22} />, path: '/coo/overview' },
    { name: 'Ledger', icon: <List size={22} />, path: '/coo/transactions' },
    { name: 'Partners', icon: <Users size={22} />, path: '/coo/partners' },
    { name: 'Withdrawals', icon: <CreditCard size={22} />, path: '/coo/withdrawals' },
    { name: 'Alerts', icon: <AlertTriangle size={22} />, path: '/coo/alerts' },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 h-16 flex items-center justify-around z-50 px-2 pb-safe">
      {navItems.map((item) => (
        <NavLink
          key={item.name}
          to={item.path}
          end={item.path === '/coo'}
          className={({ isActive }) =>
            `flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors ${
              isActive ? 'text-[#6c11d4]' : 'text-slate-400 hover:text-slate-600'
            }`
          }
        >
          {item.icon}
          <span className="text-[10px] font-medium font-inter">{item.name}</span>
        </NavLink>
      ))}
    </div>
  );
};

export default COOBottomNav;
