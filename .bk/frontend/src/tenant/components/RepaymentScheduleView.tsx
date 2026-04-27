import { Calendar, CheckCircle2, Clock, Circle } from 'lucide-react';

interface Activity {
  id: string;
  description: string;
  amount: number;
  date: string;
  type: string;
}

interface RepaymentScheduleViewProps {
  activities?: Activity[];
  nextDueAmount?: number;
  daysLeft?: number;
}

export default function RepaymentScheduleView({ activities = [], nextDueAmount = 0, daysLeft = 0 }: RepaymentScheduleViewProps) {
  
  const hasNextDue = daysLeft > 0;
  
  return (
    <div className="bg-white rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.02)] border border-slate-100 p-6 lg:p-8 flex flex-col h-full overflow-hidden">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
          <Calendar className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-[17px] font-bold text-slate-900 tracking-tight leading-none">Repayment Schedule</h3>
          <p className="text-xs font-medium text-slate-500 mt-1">Recent timeline & upcoming payments</p>
        </div>
      </div>

      <div className="relative pl-4 flex-1">
        {/* Continuous Timeline Track */}
        <div className="absolute left-[27px] top-2 bottom-4 w-px bg-slate-100"></div>

        <div className="space-y-6">
          {/* Upcoming Node */}
          {hasNextDue && (
            <div className="relative z-10 flex gap-4">
              <div className="mt-1 flex-shrink-0 relative">
                <div className="w-6 h-6 rounded-full bg-white border-2 border-dashed border-blue-400 flex items-center justify-center z-10 relative">
                  <div className="w-2 h-2 rounded-full bg-blue-400"></div>
                </div>
              </div>
              <div className="flex-1 pb-1">
                <div className="flex justify-between items-start mb-1">
                  <p className="text-sm font-bold text-slate-900">Upcoming Payment</p>
                  <p className="text-sm font-bold text-blue-600">UGX {nextDueAmount.toLocaleString()}</p>
                </div>
                <div className="flex items-center gap-1 text-xs font-medium text-slate-500">
                  <Clock className="w-3.5 h-3.5" /> Due in {daysLeft} Days
                </div>
              </div>
            </div>
          )}

          {/* Past Nodes */}
          {activities.length > 0 ? (
            activities.map((activity) => (
             <div key={activity.id} className="relative z-10 flex gap-4 opacity-70 hover:opacity-100 transition-opacity">
               <div className="mt-1 flex-shrink-0">
                 <div className="bg-white rounded-full z-10 relative">
                    <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                 </div>
               </div>
               <div className="flex-1 pb-1">
                 <div className="flex justify-between items-start mb-0.5">
                   <p className="text-sm font-semibold text-slate-700">{activity.description}</p>
                   <p className="text-sm font-bold text-slate-700">UGX {activity.amount.toLocaleString()}</p>
                 </div>
                 <p className="text-xs font-medium text-slate-400">
                    {new Date(activity.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                 </p>
               </div>
             </div>
            ))
          ) : (
             <div className="relative z-10 flex gap-4 opacity-50">
               <div className="mt-1 flex-shrink-0">
                 <div className="bg-white rounded-full z-10 relative">
                    <Circle className="w-6 h-6 text-slate-300" />
                 </div>
               </div>
               <div className="flex-1 pb-1">
                 <p className="text-sm font-medium text-slate-500 italic">No previous payments found</p>
               </div>
             </div>
          )}
        </div>
      </div>
    </div>
  );
}
