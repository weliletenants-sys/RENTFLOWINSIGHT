import { useState, Suspense, lazy } from 'react';
import { MapPin, ArrowUpRight, HandCoins } from 'lucide-react';

const AgentFloatManager = lazy(() => import('./components/AgentFloatManager'));
const IssueAdvanceSheet = lazy(() => import('./components/IssueAdvanceSheet'));

const Loader = () => (
  <div className="flex h-[40vh] items-center justify-center">
    <div className="w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full animate-spin" />
  </div>
);

export default function AgentOps() {
  const [activeTab, setActiveTab] = useState<'float' | 'advance'>('float');

  return (
    <div className="space-y-6 animate-in fade-in duration-500 font-inter">
      {/* Module Header */}
      <div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
          <MapPin className="text-purple-600" size={32} />
          Agent Field Operations
        </h1>
        <p className="text-slate-500 font-medium mt-1 text-sm md:text-base">
          Command macro-level cash limits, track real-time agent deployments, and issue daily capital advances securely to operations field-runners.
        </p>
      </div>

      {/* Tab Navigators */}
      <div className="bg-white p-1.5 rounded-xl border border-slate-200 inline-flex shadow-sm overflow-x-auto max-w-full">
        <button
          onClick={() => setActiveTab('float')}
          className={`px-5 py-2.5 rounded-lg text-sm font-bold tracking-wide transition-all min-w-max flex items-center gap-2 ${
            activeTab === 'float'
              ? 'bg-purple-600 text-white shadow-md'
              : 'text-slate-500 hover:text-slate-700 hover:bg-slate-100'
          }`}
        >
          <ArrowUpRight size={16} />
          Float Management Limits
        </button>
        <button
          onClick={() => setActiveTab('advance')}
          className={`px-5 py-2.5 rounded-lg text-sm font-bold tracking-wide transition-all min-w-max flex items-center gap-2 ${
            activeTab === 'advance'
              ? 'bg-purple-600 text-white shadow-md'
              : 'text-slate-500 hover:text-slate-700 hover:bg-slate-100'
          }`}
        >
          <HandCoins size={16} />
          Issue Cash Advance
        </button>
      </div>

      {/* Embedded Terminal Routing */}
      <div className="pt-2">
        <Suspense fallback={<Loader />}>
          {activeTab === 'float' && <AgentFloatManager />}
          {activeTab === 'advance' && <IssueAdvanceSheet />}
        </Suspense>
      </div>
    </div>
  );
}
