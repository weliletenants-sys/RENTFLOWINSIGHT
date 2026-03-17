import { Banknote, TrendingUp, ArrowDownToLine, ChevronRight } from 'lucide-react';
import type { ActivityItem, ActivityCategory, ActivityStatus } from '../types';

export type { ActivityItem };

interface FunderRecentActivityProps {
  activities: ActivityItem[];
  onViewAll?: () => void;
}

const categoryConfig: Record<ActivityCategory, { icon: React.ReactNode; bg: string }> = {
  reward:     { icon: <Banknote className="w-5 h-5 text-[var(--color-success)]" />, bg: 'bg-green-50' },
  support: { icon: <TrendingUp className="w-5 h-5 text-[var(--color-primary)]" />, bg: 'bg-[var(--color-primary-light)]' },
  withdrawal: { icon: <ArrowDownToLine className="w-5 h-5 text-blue-500" />, bg: 'bg-blue-50' },
  deposit:    { icon: <Banknote className="w-5 h-5 text-[var(--color-success)]" />, bg: 'bg-green-50' },
  refund:     { icon: <ArrowDownToLine className="w-5 h-5 text-orange-500" />, bg: 'bg-orange-50' },
};

const statusConfig: Record<ActivityStatus, { label: string; classes: string }> = {
  ACTIVE:    { label: 'ACTIVE',    classes: 'bg-green-50 text-green-600' },
  PENDING:   { label: 'PENDING',   classes: 'bg-orange-50 text-orange-600' },
  COMPLETED: { label: 'COMPLETED', classes: 'bg-emerald-50 text-emerald-600' },
  PAUSED:    { label: 'PAUSED',    classes: 'bg-slate-100 text-slate-500' },
};

export default function FunderRecentActivity({ activities, onViewAll }: FunderRecentActivityProps) {
  return (
    <section>
      <div className="flex items-center justify-between mb-3 px-1">
        <h3 className="font-bold text-gray-900 text-base">Recent Activity</h3>
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

      <div className="space-y-2">
        {activities.map((item) => {
          const catCfg = categoryConfig[item.category];
          const stsCfg = statusConfig[item.status];
          return (
            <div
              key={item.id}
              className="bg-white p-3 rounded-xl border border-[var(--color-primary-border)] flex items-center gap-3"
            >
              {/* Icon */}
              <div className={`w-9 h-9 ${catCfg.bg} rounded-lg flex items-center justify-center shrink-0`}>
                {catCfg.icon}
              </div>

              {/* Text — takes remaining space, min-w-0 prevents overflow */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 mb-0.5 flex-wrap">
                  <h5 className="font-bold text-xs text-gray-900 truncate">{item.title}</h5>
                  <span className={`text-[8px] px-1.5 py-0.5 rounded font-bold shrink-0 ${stsCfg.classes}`}>
                    {stsCfg.label}
                  </span>
                </div>
                {item.provider && (
                  <p className="text-[10px] text-gray-400 font-semibold truncate">{item.provider}</p>
                )}
                <p className="text-[10px] text-gray-400 italic">{item.date}</p>
              </div>

              {/* Amount — fixed width, right-aligned, no shrink */}
              <p
                className="font-bold text-xs shrink-0 text-right"
                style={{ color: item.isCredit ? 'var(--color-success)' : 'var(--color-primary)' }}
              >
                {item.isCredit ? '+' : '-'}
                <br className="hidden" />
                UGX {(item.amount / 1000).toFixed(0)}K
              </p>
            </div>
          );
        })}
      </div>

      {/* Desktop view-all at bottom */}
      {onViewAll && (
        <button
          onClick={onViewAll}
          className="hidden lg:block w-full mt-3 py-2.5 text-center text-[10px] font-bold text-slate-400 hover:bg-slate-50 transition-colors uppercase tracking-widest border border-slate-100 rounded-xl"
          onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--color-primary)')}
          onMouseLeave={(e) => (e.currentTarget.style.color = '')}
        >
          View History
        </button>
      )}
    </section>
  );
}
