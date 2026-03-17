import { ChevronRight } from 'lucide-react';
import type { PortfolioItem, PortfolioStatus } from '../types';

export type { PortfolioItem };

interface FunderPortfolioListProps {
  portfolios: PortfolioItem[];
  onViewAll?: () => void;
  onCashOut?: (id: string) => void;
  onAddAsset?: () => void;
}

const statusConfig: Record<PortfolioStatus, { label: string; classes: string }> = {
  active:           { label: 'Active',           classes: 'bg-green-100 text-green-700' },
  pending:          { label: 'Pending',           classes: 'bg-orange-100 text-orange-700' },
  pending_approval: { label: 'Pending Approval',  classes: 'bg-yellow-100 text-yellow-700' },
  cancelled:        { label: 'Cancelled',         classes: 'bg-red-100 text-red-600' },
};

export default function FunderPortfolioList({ portfolios, onViewAll, onCashOut, onAddAsset }: FunderPortfolioListProps) {
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
        {portfolios.slice(0, 2).map((item) => {
          const stsCfg = statusConfig[item.status];
          return (
            <div
              key={item.id}
              onClick={() => onCashOut?.(item.id)}
              className="bg-white rounded-2xl p-5 border border-[var(--color-primary-border)] shadow-sm hover:border-[var(--color-primary)] hover:shadow-lg transition-all cursor-pointer group flex flex-col gap-5"
            >
              {/* Header: Identity & Status */}
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-[var(--color-primary-faint)] flex items-center justify-center flex-shrink-0 border border-[var(--color-primary-border)] text-[var(--color-primary)]">
                    <span className="font-bold font-mono text-xs">#{item.portfolioCode.split('-')[1]}</span>
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-bold text-slate-900 text-base truncate group-hover:text-[var(--color-primary)] transition-colors">
                      {item.assetName || 'Custom Portfolio'}
                    </h4>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="font-mono text-xs text-slate-500 truncate">#{item.portfolioCode}</span>
                      <span className="text-slate-300">•</span>
                      <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-widest ${stsCfg.classes} shrink-0`}>
                        {stsCfg.label}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-slate-300 shrink-0 group-hover:text-[var(--color-primary)] transition-colors bg-slate-50 p-2 rounded-full group-hover:bg-[var(--color-primary-faint)] ml-2">
                  <ChevronRight className="w-4 h-4" />
                </div>
              </div>

              {/* Metrics Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-50 rounded-xl p-3 border border-slate-100">
                <div className="bg-white p-2.5 rounded-lg border border-slate-100">
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1">Invested</p>
                  <p className="font-bold text-slate-900 text-sm">UGX {(item.investedAmount || item.supportedAmount || 0).toLocaleString()}</p>
                </div>
                <div className="bg-white p-2.5 rounded-lg border border-slate-100">
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1">Earnings</p>
                  <div className="flex items-center justify-between">
                    <p className={`font-bold text-sm ${item.totalEarned > 0 ? 'text-[var(--color-success)]' : 'text-slate-400'}`}>
                      {item.totalEarned > 0 ? '+' : ''}UGX {item.totalEarned.toLocaleString()}
                    </p>
                    <span className="font-bold text-[10px] bg-green-50 text-green-700 px-1.5 py-0.5 rounded ml-1 shrink-0">
                      {item.roiPercent ?? 0}%
                    </span>
                  </div>
                </div>
              </div>

              {/* Timeline & Next Payout */}
              <div className="flex items-center justify-between border-t border-slate-100 pt-4 mt-auto">
                <div>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1">Next Payout</p>
                  <p className="font-semibold text-slate-900 text-sm">{item.nextPayoutDate ?? '—'}</p>
                </div>
                <div className="text-right flex flex-col items-end">
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1">Duration ({item.durationMonths || 12}M)</p>
                  <div className="w-24 h-1.5 bg-slate-100 rounded-full overflow-hidden mt-1">
                    <div className="h-full bg-[var(--color-primary)] rounded-full" style={{ width: '40%' }} />
                  </div>
                </div>
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
