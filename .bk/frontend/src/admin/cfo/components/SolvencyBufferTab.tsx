import React from 'react';
import { ShieldAlert, Info } from 'lucide-react';

interface SolvencyBufferTabProps {
  solvencyData?: any;
}

export default function SolvencyBufferTab({ solvencyData }: SolvencyBufferTabProps) {
  // STRICT PRISMA DATA ENFORCEMENT
  const data = solvencyData || {
    coverageRatio: 0,
    targetRatio: 1.2,
    bufferHealth: 'Pending Calculation',
    liquidity: { available: 0, obligations: 0 },
    breakdown: { totalFunded: 0, totalRepaid: 0, outstandingBalance: 0 }
  };

  const isHealthy = data.coverageRatio >= data.targetRatio;

  return (
    <div className="space-y-6 font-inter">
      <div className="flex justify-end mb-2">
        {!isHealthy && (
          <div className="bg-red-50 text-red-600 px-4 py-2 rounded-full font-bold text-sm flex items-center gap-2 border border-red-200 animate-pulse shadow-sm">
            <ShieldAlert size={16} /> SOLVENCY ALERT: Ratio below safe threshold!
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Coverage Ratio Card */}
        <div className={`p-8 rounded-3xl border shadow-sm flex flex-col items-center justify-center text-center ${isHealthy ? 'bg-white border-slate-100 hover:bg-slate-50 hover:shadow-md' : 'bg-red-50 border-red-200 hover:bg-red-100'} transition-all`}>
          <div className="p-3 bg-[#EAE5FF] text-[#6c11d4] rounded-full mb-4">
            <ShieldAlert size={24} />
          </div>
          <p className="text-sm font-bold text-slate-500 tracking-wide mb-2">Platform Coverage Ratio</p>
          <div className="relative">
            <h2 className={`text-6xl font-black font-outfit ${isHealthy ? 'text-slate-900' : 'text-red-700'}`}>
              {data.coverageRatio.toFixed(2)}<span className="text-3xl text-slate-400">x</span>
            </h2>
          </div>
          <div className={`mt-4 px-4 py-1.5 rounded-full text-xs font-bold ${isHealthy ? 'bg-green-100 text-green-700' : 'bg-red-200 text-red-800'}`}>
            Target Threshold: {data.targetRatio}x
          </div>
          <p className="text-xs font-medium text-slate-400 mt-6 flex items-center gap-1">
            <Info size={14} /> Buffer Health is currently considered <span className="font-bold">{data.bufferHealth}</span>
          </p>
        </div>

        {/* Liquidity vs Obligations */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-8 border border-slate-100 shadow-sm flex flex-col justify-center transition-colors hover:bg-slate-50">
          <h4 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-8 border-b border-slate-100 pb-2">Platform Liquidity Assessment</h4>
          
          <div className="space-y-8">
            <div>
              <div className="flex justify-between items-end mb-3">
                <span className="text-sm font-bold text-slate-600">Available Liquid Flow</span>
                <span className="text-2xl font-black font-outfit text-[#6c11d4]">UGX {Number(data.liquidity.available || 0).toLocaleString()}</span>
              </div>
              <div className="h-4 w-full bg-slate-100 rounded-full overflow-hidden shadow-inner flex items-center justify-center">
                {data.liquidity.available === 0 && <span className="text-[10px] uppercase font-bold text-slate-400">Awaiting Ledgers</span>}
                {data.liquidity.available > 0 && <div className="bg-[#6c11d4] h-full rounded-full" style={{ width: '100%' }}></div>}
              </div>
            </div>

            <div>
              <div className="flex justify-between items-end mb-3">
                <span className="text-sm font-bold text-slate-600">Immediate Obligations</span>
                <span className="text-2xl font-black font-outfit text-orange-500">UGX {Number(data.liquidity.obligations || 0).toLocaleString()}</span>
              </div>
              <div className="h-4 w-full bg-slate-100 rounded-full overflow-hidden shadow-inner">
                <div className="bg-orange-500 h-full rounded-full" style={{ width: `${Math.min(100, (data.liquidity.obligations / (data.liquidity.available || 1)) * 100)}%` }}></div>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Breakdown Metrics */}
      <h4 className="text-lg font-bold text-slate-800 font-outfit mt-8 mb-4">Capital Breakdown Topology</h4>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm transition-colors hover:bg-slate-50">
          <p className="text-sm font-bold text-slate-500 mb-2">Total Funded Pipeline</p>
          <h3 className="text-3xl font-black text-slate-900 font-outfit">UGX {(data.breakdown.totalFunded / 1000000).toFixed(1)}<span className="text-slate-400 text-lg">M</span></h3>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm transition-colors hover:bg-slate-50">
          <p className="text-sm font-bold text-slate-500 mb-2">Total Repaid Returns</p>
          <h3 className="text-3xl font-black text-green-600 font-outfit">UGX {(data.breakdown.totalRepaid / 1000000).toFixed(1)}<span className="text-slate-400 text-lg">M</span></h3>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm transition-colors hover:bg-slate-50">
          <p className="text-sm font-bold text-slate-500 mb-2">Ongoing Exposure</p>
          <h3 className="text-3xl font-black text-orange-500 font-outfit">UGX {(data.breakdown.outstandingBalance / 1000000).toFixed(1)}<span className="text-slate-400 text-lg">M</span></h3>
        </div>
      </div>

    </div>
  );
}
