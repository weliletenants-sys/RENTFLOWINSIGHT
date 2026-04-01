import { useState } from 'react';
import { X, ArrowDownLeft, ArrowUpRight, Send, Receipt, ChevronRight } from 'lucide-react';
import TenantDepositDialog from './TenantDepositDialog';
import TenantWithdrawDialog from './TenantWithdrawDialog';

interface FullScreenWalletSheetProps {
  isOpen: boolean;
  onClose: () => void;
  balance: number;
}

export default function FullScreenWalletSheet({ isOpen, onClose, balance }: FullScreenWalletSheetProps) {
  const [isDepositOpen, setIsDepositOpen] = useState(false);
  const [isWithdrawOpen, setIsWithdrawOpen] = useState(false);

  return (
    <div
      className={`fixed inset-0 bg-[#f8fafc]/95 dark:bg-[#09090b]/95 backdrop-blur-2xl z-[80] flex flex-col transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
        isOpen ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'
      }`}
    >
      {/* Dynamic Header */}
      <div className="flex justify-between items-center px-6 py-5 shrink-0 z-10 w-full max-w-lg mx-auto">
        <h2 className="font-bold text-slate-800 dark:text-white text-xl tracking-tight">My Wallet</h2>
        <button 
          onClick={onClose} 
          className="w-10 h-10 bg-white/50 dark:bg-slate-800/50 hover:bg-white dark:hover:bg-slate-700 backdrop-blur-md rounded-full flex items-center justify-center text-slate-500 dark:text-slate-400 dark:hover:text-white shadow-sm ring-1 ring-slate-900/5 dark:ring-white/10 transition-all active:scale-95"
        >
          <X size={20} className="stroke-[2.5]" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto w-full max-w-lg mx-auto hide-scrollbar">
        <div className="p-6 pt-2 pb-24 space-y-8 h-full flex flex-col">

          {/* Premium Glass Balance Card */}
          <div className="relative rounded-[2.5rem] p-8 text-white shadow-2xl shadow-purple-900/20 dark:shadow-purple-900/40 text-center overflow-hidden group transform hover:scale-[1.01] transition-all duration-500">
            {/* Mesh Gradient Backgrounds */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#4c1d95] via-[#9333ea] to-[#d946ef] z-0"></div>
            
            {/* Animated Light Flares */}
            <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-fuchsia-400/50 rounded-full blur-3xl z-0 group-hover:scale-110 transition-transform duration-700 mix-blend-screen"></div>
            <div className="absolute -left-10 -top-10 w-48 h-48 bg-indigo-400/40 rounded-full blur-3xl z-0 group-hover:translate-x-4 transition-transform duration-700 mix-blend-screen"></div>
            <div className="absolute inset-0 bg-black/5 dark:bg-black/20 z-0"></div>

            <div className="relative z-10 flex flex-col items-center">
              <p className="text-purple-100 dark:text-purple-200/80 font-semibold mb-3 uppercase tracking-widest text-xs">Available Balance</p>
              <div className="flex items-start justify-center gap-1.5 drop-shadow-md">
                <span className="text-2xl font-bold text-purple-200/90 mt-1">UGX</span>
                <span className="text-5xl sm:text-6xl font-black tracking-tighter leading-none">{balance.toLocaleString()}</span>
              </div>

              {/* Decorative Glass Pill */}
              <div className="mt-8 px-4 py-1.5 bg-white/10 backdrop-blur-md rounded-full border border-white/20 shadow-inner flex items-center gap-2 w-max">
                 <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></div>
                 <span className="text-[10px] uppercase font-bold tracking-wider text-purple-50">Active Ledger</span>
              </div>
            </div>
          </div>

          {/* Quick Action Grid */}
          <div className="grid grid-cols-4 gap-3 sm:gap-4">
            {/* Deposit Action */}
            <button onClick={() => setIsDepositOpen(true)} className="flex flex-col items-center justify-center gap-3 active:scale-90 transition-transform group">
              <div className="w-14 h-14 bg-white dark:bg-[#18181b] rounded-[1.25rem] flex items-center justify-center shadow-lg shadow-emerald-500/10 dark:shadow-emerald-900/10 text-emerald-500 group-hover:bg-emerald-50 dark:group-hover:bg-emerald-950/30 border border-slate-100 dark:border-slate-800 transition-all">
                <ArrowDownLeft size={22} strokeWidth={2.5} />
              </div>
              <span className="font-bold text-xs text-slate-700 dark:text-slate-300">Deposit</span>
            </button>

            {/* Withdraw Action */}
            <button onClick={() => setIsWithdrawOpen(true)} className="flex flex-col items-center justify-center gap-3 active:scale-90 transition-transform group">
              <div className="w-14 h-14 bg-white dark:bg-[#18181b] rounded-[1.25rem] flex items-center justify-center shadow-lg shadow-purple-500/10 dark:shadow-purple-900/10 text-purple-600 dark:text-purple-400 group-hover:bg-purple-50 dark:group-hover:bg-purple-900/30 border border-slate-100 dark:border-slate-800 transition-all">
                <ArrowUpRight size={22} strokeWidth={2.5} />
              </div>
              <span className="font-bold text-xs text-slate-700 dark:text-slate-300">Withdraw</span>
            </button>

            {/* Send Money Action */}
            <button className="flex flex-col items-center justify-center gap-3 active:scale-90 transition-transform group">
              <div className="w-14 h-14 bg-white dark:bg-[#18181b] rounded-[1.25rem] flex items-center justify-center shadow-lg shadow-blue-500/10 dark:shadow-blue-900/10 text-blue-500 group-hover:bg-blue-50 dark:group-hover:bg-blue-950/30 border border-slate-100 dark:border-slate-800 transition-all">
                <Send size={20} strokeWidth={2.5} className="ml-1" />
              </div>
              <span className="font-bold text-xs text-slate-700 dark:text-slate-300">Send</span>
            </button>

            {/* Bills Action */}
            <button className="flex flex-col items-center justify-center gap-3 active:scale-90 transition-transform group">
              <div className="w-14 h-14 bg-white dark:bg-[#18181b] rounded-[1.25rem] flex items-center justify-center shadow-lg shadow-amber-500/10 dark:shadow-amber-900/10 text-amber-500 group-hover:bg-amber-50 dark:group-hover:bg-amber-950/30 border border-slate-100 dark:border-slate-800 transition-all">
                <Receipt size={22} strokeWidth={2.5} />
              </div>
              <span className="font-bold text-xs text-slate-700 dark:text-slate-300">Bills</span>
            </button>
          </div>

          {/* Premium Transaction List */}
          <div className="flex-1 mt-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-bold text-slate-800 dark:text-white text-lg tracking-tight">Recent Activity</h3>
              <button className="text-purple-600 dark:text-purple-400 font-bold text-[13px] bg-purple-50 dark:bg-purple-900/20 px-3 py-1.5 rounded-full flex items-center gap-1 hover:bg-purple-100 dark:hover:bg-purple-900/40 transition-colors">
                 See All <ChevronRight size={14} className="stroke-[3]" />
              </button>
            </div>

            <div className="space-y-3 relative before:absolute before:left-[1.375rem] before:top-4 before:bottom-4 before:w-px before:bg-slate-200 dark:before:bg-slate-800">
              
              {/* Transaction 1 */}
              <div className="flex items-center justify-between p-4 bg-white dark:bg-[#18181b] rounded-[1.25rem] border border-slate-100 dark:border-slate-800/60 shadow-sm hover:shadow-md transition-shadow cursor-pointer relative z-10 group">
                <div className="flex items-center gap-4">
                  <div className="w-11 h-11 bg-emerald-50 dark:bg-emerald-950/40 rounded-full flex items-center justify-center text-emerald-500 dark:text-emerald-400 group-hover:scale-110 transition-transform ring-4 ring-white dark:ring-[#18181b]">
                    <ArrowDownLeft size={20} strokeWidth={2.5} />
                  </div>
                  <div>
                    <p className="font-bold text-slate-900 dark:text-white text-sm">Deposit from MTN</p>
                    <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 mt-0.5">Today, 10:45 AM</p>
                  </div>
                </div>
                <div className="text-right">
                   <span className="font-black text-emerald-600 dark:text-emerald-400 block">+ UGX 50,000</span>
                   <span className="text-[10px] font-bold text-emerald-600/60 dark:text-emerald-400/60 uppercase mt-0.5 inline-block">Completed</span>
                </div>
              </div>

              {/* Transaction 2 */}
              <div className="flex items-center justify-between p-4 bg-white dark:bg-[#18181b] rounded-[1.25rem] border border-slate-100 dark:border-slate-800/60 shadow-sm hover:shadow-md transition-shadow cursor-pointer relative z-10 group">
                <div className="flex items-center gap-4">
                  <div className="w-11 h-11 bg-rose-50 dark:bg-rose-950/40 rounded-full flex items-center justify-center text-rose-500 dark:text-rose-400 group-hover:scale-110 transition-transform ring-4 ring-white dark:ring-[#18181b]">
                    <ArrowUpRight size={20} strokeWidth={2.5} />
                  </div>
                  <div>
                    <p className="font-bold text-slate-900 dark:text-white text-sm">Landlord Rent Payment</p>
                    <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 mt-0.5">Yesterday, 14:20 PM</p>
                  </div>
                </div>
                <div className="text-right">
                   <span className="font-black text-slate-800 dark:text-slate-200 block">- UGX 350,000</span>
                   <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase mt-0.5 inline-block">Debited</span>
                </div>
              </div>
              
            </div>
          </div>
          
        </div>
      </div>

      <TenantDepositDialog isOpen={isDepositOpen} onClose={() => setIsDepositOpen(false)} />
      <TenantWithdrawDialog isOpen={isWithdrawOpen} onClose={() => setIsWithdrawOpen(false)} balance={balance} />
    </div>
  );
}
