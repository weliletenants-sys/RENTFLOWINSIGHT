import { Clock, CheckCircle } from 'lucide-react';

interface RentRequest {
  status: 'pending' | 'approved' | 'funded' | 'disbursed' | 'completed';
  rentFinanced: number;
}

interface SubscriptionStatusCardProps {
  activeRent: RentRequest | null;
  daysRemaining: number;
  amountPaid: number;
  totalRepayment: number;
}

export default function SubscriptionStatusCard({ activeRent, daysRemaining, amountPaid, totalRepayment }: SubscriptionStatusCardProps) {
  if (!activeRent) {
    return (
      <div className="bg-gray-50 border border-gray-200 p-6 rounded-[2rem] text-center">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
          <Clock className="text-gray-400" size={28} />
        </div>
        <h4 className="font-bold text-gray-900 mb-1">No Active Rent Request</h4>
        <p className="text-sm text-gray-500">You currently do not have an active rent financing subscription. Tap "New Request" to get started.</p>
      </div>
    );
  }

  const remainingBalance = totalRepayment - amountPaid;
  const progressPercent = (amountPaid / totalRepayment) * 100;

  return (
    <div className="bg-[#482D98] p-6 rounded-[1.75rem] text-white shadow-xl shadow-purple-500/20 relative overflow-hidden">
      <div className="relative z-10 flex justify-between items-center mb-8">
        <p className="text-purple-200/90 font-medium text-[15px]">Remaining Balance</p>
        <span className="bg-white/5 px-4 py-1.5 rounded-2xl text-[13px] font-bold border border-white/10 text-white shadow-sm flex items-center gap-1.5">
          {activeRent.status === 'disbursed' ? (
            <><CheckCircle size={15} strokeWidth={2} className="text-white" /> Active Loan</>
          ) : (
            <><Clock size={15} /> {activeRent.status.toUpperCase()}</>
          )}
        </span>
      </div>
      
      <h2 className="relative z-10 flex items-baseline gap-2 mb-8">
        <span className="text-xl font-bold opacity-80 tracking-wide">UGX</span>
        <span className="text-[40px] font-black tracking-tight leading-none">{remainingBalance.toLocaleString()}</span>
      </h2>

      <div className="relative z-10 space-y-2.5">
        <div className="flex justify-between text-[13px] text-purple-200/90 font-medium">
          <span>UGX {amountPaid.toLocaleString()} paid</span>
          <span>{daysRemaining} days left</span>
        </div>
        <div className="w-full bg-[#321e6a] h-2.5 rounded-full overflow-hidden">
          <div 
            className="bg-[#00E676] h-full rounded-full transition-all duration-500 ease-out shadow-[0_0_10px_rgba(0,230,118,0.5)]"
            style={{ width: `${progressPercent}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
}
