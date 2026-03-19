import { X, ArrowDownRight, ArrowUpRight, History } from 'lucide-react';

interface FullScreenWalletSheetProps {
  isOpen: boolean;
  onClose: () => void;
  balance: number;
}

export default function FullScreenWalletSheet({ isOpen, onClose, balance }: FullScreenWalletSheetProps) {
  return (
    <div 
      className={`fixed inset-0 bg-white z-[60] flex flex-col transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] ${isOpen ? 'translate-y-0' : 'translate-y-full'}`}
    >
      {/* Header */}
      <div className="flex justify-between items-center p-6 border-b border-gray-100 shrink-0">
        <h2 className="font-bold text-gray-900 text-xl">My Wallet</h2>
        <button onClick={onClose} className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center text-gray-400 hover:bg-gray-100 transition active:scale-95">
          <X size={20} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-8">
        
        {/* Balance Card */}
        <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-[2rem] p-8 text-white shadow-xl shadow-emerald-500/20 text-center relative overflow-hidden">
          <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
          
          <p className="text-emerald-100 font-medium mb-2 relative z-10">Available Balance</p>
          <div className="flex items-baseline justify-center gap-2 relative z-10">
            <span className="text-2xl font-bold opacity-80">UGX</span>
            <span className="text-5xl font-black tracking-tight">{balance.toLocaleString()}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-4">
          <button className="bg-gray-50 border border-gray-200 rounded-2xl p-4 flex flex-col items-center justify-center gap-3 active:scale-95 transition">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm text-emerald-600">
              <ArrowDownRight size={20} strokeWidth={2.5} />
            </div>
            <span className="font-bold text-sm text-gray-900">Deposit</span>
          </button>
          
          <button className="bg-gray-50 border border-gray-200 rounded-2xl p-4 flex flex-col items-center justify-center gap-3 active:scale-95 transition">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm text-blue-600">
              <ArrowUpRight size={20} strokeWidth={2.5} />
            </div>
            <span className="font-bold text-sm text-gray-900">Withdraw</span>
          </button>
        </div>

        {/* Recent Transactions */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-900 text-lg">Recent Transactions</h3>
            <button className="text-[#512DA8] font-bold text-sm flex items-center gap-1">
              View All <History size={16} />
            </button>
          </div>
          
          <div className="space-y-4">
            {/* Mock TX 1 */}
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center shrink-0">
                  <ArrowDownRight size={18} />
                </div>
                <div>
                  <p className="font-bold text-gray-900 text-sm">Deposit from MTN</p>
                  <p className="text-xs text-gray-500 font-medium mt-0.5">Today, 10:45 AM</p>
                </div>
              </div>
              <span className="font-black text-emerald-600">+ UGX 50,000</span>
            </div>

            {/* Mock TX 2 */}
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-red-100 text-red-600 rounded-full flex items-center justify-center shrink-0">
                  <ArrowUpRight size={18} />
                </div>
                <div>
                  <p className="font-bold text-gray-900 text-sm">Landlord Rent Payment</p>
                  <p className="text-xs text-gray-500 font-medium mt-0.5">Yesterday, 14:20 PM</p>
                </div>
              </div>
              <span className="font-black text-gray-900">- UGX 350,000</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
