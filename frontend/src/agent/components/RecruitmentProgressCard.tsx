interface RecruitmentProgressCardProps {
  totalClients: number;
  pendingPayments: number;
  conversionRate: number; // percentage (0-100)
}

export default function RecruitmentProgressCard({ totalClients, pendingPayments, conversionRate }: RecruitmentProgressCardProps) {
  return (
    <section className="px-4 py-2">
      <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-primary/5 shadow-sm">
        
        <div className="flex justify-between items-end mb-4">
          <div>
            <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400">Client Recruitment</h3>
            <p className="text-lg font-bold">Payment Conversion</p>
          </div>
          <p className="text-primary font-bold">{conversionRate}%</p>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-primary/10 h-3 rounded-full overflow-hidden mb-6">
          <div 
            className="bg-primary h-full rounded-full" 
            style={{ width: `${conversionRate}%` }}
          />
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-background-light dark:bg-slate-800 p-4 rounded-lg border border-primary/5">
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Total Clients</p>
            <p className="text-xl font-bold mt-1 text-primary">{totalClients.toLocaleString()}</p>
          </div>
          <div className="bg-background-light dark:bg-slate-800 p-4 rounded-lg border border-primary/5">
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Pending Payments</p>
            <p className="text-xl font-bold mt-1 text-slate-900 dark:text-slate-100">{pendingPayments.toLocaleString()}</p>
          </div>
        </div>

      </div>
    </section>
  );
}
