import { ArrowLeft, KeyRound, Smartphone, Fingerprint, ShieldAlert, UserCog } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

export default function AgentSecurity() {
  const navigate = useNavigate();
  const { user, role } = useAuth();
  
  const [settings, setSettings] = useState({
    twoFactor: false,
    biometric: true,
  });

  const toggle = (key: keyof typeof settings) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="bg-[#f8f6f6] dark:bg-[#221610] min-h-screen text-slate-900 dark:text-slate-100 font-['Public_Sans'] pb-10">
      <div className="max-w-md mx-auto bg-white dark:bg-slate-900 min-h-screen shadow-sm border-x border-slate-100 dark:border-slate-800">
        
        <header className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-100 dark:border-slate-800 px-4 py-4 flex items-center justify-between">
          <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-lg font-bold">Security</h1>
          <div className="w-9" />
        </header>

        <div className="p-6 space-y-6">
          
          <button className="w-full flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-600 transition-colors">
            <div className="flex items-center gap-4">
              <div className="size-10 rounded-full bg-[#6d28d9]/10 text-[#6d28d9] flex items-center justify-center">
                <KeyRound size={20} />
              </div>
              <div className="text-left">
                <p className="font-bold text-sm">Change Password</p>
                <p className="text-xs text-slate-500">Last changed 3 months ago</p>
              </div>
            </div>
            <ArrowLeft size={16} className="text-slate-400 rotate-180" />
          </button>

          <section>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Authentication</h3>
            <div className="space-y-4 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-lg">
                    <Smartphone size={20} />
                  </div>
                  <div>
                    <p className="font-semibold text-sm">Two-Factor Auth</p>
                    <p className="text-xs text-slate-500">Secure with code via SMS</p>
                  </div>
                </div>
                <Toggle active={settings.twoFactor} onClick={() => toggle('twoFactor')} />
              </div>
              
              <hr className="border-slate-200 dark:border-slate-700" />
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 rounded-lg">
                    <Fingerprint size={20} />
                  </div>
                  <div>
                    <p className="font-semibold text-sm">Biometric Login</p>
                    <p className="text-xs text-slate-500">FaceID or Fingerprint</p>
                  </div>
                </div>
                <Toggle active={settings.biometric} onClick={() => toggle('biometric')} />
              </div>

            </div>
          </section>

          <section>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">User Roles</h3>
            <div className="space-y-4 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-100 dark:bg-purple-900/30 text-purple-600 rounded-lg">
                    <UserCog size={20} />
                  </div>
                  <div>
                    <p className="font-semibold text-sm">Active Role View</p>
                    <p className="text-xs text-slate-500">Currently viewing as</p>
                  </div>
                </div>
                <div className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full text-xs font-bold">
                  {role || 'None'}
                </div>
              </div>

              <hr className="border-slate-200 dark:border-slate-700" />

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-lg">
                    <UserCog size={20} />
                  </div>
                  <div>
                    <p className="font-semibold text-sm">Assigned Account Role</p>
                    <p className="text-xs text-slate-500">Primary registered role</p>
                  </div>
                </div>
                <div className="px-3 py-1 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-full text-xs font-bold">
                  {user?.role || 'None'}
                </div>
              </div>
            </div>
          </section>

          <div className="pt-4">
            <button className="w-full flex items-center justify-center gap-2 p-4 text-red-600 bg-red-50 hover:bg-red-100 dark:bg-red-900/10 dark:hover:bg-red-900/20 rounded-2xl transition-colors font-bold text-sm">
              <ShieldAlert size={18} />
              Deactivate Account
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}

function Toggle({ active, onClick }: { active: boolean, onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${active ? 'bg-[#6d28d9]' : 'bg-slate-300 dark:bg-slate-600'}`}
    >
      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${active ? 'translate-x-6' : 'translate-x-1'}`} />
    </button>
  );
}
