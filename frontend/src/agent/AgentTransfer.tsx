import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

export default function AgentTransfer() {
  const navigate = useNavigate();
  const [amount, setAmount] = useState<string>('');
  
  const INITIAL_BALANCE = 1450000;
  const FEE = 0; // Transfers are free
  
  const amountValue = parseInt(amount) || 0;
  const totalDeduction = amountValue > 0 ? amountValue + FEE : 0;
  const remaining = INITIAL_BALANCE - totalDeduction;

  const handleSetAmount = (val: number) => {
    setAmount(val.toString());
  };

  const handleTransfer = (e: React.FormEvent) => {
    e.preventDefault();
    if (remaining < 0) {
      alert("Insufficient funds!");
      return;
    }
    alert("Transfer successful! (Mocked)");
    navigate(-1);
  };

  return (
    <div className="bg-white min-h-screen text-slate-900 font-['Inter',_sans-serif]">
      
      {/* StickyHeader */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <button 
                onClick={() => navigate(-1)} 
                aria-label="Go back" 
                className="p-2 -ml-2 hover:bg-slate-100 rounded-full transition-colors"
               >
                <ArrowLeft size={24} />
              </button>
              <h1 className="ml-4 text-xl font-semibold">Transfer</h1>
            </div>
            <div className="w-10"></div>
          </div>
        </div>
      </header>

      {/* MainContent */}
      <main className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-[500px] mx-auto bg-white md:rounded-2xl md:shadow-xl md:shadow-slate-200/50 md:p-8">
          
          {/* WalletBalanceHeader */}
          <section className="mb-8">
            <p className="text-slate-500 text-sm font-medium mb-1">Available Balance</p>
            <h2 className="text-3xl font-bold tracking-tight">UGX {INITIAL_BALANCE.toLocaleString()}</h2>
          </section>

          {/* TransferForm */}
          <form onSubmit={handleTransfer} className="space-y-6">
            
            {/* Recipient Input */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2" htmlFor="recipient">Recipient</label>
              <div className="relative">
                <input 
                  type="text" 
                  id="recipient" 
                  name="recipient" 
                  placeholder="Enter recipient phone or user ID" 
                  className="block w-full rounded-xl border-slate-200 py-3.5 pl-4 pr-12 focus:border-[#6d28d9] focus:ring-[#6d28d9] text-base outline-none border focus:ring-1 transition-all" 
                  required
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer text-slate-400 hover:text-[#6d28d9] transition-colors">
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
                  </svg>
                </div>
              </div>
            </div>

            {/* Amount Input */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2" htmlFor="amount">Amount</label>
              <div className="relative mb-3">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <span className="text-slate-500 font-medium">UGX</span>
                </div>
                <input 
                  type="number" 
                  id="amount" 
                  name="amount" 
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0" 
                  className="block w-full rounded-xl border-slate-200 py-3.5 pl-16 pr-4 focus:border-[#6d28d9] focus:ring-[#6d28d9] text-xl font-semibold outline-none border focus:ring-1 transition-all" 
                  required
                />
              </div>
              
              {/* Quick Select Buttons */}
              <div className="flex gap-2">
                <button type="button" onClick={() => handleSetAmount(10000)} className="flex-1 py-2 px-3 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-100 hover:border-slate-300 transition-all">10,000</button>
                <button type="button" onClick={() => handleSetAmount(50000)} className="flex-1 py-2 px-3 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-100 hover:border-slate-300 transition-all">50,000</button>
                <button type="button" onClick={() => handleSetAmount(100000)} className="flex-1 py-2 px-3 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-100 hover:border-slate-300 transition-all">100,000</button>
              </div>
            </div>

            {/* Transaction Summary Card */}
            <div className="bg-slate-50 border border-slate-100 rounded-xl p-5 space-y-3">
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500">Transaction Fee</span>
                <span className="font-bold text-emerald-600">Free</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500">Total Deduction</span>
                <span className="font-semibold text-slate-900">UGX {totalDeduction.toLocaleString()}</span>
              </div>
              
              <div className="pt-2 border-t border-slate-200 flex justify-between items-center text-sm">
                <span className="text-slate-500">Remaining Balance</span>
                <span className={`font-semibold ${remaining < 0 ? 'text-red-500' : 'text-slate-900'}`}>
                  UGX {remaining.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Optional Note */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2" htmlFor="note">Note (Optional)</label>
              <textarea 
                id="note" 
                name="note" 
                placeholder="What is this for?" 
                rows={3} 
                className="block w-full rounded-xl border-slate-200 p-4 focus:border-[#6d28d9] focus:ring-[#6d28d9] resize-none text-base outline-none border focus:ring-1 transition-all"
              ></textarea>
            </div>

            {/* Action Button */}
            <div className="pt-4">
              <button 
                type="submit" 
                className="w-full bg-[#6d28d9] hover:bg-[#5b21b6] text-white font-bold py-4 px-6 rounded-xl shadow-lg shadow-[#6d28d9]/20 transition-all transform active:scale-[0.98]"
              >
                Send Transfer
              </button>
            </div>
          </form>

        </div>
      </main>
    </div>
  );
}
