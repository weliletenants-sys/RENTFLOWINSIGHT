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
        <h3 className="font-bold text-gray-900 text-lg">Active Investments</h3>
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

      {/* ── Mobile card list ── */}
      <div className="lg:hidden space-y-4">
        {portfolios.map((item) => {
          const stsCfg = statusConfig[item.status];
          return (
            <div
              key={item.id}
              className="bg-white rounded-2xl p-5 border border-[var(--color-primary-border)]"
              style={{ boxShadow: '0 8px 30px var(--color-primary-shadow)' }}
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1">Portfolio Code</p>
                  <h4 className="font-bold text-gray-900 font-mono text-base">#{item.portfolioCode}</h4>
                </div>
                <span className={`text-[9px] font-bold px-2 py-1 rounded-full uppercase ${stsCfg.classes}`}>
                  {stsCfg.label}
                </span>
              </div>

              <div className="grid grid-cols-2 mb-4">
                <div>
                  <p className="text-[10px] text-gray-400 font-bold mb-1">Invested Amount</p>
                  <p className="font-bold text-gray-900">UGX {item.investedAmount.toLocaleString()}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-gray-400 font-bold mb-1">Total Earned</p>
                  <p className={`font-bold ${item.totalEarned > 0 ? 'text-[var(--color-success)]' : 'text-gray-400'}`}>
                    {item.totalEarned > 0 ? '+' : ''}UGX {item.totalEarned.toLocaleString()}
                  </p>
                </div>
              </div>

              {item.nextPayoutDate && (
                <div className="pt-4 border-t border-gray-100">
                  <p className="text-[10px] text-gray-400 font-bold mb-1">Next Payout</p>
                  <p className="font-bold text-gray-900">{item.nextPayoutDate}</p>
                </div>
              )}
            </div>
          );
        })}

        <button
          onClick={onAddAsset}
          className="w-full flex items-center justify-center gap-2 p-4 rounded-2xl border-2 border-dashed border-slate-200 bg-transparent text-slate-400 font-bold text-sm transition-all"
          onMouseEnter={(e) => {
            e.currentTarget.style.color = 'var(--color-primary)';
            e.currentTarget.style.borderColor = 'var(--color-primary)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = '';
            e.currentTarget.style.borderColor = '';
          }}
        >
          + Add New Investment
        </button>
      </div>

      {/* ── Desktop table ── */}
      <div className="hidden lg:block bg-white rounded-xl border border-[var(--color-primary-border)] overflow-hidden shadow-sm">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50">
              {['Portfolio', 'Invested', 'ROI', 'Earned', 'Next Payout', 'Status', ''].map((h) => (
                <th
                  key={h}
                  className={`px-3 py-2 text-[9px] font-bold uppercase tracking-wider text-slate-400 ${
                    h === '' ? '' : h === 'Portfolio' ? 'text-left' : 'text-right'
                  } ${h === 'Status' ? 'text-center' : ''}`}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {portfolios.map((item) => {
              const stsCfg = statusConfig[item.status];
              return (
                <tr key={item.id} className="hover:bg-[var(--color-primary-faint)] transition-colors">
                  <td className="px-3 py-2">
                    <p className="font-bold text-slate-800 font-mono text-sm">#{item.portfolioCode}</p>
                  </td>
                  <td className="px-3 py-2 text-right font-semibold text-sm text-slate-900">
                    UGX {item.investedAmount.toLocaleString()}
                  </td>
                  <td className="px-3 py-2 text-right font-bold text-sm text-[var(--color-success)]">
                    {item.roiPercent ?? 15}%
                  </td>
                  <td className="px-3 py-2 text-right font-bold text-sm text-[var(--color-success)]">
                    {item.totalEarned > 0 ? '+' : ''}UGX {item.totalEarned.toLocaleString()}
                  </td>
                  <td className="px-3 py-2 text-right text-sm text-slate-600">
                    {item.nextPayoutDate ?? '—'}
                  </td>
                  <td className="px-3 py-2 text-center">
                    <span className={`text-[9px] font-bold px-2 py-1 rounded-full uppercase ${stsCfg.classes}`}>
                      {stsCfg.label}
                    </span>
                  </td>
                  <td className="px-3 py-2">
                    <button
                      onClick={() => onCashOut?.(item.id)}
                      className="p-1 text-slate-400 transition-colors"
                      onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--color-primary)')}
                      onMouseLeave={(e) => (e.currentTarget.style.color = '')}
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <div className="p-4 border-t border-[var(--color-primary-border)]">
          <button
            onClick={onAddAsset}
            className="w-full flex items-center justify-center gap-2 p-3 rounded-xl border-2 border-dashed border-slate-200 text-slate-400 font-bold text-sm transition-all"
            onMouseEnter={(e) => {
              e.currentTarget.style.color = 'var(--color-primary)';
              e.currentTarget.style.borderColor = 'var(--color-primary)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = '';
              e.currentTarget.style.borderColor = '';
            }}
          >
            + Add New Investment
          </button>
        </div>
      </div>
    </section>
  );
}
