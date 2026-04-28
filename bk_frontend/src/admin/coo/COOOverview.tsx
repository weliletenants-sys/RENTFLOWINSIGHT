import React from 'react';
import FinancialMetricsCards from './components/FinancialMetricsCards';
import CooPipelineQueue from './components/CooPipelineQueue';
import QuickNavigationGrid from './components/QuickNavigationGrid';
import AnalyticsSummaryPanels from './components/AnalyticsSummaryPanels';
import { Share2 } from 'lucide-react';
import toast from 'react-hot-toast';

const COOOverview: React.FC = () => {

  const handleShareClick = () => {
    navigator.clipboard.writeText('https://admin.rentflowinsight.com/recruit/coo-sup');
    toast.success('Recruitment link copied to clipboard!');
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12 w-full max-w-[1600px] mx-auto">
      
      {/* Top Action Header with Recruitment Button */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-800 tracking-tight">Operations Matrix</h1>
          <p className="text-sm font-semibold text-slate-500 mt-1 uppercase tracking-widest">Global Executive Control Center</p>
        </div>
        <button
          onClick={handleShareClick}
          className="flex items-center gap-2 bg-gradient-to-r from-[#6c11d4] to-indigo-600 text-white px-5 py-2.5 rounded-xl font-bold shadow-lg shadow-indigo-600/20 hover:shadow-indigo-600/40 hover:-translate-y-0.5 transition-all active:scale-95"
        >
          <Share2 size={16} />
          <span>Recruit Supporter</span>
        </button>
      </div>

      {/* Row 1: The 7 Ledger Cards */}
      <section>
        <FinancialMetricsCards />
      </section>

      {/* Row 2: Grid Left (Pipeline Queue) & Grid Right (Quick Navigation) */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        
        {/* Left Span: Rent Pipeline Operations (takes 8 cols on massive screens) */}
        <section className="xl:col-span-8 h-full">
           <CooPipelineQueue />
        </section>

        {/* Right Span: Fast Travel Nodes (takes 4 cols) */}
        <section className="xl:col-span-4 h-full">
           <QuickNavigationGrid />
        </section>
        
      </div>

      {/* Row 3: Insights & Analytics */}
      <section>
        <AnalyticsSummaryPanels />
      </section>

    </div>
  );
};

export default COOOverview;
