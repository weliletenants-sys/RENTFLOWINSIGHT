import { useState, Suspense, lazy } from 'react';
import { Home, ShieldAlert, FileWarning } from 'lucide-react';

const TenantRentStatus = lazy(() => import('./components/TenantRentStatus'));
const EvictionPipeline = lazy(() => import('./components/EvictionPipeline'));

const Loader = () => (
  <div className="flex h-[40vh] items-center justify-center">
    <div className="w-8 h-8 border-4 border-red-600 border-t-transparent rounded-full animate-spin" />
  </div>
);

export default function TenantOps() {
  const [activeTab, setActiveTab] = useState<'status' | 'eviction'>('status');

  return (
    <div className="space-y-6 animate-in fade-in duration-500 font-inter">
      {/* Module Header */}
      <div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
          <Home className="text-red-500" size={32} />
          Tenant Compliance Operations
        </h1>
        <p className="text-slate-500 font-medium mt-1 text-sm md:text-base">
          Analyze global rent health, track overdue balances natively from the system wallets, and initiate formal legal blockages for repeat defaulters.
        </p>
      </div>

      {/* Tab Navigators */}
      <div className="bg-white p-1.5 rounded-xl border border-slate-200 inline-flex shadow-sm overflow-x-auto max-w-full">
        <button
          onClick={() => setActiveTab('status')}
          className={`px-5 py-2.5 rounded-lg text-sm font-bold tracking-wide transition-all min-w-max flex items-center gap-2 ${
            activeTab === 'status'
              ? 'bg-red-500 text-white shadow-md'
              : 'text-slate-500 hover:text-slate-700 hover:bg-slate-100'
          }`}
        >
          <ShieldAlert size={16} />
          Rent Compliance Matrices
        </button>
        <button
          onClick={() => setActiveTab('eviction')}
          className={`px-5 py-2.5 rounded-lg text-sm font-bold tracking-wide transition-all min-w-max flex items-center gap-2 ${
            activeTab === 'eviction'
              ? 'bg-red-500 text-white shadow-md'
              : 'text-slate-500 hover:text-slate-700 hover:bg-slate-100'
          }`}
        >
          <FileWarning size={16} />
          Eviction Pipeline Triggers
        </button>
      </div>

      {/* Embedded Terminal Routing */}
      <div className="pt-2">
        <Suspense fallback={<Loader />}>
          {activeTab === 'status' && <TenantRentStatus />}
          {activeTab === 'eviction' && <EvictionPipeline />}
        </Suspense>
      </div>
    </div>
  );
}
