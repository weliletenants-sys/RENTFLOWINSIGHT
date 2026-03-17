import { Banknote, TrendingUp, ArrowDownToLine, ChevronRight } from 'lucide-react';
import type { ActivityItem, ActivityCategory, ActivityStatus } from '../types';

export type { ActivityItem };

interface FunderRecentActivityProps {
  activities: ActivityItem[];
  onViewAll?: () => void;
}

const categoryConfig: Record<ActivityCategory, { icon: React.ReactNode; bg: string }> = {
  reward:     { icon: <Banknote className="w-5 h-5 text-[var(--color-success)]" />, bg: 'bg-green-50' },
  support:    { icon: <TrendingUp className="w-5 h-5 text-[var(--color-primary)]" />, bg: 'bg-[var(--color-primary-light)]' },
  investment: { icon: <TrendingUp className="w-5 h-5 text-[var(--color-primary)]" />, bg: 'bg-[var(--color-primary-light)]' },
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
              className="bg-white p-3 rounded-xl border border-[var(--color-primary-border)] flex items-center gap-3 cursor-pointer hover:border-[var(--color-primary)] hover:shadow-md transition-all group"
            >
              {/* Icon */}
              <div className={`w-9 h-9 ${catCfg.bg} rounded-lg flex items-center justify-center shrink-0`}>
                {catCfg.icon}
              </div>

              {/* Text Area */}
              <div className="flex-1 min-w-0 flex flex-col justify-center">
                <div className="flex justify-between items-start mb-1">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <h5 className="font-bold text-xs text-gray-900 truncate group-hover:text-[var(--color-primary)] transition-colors">{item.title}</h5>
                    <span className={`text-[8px] px-1.5 py-0.5 rounded font-bold shrink-0 ${stsCfg.classes}`}>
                      {stsCfg.label}
                    </span>
                  </div>
                </div>

                {item.provider && (
                  <p className="text-[10px] text-gray-500 font-semibold truncate mb-1">{item.provider}</p>
                )}

                <p className="text-[10px] text-gray-400 italic mb-2">{item.date}</p>

                {/* Bottom line: Time ago on left, Amount on right */}
                <div className="flex justify-between items-center mt-auto border-t border-slate-50 pt-2">
                  <span className="text-[10px] font-bold text-slate-500">
                    {item.timestamp}
                  </span>
                  <p
                    className="font-bold text-sm whitespace-nowrap"
                    style={{ color: item.isCredit ? 'var(--color-success)' : '#ef4444' }}
                  >
                    {item.isCredit ? '+' : '-'} UGX {(item.amount / 1000).toFixed(0)}K
                  </p>
                </div>
              </div>
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
