import { useAuth } from '../contexts/AuthContext';
import type { Role } from '../contexts/AuthContext';
import { clsx } from 'clsx';
import { useNavigate } from 'react-router-dom';

export default function RoleSwitcher() {
  const { role, originalRole, switchRoleMode } = useAuth();
  const navigate = useNavigate();
  
  // Base roles available to switch for testing or multi-role users
  let roles: Role[] = ['TENANT', 'AGENT', 'LANDLORD', 'FUNDER'];
  
  // If the user's true authoritative role is SUPER_ADMIN, completely unlock the switcher
  if (originalRole === 'SUPER_ADMIN') {
    roles = ['SUPER_ADMIN', ...roles];
  }

  const handleSwitch = (r: Role) => {
    switchRoleMode(r);
    if (window.location.pathname !== '/dashboard') {
      navigate('/dashboard');
    }
  };

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-2 border border-white/20 mb-4 flex overflow-x-auto custom-scrollbar no-scrollbar gap-2 max-w-full">
      {roles.map((r) => (
        <button
          key={r}
          onClick={() => handleSwitch(r)}
          className={clsx(
            'px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all border border-transparent',
            role === r 
              ? 'bg-white text-purple-900 shadow-sm border-white' 
              : 'text-purple-100 hover:bg-white/20 hover:border-white/30'
          )}
        >
          {r} View
        </button>
      ))}
    </div>
  );
}
