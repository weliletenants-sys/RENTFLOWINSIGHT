import { Suspense, lazy } from 'react';

const SupporterPoolBalanceCard = lazy(() => import('./components/SupporterPoolBalanceCard'));
const RentPipelineQueue = lazy(() => import('./components/RentPipelineQueue'));

const Loader = () => (
  <div className="h-64 flex items-center justify-center bg-white rounded-xl border border-gray-100 shadow-sm animate-pulse">
    <div className="w-8 h-8 rounded-full border-4 border-purple-500 border-t-transparent animate-spin"></div>
  </div>
);

export default function ManagerDashboard() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* 1. Hero Liquid Pool Health */}
      <section>
        <Suspense fallback={<Loader />}>
          <SupporterPoolBalanceCard />
        </Suspense>
      </section>

      {/* 2. Primary Workspace: Capital Deployment Queue */}
      <section>
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-black text-gray-900 tracking-tight">Rent Deployment Pipeline</h2>
            <p className="text-gray-500 font-medium mt-1">
              Currently pending tenant rent requests requiring active capital dispatch.
            </p>
          </div>
        </div>
        
        <Suspense fallback={<Loader />}>
          <RentPipelineQueue />
        </Suspense>
      </section>

    </div>
  );
}
