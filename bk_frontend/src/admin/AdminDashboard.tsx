import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert, Users, Database } from 'lucide-react';
import RoleSwitcher from '../components/RoleSwitcher';
import WelileAIIDBadge from '../components/layout/WelileAIIDBadge';

export default function AdminDashboard() {
  const { profile, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <header className="bg-[#0f172a] text-white py-6 px-10 flex justify-between items-center shadow-md">
        <div className="flex items-center gap-4">
          <img src="/welile-colored.png" alt="Welile Logo" className="h-8 object-contain brightness-0 invert" />
          <div className="w-px h-6 bg-slate-700"></div>
          <span className="font-bold tracking-widest text-sm uppercase text-slate-300">System Administration</span>
        </div>
        <div className="flex items-center gap-6">
          <WelileAIIDBadge />
          <div className="text-right">
            <p className="text-sm font-bold">{profile?.full_name || 'Admin User'}</p>
            <p className="text-xs text-slate-400 uppercase tracking-wider">{profile?.role || 'Root Access'}</p>
          </div>
          <button 
            onClick={handleLogout}
            className="px-4 py-2 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-lg transition-colors text-sm font-bold"
          >
            Revoke Session
          </button>
        </div>
      </header>
      
      {/* Role Switcher Bar embedded in Admin Dashboard */}
      <div className="bg-[#1e293b] px-10 py-3 border-b border-slate-700">
         <RoleSwitcher />
      </div>

      <main className="max-w-screen-xl mx-auto p-10 mt-6">
        <div className="mb-12">
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Root Terminal</h1>
          <p className="text-slate-500 mt-2 font-medium">Global system configuration and master data management.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow cursor-pointer">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-xl w-max mb-6">
              <Users size={24} />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">User Matrix</h3>
            <p className="text-slate-500 text-sm">Manage global authorization, override roles, and audit access logs across all tiers.</p>
          </div>

          <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow cursor-pointer">
            <div className="p-3 bg-purple-50 text-purple-600 rounded-xl w-max mb-6">
              <Database size={24} />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Ledger Config</h3>
            <p className="text-slate-500 text-sm">Force syncs, view master financial queries, and run raw data migrations.</p>
          </div>

          <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow cursor-pointer">
            <div className="p-3 bg-red-50 text-red-600 rounded-xl w-max mb-6">
              <ShieldAlert size={24} />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Security Rules</h3>
            <p className="text-slate-500 text-sm">Adjust system-wide rate limits, firewall IP blocks, and KYC global overrides.</p>
          </div>
        </div>
      </main>
    </div>
  );
}
