import { useAuth } from '../contexts/AuthContext';
import type { Role } from '../contexts/AuthContext';
import { clsx } from 'clsx';

export default function RoleSwitcher() {
  const { role, switchRoleMode } = useAuth();
  const roles: Role[] = ['TENANT', 'AGENT', 'LANDLORD', 'FUNDER'];

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-2 border border-white/20 mb-4 flex overflow-x-auto custom-scrollbar no-scrollbar gap-2 max-w-full">
      {roles.map((r) => (
        <button
          key={r}
          onClick={() => switchRoleMode(r)}
          className={clsx(
            'px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all',
            role === r 
              ? 'bg-white text-purple-900 shadow-sm' 
              : 'text-purple-100 hover:bg-white/10'
          )}
        >
          {r} View
        </button>
      ))}
    </div>
  );
}
