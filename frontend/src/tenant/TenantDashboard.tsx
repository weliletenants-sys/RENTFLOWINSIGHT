import { CreditCard, Calendar, ArrowUpRight, PlusCircle, CheckCircle, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function TenantDashboard() {
  const navigate = useNavigate();

  // Mock data representing an active rent application
  const activeRent = {
    status: 'APPROVED', // Could be PENDING, APPROVED, REJECTED
    rentFinanced: 450000,
    totalRepayment: 470000,
    dailyRepayment: 15667,
    amountPaid: 120000,
    daysRemaining: 23,
    landlord: 'Okello Properties'
  };

  const remainingBalance = activeRent.totalRepayment - activeRent.amountPaid;
  const progressPercent = (activeRent.amountPaid / activeRent.totalRepayment) * 100;

  return (
    <div className="flex flex-col gap-6 -mt-2">
      {activeRent.status === 'PENDING' && (
        <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-2xl flex items-center gap-3">
          <Clock className="text-yellow-600 shrink-0" size={24} />
          <div>
            <h4 className="font-bold text-yellow-900 text-sm">Application Pending</h4>
            <p className="text-xs text-yellow-700 mt-0.5">Your rent request for UGX {activeRent.rentFinanced.toLocaleString()} is being reviewed.</p>
          </div>
        </div>
      )}

      {/* Hero Card: Core Rent Metric */}
      <div className="bg-[#512DA8] p-6 rounded-[2rem] text-white shadow-xl shadow-purple-500/20 relative overflow-hidden">
        {/* Abstract pattern */}
        <div className="absolute -right-8 -top-8 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
        <div className="absolute -left-8 -bottom-8 w-24 h-24 bg-purple-400/20 rounded-full blur-xl"></div>
        
        <div className="relative z-10 flex justify-between items-start mb-6">
          <p className="text-purple-200 font-medium text-sm">Remaining Balance</p>
          <span className="bg-white/20 px-3 py-1 rounded-full text-xs font-bold backdrop-blur-md border border-white/20">Active Loan</span>
        </div>
        
        <h2 className="relative z-10 text-[32px] font-black tracking-tight mb-6">
          <span className="text-xl font-bold opacity-80 mr-1">UGX</span>
          {remainingBalance.toLocaleString()}
        </h2>

        {/* Progress Bar inside Card */}
        <div className="relative z-10 space-y-2">
          <div className="flex justify-between text-xs text-purple-200 font-medium">
            <span>UGX {activeRent.amountPaid.toLocaleString()} paid</span>
            <span>{activeRent.daysRemaining} days left</span>
          </div>
          <div className="w-full bg-black/20 h-2 rounded-full overflow-hidden">
            <div 
              className="bg-[#00E676] h-full rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Pay Now Focus */}
      <div className="bg-white border-2 border-[#512DA8]/10 rounded-[2rem] p-5 shadow-sm flex items-center justify-between">
        <div>
          <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-1">Due Today</p>
          <p className="text-xl font-black text-gray-900">UGX {activeRent.dailyRepayment.toLocaleString()}</p>
        </div>
        <button className="bg-[#512DA8] hover:bg-[#412387] text-white px-6 py-3 rounded-2xl font-bold shadow-lg transition active:scale-95 flex items-center gap-2">
          Pay Now <ArrowUpRight size={18} strokeWidth={2.5}/>
        </button>
      </div>

      {/* Quick Actions */}
      <div className="flex justify-between items-center px-2">
        <div onClick={() => navigate('/tenant-agreement')} className="flex flex-col items-center gap-2 cursor-pointer group">
          <div className="w-14 h-14 bg-white rounded-full flex justify-center items-center shadow-sm text-[#512DA8] group-hover:bg-purple-50 group-active:scale-95 transition">
            <PlusCircle size={24} />
          </div>
          <span className="text-xs font-bold text-gray-600 group-hover:text-[#512DA8]">New Request</span>
        </div>
        <div className="flex flex-col items-center gap-2 cursor-pointer group">
          <div className="w-14 h-14 bg-white rounded-full flex justify-center items-center shadow-sm text-blue-500 group-hover:bg-blue-50 group-active:scale-95 transition">
            <Calendar size={24} />
          </div>
          <span className="text-xs font-bold text-gray-600 group-hover:text-blue-500">History</span>
        </div>
        <div className="flex flex-col items-center gap-2 cursor-pointer group">
          <div className="w-14 h-14 bg-white rounded-full flex justify-center items-center shadow-sm text-orange-500 group-hover:bg-orange-50 group-active:scale-95 transition">
            <CreditCard size={24} />
          </div>
          <span className="text-xs font-bold text-gray-600 group-hover:text-orange-500">Cards</span>
        </div>
      </div>

      {/* Detailed Info Card */}
      <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-gray-100">
        <div className="flex justify-between items-center mb-5">
          <h3 className="font-bold text-gray-900 text-lg">Financing Details</h3>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center border-b border-gray-50 pb-3">
            <span className="text-gray-500 text-sm font-medium">Landlord</span>
            <span className="text-gray-900 font-bold">{activeRent.landlord}</span>
          </div>
          <div className="flex justify-between items-center border-b border-gray-50 pb-3">
            <span className="text-gray-500 text-sm font-medium">Total Financed</span>
            <span className="text-gray-900 font-bold tracking-tight">UGX {activeRent.rentFinanced.toLocaleString()}</span>
          </div>
          <div className="flex justify-between items-center pb-1">
            <span className="text-gray-500 text-sm font-medium">Status</span>
            <div className="flex items-center gap-1.5 text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full text-xs font-bold">
              <CheckCircle size={14} /> Approved
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
