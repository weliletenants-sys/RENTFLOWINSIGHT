import { ChevronRight, TrendingUp } from 'lucide-react';
import type { PortfolioItem, PortfolioStatus } from '../types';

export type { PortfolioItem };

interface FunderPortfolioListProps {
  portfolios: PortfolioItem[];
  onViewAll?: () => void;
  onCardClick?: (code: string) => void;
  onAddAsset?: () => void;
}

const statusConfig: Record<PortfolioStatus, { label: string; classes: string }> = {
  active:           { label: 'Active',           classes: 'bg-green-100 text-green-700' },
  pending:          { label: 'Pending',           classes: 'bg-orange-100 text-orange-700' },
  pending_approval: { label: 'Pending Approval',  classes: 'bg-yellow-100 text-yellow-700' },
  cancelled:        { label: 'Cancelled',         classes: 'bg-red-100 text-red-600' },
};

export default function FunderPortfolioList({ portfolios, onViewAll, onCardClick, onAddAsset }: FunderPortfolioListProps) {
  return (
    <section>
      {/* Header */}
      <div className="flex items-center justify-between mb-4 px-1">
        <h3 className="font-bold text-gray-900 text-lg">Active supports</h3>
        {onViewAll && (
          <button
            onClick={onViewAll}
            className="font-bold text-xs flex items-center gap-1 hover:underline"
            style={{ color: 'var(--color-primary)' }}
          >
            View All <ChevronRight className="w-3 h-3" />
          </button>
        )}
      </div>

      {/* ── Active Supports - Vertical Card Layout ── */}
      <div className="grid grid-cols-1 gap-4">
        {portfolios.slice(0, 2).map((p, idx) => {
          const stsCfg = statusConfig[p.status];
          const currentValue = p.investedAmount + p.totalEarned;
          const growth = p.todayGrowth || 0;
          const isGrowthPositive = growth > 0;
          const isGrowthNegative = growth < 0;

          const MOCK_IMAGES = [
            'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&q=80&w=400&h=400',
            'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=400&h=400',
            'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=400&h=400',
          ];
          const imgUrl = MOCK_IMAGES[idx % MOCK_IMAGES.length];
          
          const nextPayoutStr = p.nextPayoutDate;
          let progressPercent = 0;
          let daysLeft = 30;
          if (nextPayoutStr && nextPayoutStr !== '—') {
            const nextDate = new Date(nextPayoutStr);
            const today = new Date();
            const diffTime = nextDate.getTime() - today.getTime();
            daysLeft = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            if (daysLeft < 0) daysLeft = 0;
            if (daysLeft > 30) daysLeft = 30; // Max visual bound
            progressPercent = ((30 - daysLeft) / 30) * 100;
          }

          return (
            <div
              key={p.id}
              onClick={() => onCardClick?.(p.portfolioCode)}
              className="bg-white rounded-[24px] border border-slate-100 shadow-sm hover:shadow-lg hover:border-[var(--color-primary)] transition-all cursor-pointer group flex flex-col p-5 sm:flex-row sm:items-center justify-between sm:p-6 lg:p-8 gap-4 sm:gap-6 lg:gap-8 relative overflow-hidden"
            >
              {/* Header: Identity */}
              <div className="flex items-center gap-4 sm:gap-5 lg:gap-6 min-w-0 flex-1">
                <div className="w-14 h-14 sm:w-20 sm:h-20 lg:w-24 lg:h-24 rounded-2xl overflow-hidden flex-shrink-0 relative group-hover:shadow-md transition-shadow">
                  <img src={imgUrl} alt={p.assetName || 'Portfolio'} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-black text-slate-900 text-[13px] sm:text-[15px] lg:text-base group-hover:text-[var(--color-primary)] transition-colors line-clamp-2 leading-tight">
                    {p.assetName || `Portfolio ${p.portfolioCode}`}
                  </h3>
                  <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                    <span className="text-[10px] sm:text-xs font-bold text-slate-400 shrink-0">
                      {p.portfolioCode}
                    </span>
                    <span className="w-1 h-1 rounded-full bg-slate-200 shrink-0" />
                    <div className="flex items-center gap-1.5 shrink-0">
                      <span className={`w-1.5 h-1.5 rounded-full ${
                        p.status === 'active' ? 'bg-green-500' :
                        p.status === 'pending' ? 'bg-orange-500' : 
                        p.status === 'pending_approval' ? 'bg-yellow-500' : 'bg-red-500' 
                      }`} />
                      <span className={`text-[9px] sm:text-[11px] font-bold uppercase tracking-widest ${stsCfg.classes.split(' ').find(c => c.startsWith('text-')) || 'text-slate-500'}`}>
                        {stsCfg.label}
                      </span>
                    </div>
                  </div>
                  
                  {/* Next Payout Progress Tracker (Desktop inline) */}
                  <div className="hidden sm:block mt-4 w-full">
                    <div className="flex justify-between items-center mb-1.5">
                      <span className="text-[10px] sm:text-xs uppercase font-bold text-slate-400 tracking-wider">Next Payout</span>
                      <span className="text-[10px] font-bold text-[var(--color-primary)] bg-[var(--color-primary-faint)] px-2 py-0.5 rounded-md">
                        {daysLeft === 0 ? 'Today' : `In ${daysLeft} days`}
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden flex">
                      <div className="h-full bg-[var(--color-primary)] rounded-full transition-all duration-1000 ease-out" style={{ width: `${progressPercent}%` }} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Separator on mobile */}
              <div className="w-full h-px bg-slate-50 my-1 sm:hidden shrink-0" />

              <div className="flex flex-col gap-4 shrink-0 sm:min-w-[150px]">
                {/* Footer: Value & Performance */}
                <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2">
                  <div className="text-left sm:text-right flex flex-col justify-center">
                    <p className="text-[9px] sm:text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-0.5 sm:mb-1">Total Value</p>
                    <p className="font-black text-xl sm:text-2xl text-slate-900 tracking-tight leading-none">
                      UGX {currentValue.toLocaleString()}
                    </p>
                  </div>
                  <div className={`inline-flex items-center gap-1 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-lg text-[10px] sm:text-sm font-bold shrink-0 ${isGrowthPositive
                      ? 'bg-emerald-50 text-emerald-600'
                      : isGrowthNegative
                        ? 'bg-red-50 text-red-600'
                        : 'bg-slate-50 text-slate-500'
                    }`}>
                    {isGrowthPositive ? (
                      <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4" />
                    ) : isGrowthNegative ? (
                      <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4" style={{ transform: 'scaleY(-1)' }} />
                    ) : (
                      <span className="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-slate-400 mx-1" />
                    )}
                    {isGrowthPositive ? '+' : isGrowthNegative ? '-' : ''}UGX {Math.abs(growth).toLocaleString()}
                  </div>
                </div>

                {/* Mobile version of progress tracker */}
                <div className="sm:hidden mt-2">
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">Next Payout</span>
                    <span className="text-[9px] font-bold text-[var(--color-primary)]">
                      {daysLeft === 0 ? 'Today' : `In ${daysLeft} days`}
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden flex">
                    <div className="h-full bg-[var(--color-primary)] rounded-full transition-all duration-1000 ease-out" style={{ width: `${progressPercent}%` }} />
                  </div>
                </div>
              </div>
              
              <div className="absolute top-4 right-4 text-slate-300 group-hover:text-[var(--color-primary)] transition-colors bg-slate-50 p-1.5 rounded-full group-hover:bg-[var(--color-primary-faint)] hidden sm:block">
                <ChevronRight className="w-4 h-4" />
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-4 border-t border-[var(--color-primary-border)] pt-4">
        <button
          onClick={onAddAsset}
          className="w-full flex items-center justify-center gap-2 p-4 rounded-xl border-2 border-dashed border-slate-200 text-[var(--color-primary)] bg-[var(--color-primary-faint)] font-bold text-sm transition-all hover:border-[var(--color-primary)]"
        >
          + Launch New Investment
        </button>
      </div>
    </section>
  );
}
