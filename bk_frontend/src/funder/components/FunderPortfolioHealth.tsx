import { PieChart, Activity, TrendingUp, CalendarDays } from 'lucide-react';
import type { PortfolioItem } from '../types';

interface FunderPortfolioHealthProps {
  portfolios: PortfolioItem[];
}

export default function FunderPortfolioHealth({ portfolios }: FunderPortfolioHealthProps) {
  const activePortfolios = portfolios.filter(p => p.status === 'active' || p.status.toLowerCase() === 'active' || p.status === 'pending' || p.status === 'pending_approval');
  
  const totalInvested = activePortfolios.reduce((sum, p) => sum + p.investedAmount, 0);
  
  const compoundingAmount = activePortfolios
    .filter(p => p.payoutType === 'Compounding' || String(p.payoutType).toLowerCase().includes('compounding'))
    .reduce((sum, p) => sum + p.investedAmount, 0);
    
  const monthlyAmount = totalInvested - compoundingAmount;

  const compoundingPct = totalInvested > 0 ? (compoundingAmount / totalInvested) * 100 : 0;
  const monthlyPct = totalInvested > 0 ? (monthlyAmount / totalInvested) * 100 : 0;

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col w-full h-full">
      {/* HEADER SECTION */}
      <div className="p-6 pb-4 border-b border-slate-50 flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <PieChart className="w-5 h-5 text-slate-400" />
            <h3 className="font-black text-slate-900 text-lg tracking-tight">Portfolio Health</h3>
          </div>
          <p className="text-sm text-slate-500 font-medium tracking-tight mt-1">Capital Diversification Strategy</p>
        </div>
        {totalInvested > 0 && (
          <div className="text-right">
            <p className="text-[10px] uppercase tracking-widest font-bold text-slate-400 mb-1">Total Locked</p>
            <p className="font-black text-xl text-slate-900 tracking-tight">UGX {(totalInvested / 1000).toLocaleString()}K</p>
          </div>
        )}
      </div>

      <div className="p-6 flex flex-col gap-6">
        {totalInvested > 0 ? (
          <>
            {/* THICK PROGRESS BAR */}
            <div className="relative w-full h-8 bg-slate-100 rounded-xl overflow-hidden flex shadow-inner group">
              {compoundingPct > 0 && (
                <div 
                  className="h-full flex items-center px-4 transition-all duration-1000 ease-out relative overflow-hidden" 
                  style={{ width: `${compoundingPct}%`, backgroundColor: 'var(--color-primary)' }}
                >
                  <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <span className="text-white font-bold text-[10px] tracking-wider truncate z-10 hidden sm:block">COMPOUNDING</span>
                  <span className="text-white font-bold text-[10px] tracking-wider truncate z-10 sm:hidden">{compoundingPct.toFixed(0)}%</span>
                </div>
              )}
              {monthlyPct > 0 && (
                <div 
                  className="h-full flex items-center px-4 transition-all duration-1000 ease-out relative overflow-hidden" 
                  style={{ width: `${monthlyPct}%`, backgroundColor: '#3b82f6' }}
                >
                  <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <span className="text-white font-bold text-[10px] tracking-wider truncate z-10 hidden sm:block">MONTHLY</span>
                  <span className="text-white font-bold text-[10px] tracking-wider truncate z-10 sm:hidden">{monthlyPct.toFixed(0)}%</span>
                </div>
              )}
            </div>

            {/* HIGH-FIDELITY LEGEND CARDS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Compounding Card */}
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 hover:border-[var(--color-primary-light)] transition-colors group">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-white shadow-sm" style={{ color: 'var(--color-primary)' }}>
                      <TrendingUp className="w-4 h-4" />
                    </div>
                    <span className="text-sm font-bold text-slate-800">Compounding</span>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-1 rounded bg-white text-slate-500 shadow-sm border border-slate-50">{compoundingPct.toFixed(0)}%</span>
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-0.5">Allocated Principal</p>
                  <p className="text-lg font-black text-slate-900 tracking-tight">UGX {compoundingAmount.toLocaleString()}</p>
                </div>
              </div>
              
              {/* Monthly Payout Card */}
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 hover:border-blue-200 transition-colors group">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-white shadow-sm text-blue-500">
                      <CalendarDays className="w-4 h-4" />
                    </div>
                    <span className="text-sm font-bold text-slate-800">Monthly Payout</span>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-1 rounded bg-white text-slate-500 shadow-sm border border-slate-50">{monthlyPct.toFixed(0)}%</span>
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-0.5">Allocated Principal</p>
                  <p className="text-lg font-black text-slate-900 tracking-tight">UGX {monthlyAmount.toLocaleString()}</p>
                </div>
              </div>

            </div>
          </>
        ) : (
          /* EMPTY STATE */
          <div className="flex flex-col items-center justify-center py-6 px-4 rounded-xl border border-dashed border-slate-200 bg-slate-50/50">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mb-3 shadow-sm border border-slate-100">
              <Activity className="w-6 h-6 text-slate-300" />
            </div>
            <p className="text-sm font-bold text-slate-700">No Active Capital Locked</p>
            <p className="text-[11px] text-slate-500 mt-2 max-w-[280px] text-center leading-relaxed">
              Once you fund your first real estate pool, your diversification metrics and health score will appear here.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
