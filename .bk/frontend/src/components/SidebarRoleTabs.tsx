import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getMyRoles, switchRole } from '../services/rolesApi';
import { useNavigate } from 'react-router-dom';
import { Briefcase, User, GraduationCap, Building, Shield } from 'lucide-react';

export default function SidebarRoleTabs() {
  const { role, switchRoleMode, originalRole, updateSession } = useAuth();
  const navigate = useNavigate();
  const [activeRoles, setActiveRoles] = useState<string[]>([]);
  const [isSwitching, setIsSwitching] = useState(false);

  useEffect(() => {
    getMyRoles().then(res => {
       const userRoles = res.roles.filter(r => r.status === 'ACTIVE').map(r => r.role);
       if (originalRole === 'SUPER_ADMIN' && !userRoles.includes('SUPER_ADMIN')) {
         userRoles.unshift('SUPER_ADMIN');
       }
       setActiveRoles(userRoles);
    }).catch(console.error);
  }, [originalRole]);

  const getRoleRoute = (r: string) => {
    switch (r) {
      case 'FUNDER': return '/funder';
      case 'SUPER_ADMIN': return '/admin';
      case 'CEO':
      case 'CTO':
      case 'COO':
      case 'CFO':
      case 'CRM':
      case 'CMO': return '/staff'; // Executive tier default
      default: return '/dashboard'; // TENANT, AGENT typically resolve via AdaptiveConsumerDashboard at /dashboard
    }
  };

  const handleSwitch = async (targetRole: string) => {
    if (targetRole === role || isSwitching) return;
    setIsSwitching(true);
    
    const targetRoute = getRoleRoute(targetRole);

    try {
      if (originalRole === 'SUPER_ADMIN') {
         switchRoleMode(targetRole as any);
         navigate(targetRoute, { replace: true });
      } else {
         const res = await switchRole(targetRole);
         updateSession(res.access_token, res.user as any);
         navigate(targetRoute, { replace: true });
      }
    } catch (e) {
      console.error(e);
      switchRoleMode(targetRole as any);
      navigate(targetRoute, { replace: true });
    } finally {
      setIsSwitching(false);
    }
  };

  if (activeRoles.length <= 1) return null;

  return (
    <div className="px-6 py-4 border-b border-t border-slate-100 mb-2 mt-2 bg-slate-50/50">
      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Your Dashboards</p>
      <div className="flex flex-col gap-1.5">
        {activeRoles.map(r => {
          const isActive = r === role;
          return (
            <button
               key={r}
               disabled={isSwitching}
               onClick={() => handleSwitch(r)}
               className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-semibold transition-all w-full ${isActive ? 'bg-[#e0e7ff] text-[#4338ca] shadow-sm' : 'text-slate-500 hover:bg-white hover:text-slate-800 border border-transparent hover:border-slate-200'}`}
            >
               {r === 'TENANT' && <User className="w-4 h-4" />}
               {r === 'AGENT' && <Briefcase className="w-4 h-4" />}
               {r === 'LANDLORD' && <Building className="w-4 h-4" />}
               {r === 'FUNDER' && <GraduationCap className="w-4 h-4" />}
               {r === 'SUPER_ADMIN' && <Shield className="w-4 h-4" />}
               <span className="capitalize">{r.toLowerCase()}</span>
               
               {isActive && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-[#4338ca]" />}
            </button>
          );
        })}
      </div>
    </div>
  );
}
