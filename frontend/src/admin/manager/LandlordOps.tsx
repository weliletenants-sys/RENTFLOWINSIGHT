import { useState, Suspense, lazy } from 'react';
import { Building2, Banknote, UserPlus } from 'lucide-react';

const LandlordDisbursements = lazy(() => import('./components/LandlordDisbursements'));
const OnboardLandlordForm = lazy(() => import('./components/OnboardLandlordForm'));

const Loader = () => (
  <div className="flex h-[40vh] items-center justify-center">
    <div className="w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin" />
  </div>
);

export default function LandlordOps() {
  const [activeTab, setActiveTab] = useState<'disbursements' | 'onboard'>('disbursements');

  return (
    <div className="space-y-6 animate-in fade-in duration-500 font-inter">
      {/* Module Header */}
      <div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
          <Building2 className="text-emerald-600" size={32} />
          Landlord Portfolios
        </h1>
        <p className="text-slate-500 font-medium mt-1 text-sm md:text-base">
          Command total cash distributions securely, track net wallet payouts, and natively provision identities for network property owners.
        </p>
      </div>

      {/* Tab Navigators */}
      <div className="bg-white p-1.5 rounded-xl border border-slate-200 inline-flex shadow-sm overflow-x-auto max-w-full">
        <button
          onClick={() => setActiveTab('disbursements')}
          className={`px-5 py-2.5 rounded-lg text-sm font-bold tracking-wide transition-all min-w-max flex items-center gap-2 ${
            activeTab === 'disbursements'
              ? 'bg-emerald-600 text-white shadow-md'
              : 'text-slate-500 hover:text-slate-700 hover:bg-slate-100'
          }`}
        >
          <Banknote size={16} />
          Pending Payouts & History
        </button>
        <button
          onClick={() => setActiveTab('onboard')}
          className={`px-5 py-2.5 rounded-lg text-sm font-bold tracking-wide transition-all min-w-max flex items-center gap-2 ${
            activeTab === 'onboard'
              ? 'bg-emerald-600 text-white shadow-md'
              : 'text-slate-500 hover:text-slate-700 hover:bg-slate-100'
          }`}
        >
          <UserPlus size={16} />
          Provision New Owner
        </button>
      </div>

      {/* Embedded App Map */}
      <div className="pt-2">
        <Suspense fallback={<Loader />}>
          {activeTab === 'disbursements' && <LandlordDisbursements />}
          {activeTab === 'onboard' && <OnboardLandlordForm />}
        </Suspense>
      </div>
    </div>
  );
}
