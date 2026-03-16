import { ArrowDownToLine, Home } from 'lucide-react';

export default function RecentActivitiesCard() {
  return (
    <section className="space-y-3 px-1">
      <div className="flex items-center justify-between">
        <h3 className="text-slate-900 dark:text-slate-100 font-bold">Recent Activities</h3>
        <a className="text-primary text-xs font-bold hover:underline cursor-pointer">View All</a>
      </div>

      <div className="space-y-3">
        {/* Deposit Activity */}
        <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-primary/5">
          <div className="flex items-center gap-3">
            <div className="size-10 bg-green-100 dark:bg-green-900/30 text-green-600 rounded-full flex items-center justify-center">
              <ArrowDownToLine size={24} />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-900 dark:text-slate-100">Deposit Confirmed</p>
              <p className="text-[10px] text-slate-500">Yesterday, 4:30 PM</p>
            </div>
          </div>
          <span className="text-sm font-bold text-green-600">+$500.00</span>
        </div>

        {/* Rent Paid Activity */}
        <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-primary/5">
          <div className="flex items-center gap-3">
            <div className="size-10 bg-primary/10 text-primary rounded-full flex items-center justify-center">
              <Home size={24} />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-900 dark:text-slate-100">Partial Rent Paid</p>
              <p className="text-[10px] text-slate-500">June 01, 2024</p>
            </div>
          </div>
          <span className="text-sm font-bold text-slate-900 dark:text-slate-100">-$1,200.00</span>
        </div>
      </div>
    </section>
  );
}
