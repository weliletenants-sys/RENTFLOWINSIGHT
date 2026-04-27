import { Crown, CalendarClock } from 'lucide-react';

export default function SubscriptionStatusCard() {
  return (
    <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm mt-8 relative overflow-hidden group">
       <div className="absolute top-0 right-0 w-32 h-32 bg-amber-50 rounded-bl-full -z-10 group-hover:scale-110 transition-transform duration-500"></div>
       
       <div className="flex justify-between items-start mb-6">
         <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-600">
              <Crown className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 tracking-widest uppercase mb-0.5">Current Plan</p>
              <h4 className="text-sm font-bold text-slate-900">Standard Tier Active</h4>
            </div>
         </div>
         <span className="bg-amber-100 text-amber-900 border border-amber-200 text-[10px] font-black tracking-widest uppercase px-2 py-1 rounded-sm">
           Level 1
         </span>
       </div>

       <div className="flex items-center gap-3 text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100 mb-4 cursor-pointer hover:bg-white transition-colors">
          <CalendarClock className="w-4 h-4 text-[#1a56db]" />
          <span className="text-xs font-semibold flex-1">Next rent payment due in</span>
          <span className="text-sm font-black text-slate-900">14 Days</span>
       </div>

       <button className="text-xs font-bold text-[#1a56db] hover:text-[#0f3b7d] flex items-center transition-colors">
         Upgrade to Platinum <span className="ml-1 text-[16px] leading-none">→</span>
       </button>
    </div>
  );
}
