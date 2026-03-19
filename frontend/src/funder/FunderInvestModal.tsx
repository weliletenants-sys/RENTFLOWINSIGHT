import { useState } from 'react';
import axios from 'axios';
import { X, ArrowRight, ShieldCheck } from 'lucide-react';

interface FunderInvestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (amount: number) => void;
  walletBalance: number;
}

export default function FunderInvestModal({ isOpen, onClose, onSuccess, walletBalance }: FunderInvestModalProps) {
  const [amount, setAmount] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = parseInt(amount.replace(/,/g, ''), 10);
    
    if (isNaN(numAmount) || numAmount <= 0) {
      alert('Please enter a valid amount.');
      return;
    }
    if (numAmount > walletBalance) {
      alert('Insufficient wallet balance.');
      return;
    }

    setIsSubmitting(true);
    
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:3000/api/supporter/fund-pool', 
        { amount: numAmount },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      onSuccess(numAmount);
      onClose();
    } catch (error: any) {
      console.error('Investment failed:', error);
      alert(error.response?.data?.message || 'Transaction failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/[^0-9]/g, '');
    if (val) {
      setAmount(parseInt(val, 10).toLocaleString());
    } else {
      setAmount('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-gray-900/60 backdrop-blur-sm">
      <div className="bg-white w-full max-w-sm rounded-[2rem] shadow-2xl overflow-hidden relative animate-in fade-in slide-in-from-bottom-8">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center bg-gray-100 text-gray-500 rounded-full hover:bg-gray-200 transition"
        >
          <X size={18} strokeWidth={2} />
        </button>

        <div className="p-6 pt-8">
          <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-2xl flex items-center justify-center mb-4">
            <ShieldCheck size={24} strokeWidth={2} />
          </div>
          
          <h2 className="text-2xl font-black text-gray-900 tracking-tight mb-2">Fund Rent Pool</h2>
          <p className="text-sm text-gray-500 font-medium mb-6">
            Support directly into the rent pool to start earning 15% monthly compounding interest.
          </p>

          <div className="mb-6 bg-gray-50 p-4 rounded-2xl border border-gray-100 flex justify-between items-center">
            <span className="text-xs text-gray-500 font-bold uppercase tracking-wider">Available Balance</span>
            <span className="font-black text-gray-900 text-lg">UGX {walletBalance.toLocaleString()}</span>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="relative">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1 mb-1 block">Support Amount (UGX)</label>
              <input
                type="text"
                value={amount}
                onChange={handleAmountChange}
                placeholder="0"
                className="w-full bg-white border-2 border-gray-200 rounded-2xl py-4 px-4 text-gray-900 font-black text-xl focus:outline-none focus:border-[#512DA8] focus:ring-4 focus:ring-purple-500/10 transition"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting || !amount}
              className={`w-full py-4 rounded-2xl font-bold text-[15px] shadow-lg flex items-center justify-center gap-2 transition active:scale-[0.98] mt-2 ${
                isSubmitting || !amount ? 'bg-purple-300 text-white cursor-not-allowed' : 'bg-[#512DA8] hover:bg-[#412387] text-white'
              }`}
            >
              {isSubmitting ? 'Processing...' : 'Confirm Funding'} 
              {!isSubmitting && <ArrowRight size={18} />}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
