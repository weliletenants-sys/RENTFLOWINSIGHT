import { useState, useEffect } from 'react';
import axios from 'axios';
import { UserCircle2, Briefcase, Home, Shield, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

interface Role {
  id: string;
  role: string;
  assigned_at: string;
}

/**
 * Validates and displays the authorized Role Switcher directly inside the Profile view.
 * Strictly relies on REST API backend architecture (api.md) for switching contexts.
 * Discards any standalone Frontend derivation or generic LocalStorage spoofing.
 */
export default function ProfileRoleSwitcher() {
  const [activeRoles, setActiveRoles] = useState<Role[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSwitching, setIsSwitching] = useState<string | null>(null);

  // Hard pull from backend authorized tokens
  useEffect(() => {
    const fetchAuthorizedRoles = async () => {
      try {
        const res = await axios.get('/api/roles/my-roles');
        if (res.data?.success && Array.isArray(res.data.data)) {
           setActiveRoles(res.data.data);
        }
      } catch (e: any) {
        if (e.response && e.response.status !== 401) {
          toast.error('Unable to fetch authorized personas from security module.');
        }
      } finally {
        setIsLoading(false);
      }
    };
    fetchAuthorizedRoles();
  }, []);

  const initiateRoleSwitch = async (targetRole: string) => {
    setIsSwitching(targetRole);
    try {
      // Execute rigid REST architectural call per api.md rules restricting Frontend-logic
      const res = await axios.post('/api/roles/sessions/active', { target_role: targetRole });
      
      if (res.data?.success) {
         toast.success(`Identity active: ${targetRole.toUpperCase()}`);
         // Trigger DOM refresh mapping to the targeted Layout module securely.
         setTimeout(() => {
           window.location.href = '/dashboard';
         }, 800);
      }
    } catch (e: any) {
      if (e.response && e.response.data && e.response.data.detail) {
        // Obey RFC 7807 problem details parsing
        toast.error(`Context Switch Rejected: ${e.response.data.detail}`);
      } else {
        toast.error('Critical failure orchestrating persona authentication bounds.');
      }
    } finally {
      setIsSwitching(null);
    }
  };

  const getRoleIcon = (roleName: string) => {
    switch (roleName.toLowerCase()) {
      case 'agent': return <Briefcase size={20} className="text-[#6c11d4]" />;
      case 'landlord': return <Home size={20} className="text-amber-500" />;
      case 'supporter': return <Shield size={20} className="text-green-500" />;
      case 'tenant': default: return <UserCircle2 size={20} className="text-blue-500" />;
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center p-6 animate-pulse text-[#6c11d4]">
        <Loader2 className="animate-spin" />
      </div>
    );
  }

  // Hide the switcher if they don't have multiple hats
  if (activeRoles.length <= 1) return null;

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-sm border border-slate-100 dark:border-slate-700 mt-6">
      <h3 className="text-sm font-extrabold text-[#6c11d4] uppercase tracking-widest mb-4">Switch Dashboard Context</h3>
      <p className="text-xs text-slate-500 dark:text-slate-400 mb-4 leading-relaxed">
        You are authorized across multiple systems. Tap below to securely restructure your active dashboard.
      </p>

      <div className="space-y-3">
        {activeRoles.map((r) => (
          <button
            key={r.id}
            onClick={() => initiateRoleSwitch(r.role)}
            disabled={isSwitching !== null}
            className="w-full flex items-center justify-between p-4 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-[#6c11d4]/50 hover:bg-[#6c11d4]/5 transition-all text-left bg-slate-50 dark:bg-slate-900 group disabled:opacity-50"
          >
            <div className="flex items-center gap-4">
              <div className="p-2 bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-100 dark:border-slate-700 group-hover:scale-110 transition-transform">
                {getRoleIcon(r.role)}
              </div>
              <div>
                <p className="font-bold text-slate-900 dark:text-white capitalize">{r.role.replace('_', ' ')} Dashboard</p>
                <p className="text-xs text-slate-500">Access your {r.role} privileges</p>
              </div>
            </div>
            
            {isSwitching === r.role ? (
               <Loader2 size={18} className="text-[#6c11d4] animate-spin" />
            ) : (
               <div className="size-6 rounded-full bg-slate-200 dark:bg-slate-700 group-hover:bg-[#6c11d4] flex items-center justify-center transition-colors">
                  <div className="w-1.5 h-1.5 bg-slate-400 group-hover:bg-white rounded-full"></div>
               </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
