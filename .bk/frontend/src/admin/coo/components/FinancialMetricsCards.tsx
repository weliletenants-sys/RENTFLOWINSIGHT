import { useQuery } from '@tanstack/react-query';
import { fetchOverviewMetrics } from '../../../services/cooApi';
import { formatMoney } from '../../../utils/currency';
import { 
  Building2, CalendarCheck, CalendarDays, Users, 
  Wallet, FileClock, AlertOctagon 
} from 'lucide-react';

export default function FinancialMetricsCards() {
  const { data, isLoading } = useQuery({
    queryKey: ['coo_overview_metrics'],
    queryFn: fetchOverviewMetrics,
    refetchInterval: 60000
  });

  if (isLoading || !data) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-4">
        {[1, 2, 3, 4, 5, 6, 7].map(i => (
          <div key={i} className="h-32 bg-white/50 animate-pulse rounded-2xl border border-slate-100"></div>
        ))}
      </div>
    );
  }

  // Value Mapping
  const totalRent = data.totalInvestments; // mapped for demo
  const paymentsToday = data.dailyCollections;
  const paymentsMonth = data.dailyCollections * 28; // mapped mock
  const agentCollections = Math.floor(data.dailyCollections * 0.8); // mapped proxy
  const walletBalance = data.walletMonitoring.mainFloat + data.walletMonitoring.agentEscrow;
  const pendingApprovals = data.pendingWithdrawalsCount;
  const failedTransactions = data.missedPaymentsCount;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-4">
      {/* 1. Total Rent Collected */}
      <MetricCard
        title="Rent Collected"
        value={`UGX ${formatMoney(totalRent)}`}
        icon={Building2}
        theme="emerald"
        isPositive={true}
      />

      {/* 2. Payments Today */}
      <MetricCard
        title="Payments Today"
        value={`UGX ${formatMoney(paymentsToday)}`}
        icon={CalendarCheck}
        theme="emerald"
        isPositive={true}
      />

      {/* 3. Payments This Month */}
      <MetricCard
        title="This Month"
        value={`UGX ${formatMoney(paymentsMonth)}`}
        icon={CalendarDays}
        theme="emerald"
        isPositive={true}
      />

      {/* 4. Agent Collections */}
      <MetricCard
        title="Agent Sweep"
        value={`UGX ${formatMoney(agentCollections)}`}
        icon={Users}
        theme="emerald"
        isPositive={true}
      />

      {/* 5. System Wallet Balance */}
      <MetricCard
        title="System Wallet"
        value={`UGX ${formatMoney(walletBalance)}`}
        icon={Wallet}
        theme={walletBalance > 0 ? "emerald" : "rose"}
        isPositive={walletBalance > 0}
        pulse={walletBalance <= 0}
      />

      {/* 6. Pending Approvals */}
      <MetricCard
        title="Approvals Queue"
        value={pendingApprovals.toString()}
        icon={FileClock}
        theme={pendingApprovals > 5 ? "amber" : "slate"}
        isPositive={pendingApprovals <= 5}
        pulse={pendingApprovals > 5}
      />

      {/* 7. Failed Transactions */}
      <MetricCard
        title="Failed Syncs"
        value={failedTransactions.toString()}
        icon={AlertOctagon}
        theme={failedTransactions > 0 ? "rose" : "slate"}
        isPositive={failedTransactions === 0}
        pulse={failedTransactions > 0}
      />
    </div>
  );
}

interface MetricCardProps {
  title: string;
  value: string | number;
  icon: any;
  theme: 'emerald' | 'rose' | 'amber' | 'slate';
  isPositive: boolean;
  pulse?: boolean;
}

function MetricCard({ title, value, icon: Icon, theme, pulse }: MetricCardProps) {
  const themeStyles = {
    emerald: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    rose: 'bg-rose-50 text-rose-600 border-rose-100',
    amber: 'bg-amber-50 text-amber-600 border-amber-100',
    slate: 'bg-slate-50 text-slate-600 border-slate-200'
  };

  const bgStyles = {
    emerald: 'hover:border-emerald-200',
    rose: 'hover:border-rose-300 ring-rose-500/20',
    amber: 'hover:border-amber-300 ring-amber-500/20',
    slate: 'hover:border-slate-300',
  };

  return (
    <div className={`bg-white rounded-2xl p-4 md:p-5 border border-slate-100 shadow-sm transition-all duration-300 relative overflow-hidden group ${bgStyles[theme]} ${pulse ? 'ring-4' : ''}`}>
      <div className="absolute top-0 right-0 p-4 opacity-5 stroke-[1px] transform group-hover:scale-110 transition-transform duration-500 pointer-events-none">
        <Icon size={80} />
      </div>
      
      <div className="flex flex-col h-full relative z-10">
        <div className="flex items-center gap-3 mb-3">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border ${themeStyles[theme]} ${pulse ? 'animate-pulse' : ''}`}>
             <Icon size={14} strokeWidth={2.5} />
          </div>
          <h4 className="text-[12px] font-bold text-slate-500 uppercase tracking-widest truncate">{title}</h4>
        </div>
        <div className="mt-auto">
          <p className="text-xl sm:text-lg md:text-xl lg:text-lg xl:text-xl font-black text-slate-800 tracking-tight">
            {value}
          </p>
        </div>
      </div>
    </div>
  );
}
