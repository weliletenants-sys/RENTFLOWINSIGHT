import { X, ArrowDownRight, ArrowUpRight, History } from 'lucide-react';

interface FullScreenWalletSheetProps {
  isOpen: boolean;
  onClose: () => void;
  balance: number;
}

export default function FullScreenWalletSheet({ isOpen, onClose, balance }: FullScreenWalletSheetProps) {
  return (
    <div
      className={`fixed inset-0 bg-white dark:bg-slate-900 z-[60] flex flex-col transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] ${isOpen ? 'translate-y-0' : 'translate-y-full'}`}
    >
      {/* Header */}
      <div className="flex justify-between items-center p-6 border-b border-gray-100 dark:border-slate-800 shrink-0 transition-colors">
        <h2 className="font-bold text-gray-900 dark:text-white text-xl">My Wallet</h2>
        <button onClick={onClose} className="w-10 h-10 bg-gray-50 dark:bg-slate-800 rounded-full flex items-center justify-center text-gray-400 dark:text-slate-500 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors active:scale-95">
          <X size={20} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-8">

        {/* Balance Card */}
        <div className="bg-gradient-to-br from-emerald-500 to-teal-600 dark:from-[#2e7d32] dark:to-[#004d40] rounded-[2rem] p-8 text-white shadow-xl shadow-emerald-500/20 dark:shadow-none text-center relative overflow-hidden transition-colors">
          <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>

          <p className="text-emerald-100 dark:text-emerald-50 font-medium mb-2 relative z-10 transition-colors">Available Balance</p>
          <div className="flex items-baseline justify-center gap-2 relative z-10">
            <span className="text-2xl font-bold opacity-80">UGX</span>
            <span className="text-5xl font-black tracking-tight">{balance.toLocaleString()}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-4">
          <button className="bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl p-4 flex flex-col items-center justify-center gap-3 active:scale-95 transition-colors group">
            <div className="w-12 h-12 bg-white dark:bg-slate-700 rounded-full flex items-center justify-center shadow-sm text-emerald-600 dark:text-emerald-400 transition-colors">
              <ArrowDownRight size={20} strokeWidth={2.5} />
            </div>
            <span className="font-bold text-sm text-gray-900 dark:text-slate-300 transition-colors">Deposit</span>
          </button>

          <button className="bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl p-4 flex flex-col items-center justify-center gap-3 active:scale-95 transition-colors group">
            <div className="w-12 h-12 bg-white dark:bg-slate-700 rounded-full flex items-center justify-center shadow-sm text-blue-600 dark:text-blue-400 transition-colors">
              <ArrowUpRight size={20} strokeWidth={2.5} />
            </div>
            <span className="font-bold text-sm text-gray-900 dark:text-slate-300 transition-colors">Withdraw</span>
          </button>
        </div>

        {/* Recent Transactions */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-900 dark:text-white text-lg transition-colors">Recent Transactions</h3>
            <button className="text-[#512DA8] dark:text-purple-400 font-bold text-sm flex items-center gap-1 transition-colors hover:text-purple-600 dark:hover:text-purple-300">
              View All <History size={16} />
            </button>
          </div>

          <div className="space-y-4">
            {/* Mock TX 1 */}
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center shrink-0 transition-colors">
                  <ArrowDownRight size={18} />
                </div>
                <div>
                  <p className="font-bold text-gray-900 dark:text-white text-sm transition-colors">Deposit from MTN</p>
                  <p className="text-xs text-gray-500 dark:text-slate-400 font-medium mt-0.5 transition-colors">Today, 10:45 AM</p>
                </div>
              </div>
              <span className="font-black text-emerald-600 dark:text-emerald-400 transition-colors">+ UGX 50,000</span>
            </div>

            {/* Mock TX 2 */}
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-red-100 dark:bg-rose-500/20 text-red-600 dark:text-rose-400 rounded-full flex items-center justify-center shrink-0 transition-colors">
                  <ArrowUpRight size={18} />
                </div>
                <div>
                  <p className="font-bold text-gray-900 dark:text-white text-sm transition-colors">Landlord Rent Payment</p>
                  <p className="text-xs text-gray-500 dark:text-slate-400 font-medium mt-0.5 transition-colors">Yesterday, 14:20 PM</p>
                </div>
              </div>
              <span className="font-black text-gray-900 dark:text-white transition-colors">- UGX 350,000</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
