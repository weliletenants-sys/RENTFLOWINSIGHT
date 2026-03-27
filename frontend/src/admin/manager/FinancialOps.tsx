import { useState, Suspense, lazy } from 'react';
import { Layers, ArrowDown, RefreshCw } from 'lucide-react';

const DepositRequestsManager = lazy(() => import('./components/DepositRequestsManager'));
const ManagerBankingLedger = lazy(() => import('./components/ManagerBankingLedger'));
const WithdrawalRequestsManager = lazy(() => import('./components/WithdrawalRequestsManager'));

const Loader = () => (
  <div className="h-64 flex items-center justify-center bg-white rounded-xl border border-gray-100 shadow-sm animate-pulse">
    <div className="w-8 h-8 rounded-full border-4 border-indigo-500 border-t-transparent animate-spin"></div>
  </div>
);

export default function FinancialOps() {
  const [activeTab, setActiveTab] = useState<'deposits' | 'withdrawals' | 'ledger'>('deposits');

  return (
    <div className="space-y-6 animate-in fade-in duration-500 font-inter">
      {/* Header Array */}
      <div>
        <h1 className="text-3xl font-black text-gray-900 tracking-tight">Financial Ops</h1>
        <p className="text-gray-500 font-medium mt-1">
          Forensics suite handling transaction queues, raw ledgers, and cash flow authorizations.
        </p>
      </div>

      {/* Modern Operations Tabs */}
      <div className="flex flex-wrap items-center gap-2 p-1 bg-gray-100 rounded-xl w-max">
        <button
          onClick={() => setActiveTab('deposits')}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-bold tracking-wide transition-all ${
            activeTab === 'deposits' 
              ? 'bg-white text-indigo-700 shadow-sm border border-gray-200/50' 
              : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200/50'
          }`}
        >
          <ArrowDown size={16} />
          Inbound Deposits (TID)
        </button>

        <button
          onClick={() => setActiveTab('withdrawals')}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-bold tracking-wide transition-all ${
            activeTab === 'withdrawals' 
              ? 'bg-white text-indigo-700 shadow-sm border border-gray-200/50' 
              : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200/50'
          }`}
        >
          <RefreshCw size={16} />
          Outward Cash-Outs
        </button>

        <button
          onClick={() => setActiveTab('ledger')}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-bold tracking-wide transition-all ${
            activeTab === 'ledger' 
              ? 'bg-white text-indigo-700 shadow-sm border border-gray-200/50' 
              : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200/50'
          }`}
        >
          <Layers size={16} />
          General Ledger Scan
        </button>
      </div>

      {/* Tab Render Area */}
      <div className="mt-8">
        <Suspense fallback={<Loader />}>
          {activeTab === 'deposits' && <DepositRequestsManager />}
          {activeTab === 'ledger' && <ManagerBankingLedger />}
          {activeTab === 'withdrawals' && <WithdrawalRequestsManager />}
        </Suspense>
      </div>

    </div>
  );
}
