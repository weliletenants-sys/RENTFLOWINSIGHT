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
        {activities.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 px-4 bg-white rounded-xl border border-dashed border-slate-200">
            <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mb-3">
              <Banknote className="w-6 h-6 text-slate-300" />
            </div>
            <p className="text-sm font-bold text-slate-600">No activity yet</p>
            <p className="text-xs text-slate-400 text-center mt-1 max-w-[200px]">
              Your recent deposits, investments, and payouts will appear here.
            </p>
          </div>
        ) : (
          activities.map((item) => {
            const catCfg = categoryConfig[item.category];
          const stsCfg = statusConfig[item.status];
          return (
            <div
              key={item.id}
              className="bg-white p-3.5 rounded-xl border border-slate-100 shadow-sm flex flex-col gap-3 cursor-pointer hover:border-[var(--color-primary)] hover:shadow-md transition-all group"
            >
              {/* Row 1: Small Icon + Title */}
              <div className="flex items-center gap-2.5">
                <div className={`w-7 h-7 ${catCfg.bg} rounded-md flex items-center justify-center shrink-0 [&>svg]:w-4 [&>svg]:h-4`}>
                  {catCfg.icon}
                </div>
                <h5 className="font-bold text-[13px] text-slate-900 truncate group-hover:text-[var(--color-primary)] transition-colors">
                  {item.title}
                </h5>
              </div>

              <div className="flex flex-col gap-2 relative">
                {/* Visual Connector Line */}
                <div className="absolute left-3.5 top-0 bottom-1 w-px bg-slate-100 -translate-x-[50%] hidden" />
                
                {/* Row 2: Provider ID + Status */}
                <div className="flex justify-between items-center">
                  <p className="text-[11px] text-slate-500 font-mono font-bold truncate">
                    {item.provider || 'SYSTEM'}
                  </p>
                  <span className={`text-[9px] px-2 py-0.5 rounded font-extrabold uppercase tracking-widest shrink-0 ${stsCfg.classes}`}>
                    {stsCfg.label}
                  </span>
                </div>

                {/* Row 3: Date/Time + Amount */}
                <div className="flex justify-between items-center">
                  <p className="text-[10px] text-slate-400 font-semibold whitespace-nowrap">
                    {item.date} <span className="mx-1 text-slate-300">•</span> {item.timestamp}
                  </p>
                  <p
                    className="font-black text-[13px] whitespace-nowrap"
                    style={{ color: item.isCredit ? 'var(--color-success)' : '#ef4444' }}
                  >
                    {item.isCredit ? '+' : '-'} UGX {(item.amount / 1000).toFixed(0)}K
                  </p>
                </div>
              </div>
            </div>
          );
        }))}
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
