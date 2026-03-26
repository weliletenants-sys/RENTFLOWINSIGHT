import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { ShieldCheck, UserCheck, ArrowRight, Wallet, Percent, ArrowLeft } from 'lucide-react';

export default function AgentInvestForPartner() {
  const navigate = useNavigate();
  const [partnerPhone, setPartnerPhone] = useState('');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Calculate potential metrics
  const numericAmount = Number(amount) || 0;
  const agentCommission = Math.floor(numericAmount * 0.02); // 2% facilitation bonus

  const handleInvest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (numericAmount < 100000) {
      toast.error('Minimum proxy investment is UGX 100,000');
      return;
    }
    
    setLoading(true);
    try {
      await axios.post('/api/v1/agent/proxy-investments', {
        partner_phone: partnerPhone,
        investment_amount: numericAmount,
        partner_name: 'Validated Partner' // In real integration, look up partner name by phone
      });
      toast.success('Proxy investment queued for Manager approval. 2% Commission reserved.');
      navigate('/dashboard');
    } catch (err: any) {
      toast.error(err.response?.data?.detail || 'Failed to request proxy investment');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#f8f6f6] dark:bg-[#221610] text-slate-900 dark:text-slate-100 antialiased min-h-screen font-['Public_Sans'] pb-24 top-0 left-0 fixed w-full z-50 overflow-y-auto">
      <header className="fixed top-0 left-0 right-0 z-50 w-full border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-[#221610]/80 backdrop-blur-md px-4 py-4">
        <div className="max-w-xl mx-auto flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800">
             <ArrowLeft size={24} />
          </button>
          <div>
              <h1 className="text-xl font-bold font-outfit text-slate-900 dark:text-white leading-none mb-1">Invest For Supporter</h1>
              <p className="text-xs font-medium text-slate-500">Proxy Investment Portal</p>
          </div>
        </div>
      </header>

      <main className="max-w-xl mx-auto px-4 pt-24 space-y-6">
        <div className="bg-[#6c11d4] text-white p-6 rounded-2xl shadow-lg relative overflow-hidden">
           <div className="absolute top-0 right-0 p-4 opacity-5">
              <ShieldCheck size={120} />
           </div>
           <h2 className="text-xl font-bold font-outfit mb-2">Proxy Capital Deployment</h2>
           <p className="text-sm font-medium text-white/80 max-w-sm mb-6">
             Instantly leverage your available float to fund a supporter portfolio. Earn 2% direct commission immediately upon execution.
           </p>
        </div>

        <form onSubmit={handleInvest} className="space-y-6">
          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700">
             <h3 className="text-sm font-bold uppercase tracking-widest text-[#6c11d4] mb-4">Partner details</h3>
             
             <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-500 mb-1.5 block">Supporter Registered Phone</label>
                  <div className="relative">
                    <UserCheck className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                    <input 
                      type="tel"
                      value={partnerPhone}
                      onChange={(e) => setPartnerPhone(e.target.value)}
                      placeholder="e.g. 077XXXXXXXX"
                      className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl py-3.5 pl-12 pr-4 text-sm font-bold outline-none focus:border-[#6c11d4] transition-colors"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-500 mb-1.5 block">Capital Amount (UGX)</label>
                  <div className="relative">
                    <Wallet className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                    <input 
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="e.g. 500000"
                      className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl py-3.5 pl-12 pr-4 text-sm font-bold outline-none focus:border-[#6c11d4] transition-colors"
                      required
                    />
                  </div>
                </div>
             </div>
          </div>

          <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-xl relative overflow-hidden flex flex-col items-center text-center">
             <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-400 via-slate-900 to-slate-900"></div>
             <p className="text-xs font-bold text-slate-400 tracking-widest uppercase mb-1 z-10">Your Retained Commission</p>
             <h3 className="text-4xl font-black font-outfit text-emerald-400 tracking-tight z-10 mb-4">
                +{agentCommission.toLocaleString()} UGX
             </h3>
             <div className="w-full bg-slate-800 rounded-xl p-4 flex justify-between items-center text-left z-10">
                <div>
                   <span className="block text-xs text-slate-400">Deduction from Float</span>
                   <span className="block text-sm font-bold text-slate-200">UGX {numericAmount.toLocaleString()}</span>
                </div>
                <Percent className="text-slate-500" />
             </div>
          </div>

          <button 
            type="submit" 
            disabled={loading || numericAmount < 100000}
            className="w-full bg-[#6c11d4] disabled:opacity-50 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-[#580eb0] transition-colors shadow-lg shadow-[#6c11d4]/30"
          >
            {loading ? <div className="size-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <ArrowRight size={20} />}
            <span>{loading ? 'Processing...' : 'Authorize Investment Draw'}</span>
          </button>
        </form>
      </main>
    </div>
  );
}
