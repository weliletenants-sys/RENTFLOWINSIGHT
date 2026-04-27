import { useState, Suspense, lazy } from 'react';
import { Briefcase, Activity, AlertTriangle, Contact } from 'lucide-react';

const PartnerDirectory = lazy(() => import('./components/PartnerDirectory'));
const PartnerCapitalFlow = lazy(() => import('./components/PartnerCapitalFlow'));
const PartnerChurnAlerts = lazy(() => import('./components/PartnerChurnAlerts'));

// Legacy fallback components
const SupporterPoolBalanceCard = lazy(() => import('./components/SupporterPoolBalanceCard'));
const UserProfilesTable = lazy(() => import('./components/UserProfilesTable'));

const Loader = () => (
  <div className="flex h-[40vh] items-center justify-center">
    <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
  </div>
);

export default function PartnerOps() {
  const [activeTab, setActiveTab] = useState<'directory' | 'capital' | 'churn' | 'pool' | 'lookup'>('directory');

  return (
    <div className="space-y-8 animate-in fade-in duration-500 font-inter">
      {/* Module Header */}
      <div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3 font-outfit">
          <Briefcase className="text-emerald-600" size={32} />
          Partner Operations Center
        </h1>
        <p className="text-slate-500 font-medium mt-1 text-sm md:text-base">
          Command hub for tracking supporter engagement, capital deployments, and automated churn risk.
        </p>
      </div>

      {/* Modern Card Navigators */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {/* KPI Card 1 */}
        <div 
          onClick={() => setActiveTab('directory')}
          className={`p-6 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between h-32 ${activeTab === 'directory' ? 'border-emerald-500 bg-emerald-50 shadow-sm' : 'border-slate-100 hover:border-slate-200 bg-white'}`}
        >
           <div className="flex justify-between items-start">
              <span className={`text-sm font-bold tracking-wide ${activeTab === 'directory' ? 'text-emerald-800' : 'text-slate-600'}`}>VIP Directory</span>
              <Contact size={18} className={activeTab === 'directory' ? 'text-emerald-600' : 'text-slate-400'} />
           </div>
           <div className="font-black text-3xl font-outfit text-slate-800">892</div>
        </div>

        {/* KPI Card 2 */}
        <div 
          onClick={() => setActiveTab('capital')}
          className={`p-6 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between h-32 ${activeTab === 'capital' ? 'border-[var(--color-primary)] bg-[var(--color-primary-faint,#f4f0ff)] shadow-sm' : 'border-slate-100 hover:border-slate-200 bg-white'}`}
        >
           <div className="flex justify-between items-start">
              <span className={`text-sm font-bold tracking-wide ${activeTab === 'capital' ? 'text-[var(--color-primary-darker)]' : 'text-slate-600'}`}>Capital Flow</span>
              <Activity size={18} className={activeTab === 'capital' ? 'text-[var(--color-primary)]' : 'text-slate-400'} />
           </div>
           <div className="font-black text-3xl font-outfit text-slate-800 flex items-baseline gap-2">
               UGX 8.5M <span className="text-xs font-bold text-emerald-600 uppercase">+12%</span>
           </div>
        </div>

        {/* KPI Card 3 */}
        <div 
          onClick={() => setActiveTab('churn')}
          className={`p-6 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between h-32 ${activeTab === 'churn' ? 'border-red-500 bg-red-50 shadow-sm' : 'border-slate-100 hover:border-slate-200 bg-white'}`}
        >
           <div className="flex justify-between items-start">
              <span className={`text-sm font-bold tracking-wide ${activeTab === 'churn' ? 'text-red-800' : 'text-slate-600'}`}>Churn Alerts</span>
              <AlertTriangle size={18} className={activeTab === 'churn' ? 'text-red-600' : 'text-slate-400'} />
           </div>
           <div className="font-black text-3xl font-outfit text-red-600">3</div>
        </div>
      </div>

      <div className="flex gap-2">
          {/* Legacy toggles */}
          <button onClick={() => setActiveTab('pool')} className={`text-xs font-bold px-3 py-1.5 rounded-lg border ${activeTab === 'pool' ? 'bg-slate-800 text-white' : 'bg-white text-slate-500'}`}>Legacy Pool Ledger</button>
          <button onClick={() => setActiveTab('lookup')} className={`text-xs font-bold px-3 py-1.5 rounded-lg border ${activeTab === 'lookup' ? 'bg-slate-800 text-white' : 'bg-white text-slate-500'}`}>Legacy Profiles</button>
      </div>

      {/* Embedded Terminal Routing */}
      <div className="pt-2">
        <Suspense fallback={<Loader />}>
          {activeTab === 'directory' && <PartnerDirectory />}
          {activeTab === 'capital' && <PartnerCapitalFlow />}
          {activeTab === 'churn' && <PartnerChurnAlerts />}
          
          {/* Legacy */}
          {activeTab === 'pool' && <SupporterPoolBalanceCard />}
          {activeTab === 'lookup' && <UserProfilesTable />}
        </Suspense>
      </div>
    </div>
  );
}
