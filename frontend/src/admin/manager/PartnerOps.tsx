import { useState, Suspense, lazy } from 'react';
import { Network, ShieldCheck, Activity } from 'lucide-react';

const PartnerIntegrationHub = lazy(() => import('./components/PartnerIntegrationHub'));
const ServiceCompliance = lazy(() => import('./components/ServiceCompliance'));

const Loader = () => (
  <div className="flex h-[40vh] items-center justify-center">
    <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
  </div>
);

export default function PartnerOps() {
  const [activeTab, setActiveTab] = useState<'integrations' | 'compliance'>('integrations');

  return (
    <div className="space-y-6 animate-in fade-in duration-500 font-inter">
      {/* Module Header */}
      <div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
          <Network className="text-indigo-600" size={32} />
          Partner & System Analytics
        </h1>
        <p className="text-slate-500 font-medium mt-1 text-sm md:text-base">
          Audit global KYC coverage percentages and verify external SLA latencies across major third-party webhook integrations.
        </p>
      </div>

      {/* Tab Navigators */}
      <div className="bg-white p-1.5 rounded-xl border border-slate-200 inline-flex shadow-sm overflow-x-auto max-w-full">
        <button
          onClick={() => setActiveTab('integrations')}
          className={`px-5 py-2.5 rounded-lg text-sm font-bold tracking-wide transition-all min-w-max flex items-center gap-2 ${
            activeTab === 'integrations'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'text-slate-500 hover:text-slate-700 hover:bg-slate-100'
          }`}
        >
          <Activity size={16} />
          Third-Party Data Hooks
        </button>
        <button
          onClick={() => setActiveTab('compliance')}
          className={`px-5 py-2.5 rounded-lg text-sm font-bold tracking-wide transition-all min-w-max flex items-center gap-2 ${
            activeTab === 'compliance'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'text-slate-500 hover:text-slate-700 hover:bg-slate-100'
          }`}
        >
          <ShieldCheck size={16} />
          KYC / AML Service Audits
        </button>
      </div>

      {/* Embedded Terminal App */}
      <div className="pt-2">
        <Suspense fallback={<Loader />}>
          {activeTab === 'integrations' && <PartnerIntegrationHub />}
          {activeTab === 'compliance' && <ServiceCompliance />}
        </Suspense>
      </div>
    </div>
  );
}
