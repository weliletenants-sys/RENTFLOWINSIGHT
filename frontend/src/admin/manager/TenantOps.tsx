import { useState, Suspense, lazy } from 'react';
import { Home, CalendarClock, Target, Zap } from 'lucide-react';

const TenantOverviewList = lazy(() => import('./components/TenantOverviewList'));
const DailyPaymentTracker = lazy(() => import('./components/DailyPaymentTracker'));
const TenantRentCollector = lazy(() => import('./components/TenantRentCollector'));

// Legacy fallback components to not break execution
const TenantRentStatus = lazy(() => import('./components/TenantRentStatus'));
const EvictionPipeline = lazy(() => import('./components/EvictionPipeline'));

const Loader = () => (
  <div className="flex h-[40vh] items-center justify-center">
    <div className="w-8 h-8 border-4 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin" />
  </div>
);

export default function TenantOps() {
  const [activeTab, setActiveTab] = useState<'overview' | 'daily' | 'collect' | 'status' | 'eviction'>('overview');

  return (
    <div className="space-y-8 animate-in fade-in duration-500 font-inter">
      {/* Module Header */}
      <div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3 font-outfit">
          <Home className="text-[var(--color-primary)]" size={32} />
          Tenant Operations Center
        </h1>
        <p className="text-slate-500 font-medium mt-1 text-sm md:text-base">
          Command hub for tracking rent compliance, live daily deductions, and manual force-collections.
        </p>
      </div>

      {/* Modern Card Navigators */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {/* KPI Card 1 */}
        <div 
          onClick={() => setActiveTab('overview')}
          className={`p-6 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between h-32 ${activeTab === 'overview' ? 'border-[var(--color-primary)] bg-[var(--color-primary-faint,#f4f0ff)] shadow-sm' : 'border-slate-100 hover:border-slate-200 bg-white'}`}
        >
           <div className="flex justify-between items-start">
              <span className={`text-sm font-bold tracking-wide ${activeTab === 'overview' ? 'text-[var(--color-primary-darker)]' : 'text-slate-600'}`}>Global Directory</span>
              <Target size={18} className={activeTab === 'overview' ? 'text-[var(--color-primary)]' : 'text-slate-400'} />
           </div>
           <div className="font-black text-3xl font-outfit text-slate-800">4,192</div>
        </div>

        {/* KPI Card 2 */}
        <div 
          onClick={() => setActiveTab('daily')}
          className={`p-6 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between h-32 ${activeTab === 'daily' ? 'border-amber-500 bg-amber-50 shadow-sm' : 'border-slate-100 hover:border-slate-200 bg-white'}`}
        >
           <div className="flex justify-between items-start">
              <span className={`text-sm font-bold tracking-wide ${activeTab === 'daily' ? 'text-amber-800' : 'text-slate-600'}`}>Daily Repayment Queue</span>
              <CalendarClock size={18} className={activeTab === 'daily' ? 'text-amber-600' : 'text-slate-400'} />
           </div>
           <div className="font-black text-3xl font-outfit text-slate-800 flex items-baseline gap-2">
               45 <span className="text-xs font-bold text-slate-400 uppercase">Expected</span>
           </div>
        </div>

        {/* KPI Card 3 */}
        <div 
          onClick={() => setActiveTab('collect')}
          className={`p-6 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between h-32 ${activeTab === 'collect' ? 'border-red-500 bg-red-50 shadow-sm' : 'border-slate-100 hover:border-slate-200 bg-white'}`}
        >
           <div className="flex justify-between items-start">
              <span className={`text-sm font-bold tracking-wide ${activeTab === 'collect' ? 'text-red-800' : 'text-slate-600'}`}>Force Collection</span>
              <Zap size={18} className={activeTab === 'collect' ? 'text-red-600' : 'text-slate-400'} />
           </div>
           <div className="font-black text-xl font-outfit text-red-700 mt-2">Deduct specific wallets</div>
        </div>
      </div>

      <div className="flex gap-2">
          {/* Legacy toggles just in case */}
          <button onClick={() => setActiveTab('status')} className={`text-xs font-bold px-3 py-1.5 rounded-lg border ${activeTab === 'status' ? 'bg-slate-800 text-white' : 'bg-white text-slate-500'}`}>Legacy Status</button>
          <button onClick={() => setActiveTab('eviction')} className={`text-xs font-bold px-3 py-1.5 rounded-lg border ${activeTab === 'eviction' ? 'bg-slate-800 text-white' : 'bg-white text-slate-500'}`}>Legacy Eviction</button>
      </div>

      {/* Embedded Terminal Routing */}
      <div className="pt-2">
        <Suspense fallback={<Loader />}>
          {activeTab === 'overview' && <TenantOverviewList />}
          {activeTab === 'daily' && <DailyPaymentTracker />}
          {activeTab === 'collect' && <TenantRentCollector />}
          
          {/* Legacy Components */}
          {activeTab === 'status' && <TenantRentStatus />}
          {activeTab === 'eviction' && <EvictionPipeline />}
        </Suspense>
      </div>
    </div>
  );
}
