import { MoreHorizontal, Plus, ShieldCheck } from 'lucide-react';

interface RepaymentSectionProps {
  amountPaid: number;
  remainingRent: number;
  daysLeft: number;
  percentPaid: number;
  onMakePayment: () => void;
}

export default function RepaymentSection({
  amountPaid,
  remainingRent,
  daysLeft,
  percentPaid,
  onMakePayment
}: RepaymentSectionProps) {

  const chartStyle = {
    background: `conic-gradient(from 0deg, #10b981 0%, #10b981 ${percentPaid}%, #e2e8f0 ${percentPaid}%, #e2e8f0 100%)`
  };

  return (
    <div className="bg-white rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.02)] border border-slate-100 p-8 flex flex-col h-full w-full">
      <div className="flex justify-between items-start w-full mb-8">
         <div>
           <div className="flex items-center gap-2">
             <h3 className="text-xl font-bold text-slate-900 tracking-tight">Active Repayment</h3>
             <div className="bg-emerald-100 text-emerald-800 text-[10px] uppercase font-black px-2 py-0.5 rounded tracking-widest flex items-center gap-1">
               <ShieldCheck className="w-3 h-3" /> Funded
             </div>
           </div>
           <p className="text-sm font-medium text-slate-500 mt-1">Track your daily rent assistance schedule</p>
         </div>
         <button className="text-slate-400 hover:text-slate-600 transition-colors">
           <MoreHorizontal className="w-5 h-5" />
         </button>
      </div>

      <div className="flex flex-col xl:flex-row items-center gap-10 lg:gap-14 flex-1">
         
         {/* Pure CSS Donut Chart */}
         <div className="relative w-40 h-40 lg:w-48 lg:h-48 rounded-full flex items-center justify-center shrink-0 shadow-sm" style={chartStyle}>
            <div className="absolute inset-0 m-4 lg:m-5 bg-white rounded-full flex flex-col items-center justify-center shadow-[inset_0_2px_10px_rgba(0,0,0,0.05)]">
               <span className="text-3xl lg:text-4xl font-black text-slate-900 leading-none">{percentPaid}%</span>
               <span className="text-[10px] font-bold text-slate-400 tracking-widest uppercase mt-1">Paid</span>
            </div>
         </div>

         {/* Stats Blocks & Actions */}
         <div className="flex flex-col w-full flex-1 gap-4 lg:gap-6 justify-center">
            
            <div className="flex items-center gap-4 w-full">
              <div className="bg-[#f7f9fc] rounded-2xl p-5 lg:p-6 flex-1 min-w-[130px] border border-slate-50 shadow-sm">
                <p className="text-[10px] lg:text-[11px] font-bold text-slate-500 tracking-widest uppercase mb-2">Rent Paid</p>
                <p className="text-xl lg:text-2xl font-bold text-slate-900 mb-1">{amountPaid.toLocaleString()}</p>
                <p className="text-xs text-emerald-600 font-semibold leading-tight flex items-center gap-1">
                  On Track
                </p>
              </div>
              
              <div className="bg-[#f7f9fc] rounded-2xl p-5 lg:p-6 flex-1 min-w-[130px] border border-slate-50 shadow-sm">
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-2 h-2 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.5)]"></span>
                  <p className="text-[10px] lg:text-[11px] font-bold text-slate-500 tracking-widest uppercase">Remaining</p>
                </div>
                <p className="text-xl lg:text-2xl font-bold text-slate-900 mb-1">{remainingRent.toLocaleString()}</p>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">{daysLeft} Days left</p>
              </div>
            </div>

            {/* Action CTA */}
            <button 
              onClick={onMakePayment}
              className="w-full bg-[#0f4cac] hover:bg-[#0c3114] text-white rounded-xl py-3.5 px-6 font-bold text-sm tracking-wide shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 active:scale-[0.98]"
            >
              <Plus strokeWidth={2.5} className="w-4 h-4" /> 
              Make Early Payment
            </button>
         </div>
      </div>
    </div>
  );
}
