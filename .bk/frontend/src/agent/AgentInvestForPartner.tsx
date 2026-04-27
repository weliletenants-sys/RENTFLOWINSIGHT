import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { ShieldCheck, UserCheck, ArrowRight, Wallet, Percent, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

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
    <div className="w-full min-h-screen bg-[#f7f9fa] text-[#9234eb] font-sans relative overflow-hidden selection:bg-[#9234eb]/20 pb-24 top-0 left-0 fixed z-50 overflow-y-auto">
      
      {/* Background ambient light representing top right glow */}
      <div className="fixed top-[-10%] right-[10%] w-[35rem] h-[35rem] bg-[#9234eb]/5 rounded-full blur-[100px] pointer-events-none z-0"></div>

      <header className="fixed top-0 left-0 right-0 z-50 w-full border-b border-purple-100 bg-white/80 backdrop-blur-md px-4 py-4">
        <div className="max-w-xl mx-auto flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-xl text-[#9234eb]/50 hover:text-[#9234eb] hover:bg-purple-50 transition-colors">
             <ArrowLeft size={24} />
          </button>
          <div>
              <h1 className="text-xl font-bold text-[#9234eb] leading-none mb-1">Invest For Supporter</h1>
              <p className="text-xs font-bold text-[#9234eb]/50 uppercase tracking-widest">Proxy Portal</p>
          </div>
        </div>
      </header>

      <main className="max-w-xl mx-auto px-4 pt-28 space-y-6 relative z-10">
        
        <motion.div 
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.5 }}
           className="relative overflow-hidden rounded-[1.8rem]"
        >
           {/* Soft purple shadow blur behind the card */}
           <div className="absolute inset-x-0 inset-y-2 bg-[#9234eb] rounded-[2rem] blur-2xl opacity-20"></div>
           
           <div className="relative bg-gradient-to-br from-[#9234eb] to-[#6a15ba] text-white p-8 shadow-[0_20px_40px_-10px_rgba(146,52,235,0.4)] rounded-[1.8rem] ring-1 ring-inset ring-white/10 overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                 <ShieldCheck size={140} strokeWidth={1} />
              </div>
              <h2 className="text-2xl font-black mb-2 tracking-tight">Proxy Capital Deployment</h2>
              <p className="text-sm font-medium text-white/80 max-w-[280px] leading-relaxed">
                Instantly leverage your available float to fund a supporter portfolio. Earn exactly 2% direct commission upon manager execution.
              </p>
           </div>
        </motion.div>

        <form onSubmit={handleInvest} className="space-y-6">
          <motion.div 
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.5, delay: 0.1 }}
             className="bg-white p-7 rounded-3xl shadow-[0_15px_40px_-15px_rgba(146,52,235,0.15)] border border-purple-100 relative overflow-hidden"
          >
             <h3 className="text-sm font-black uppercase tracking-widest text-[#9234eb] mb-5">Partner Details</h3>
             
             <div className="space-y-5">
                <div>
                  <label className="text-xs font-bold text-[#9234eb]/60 uppercase tracking-widest mb-1.5 block">Supporter Registered Phone</label>
                  <div className="relative">
                    <UserCheck className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9234eb]/40" size={20} />
                    <input 
                      type="tel"
                      value={partnerPhone}
                      onChange={(e) => setPartnerPhone(e.target.value)}
                      placeholder="e.g. 077XXXXXXXX"
                      className="w-full bg-[#f7f9fa] border border-purple-100 rounded-xl py-3.5 pl-12 pr-4 text-[15px] font-bold text-[#9234eb] outline-none focus:border-[#9234eb] focus:ring-1 focus:ring-[#9234eb] transition-all placeholder:text-[#9234eb]/30"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-[#9234eb]/60 uppercase tracking-widest mb-1.5 block">Capital Amount (UGX)</label>
                  <div className="relative">
                    <Wallet className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9234eb]/40" size={20} />
                    <input 
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="Min. 100,000"
                      className="w-full bg-[#f7f9fa] border border-purple-100 rounded-xl py-3.5 pl-12 pr-4 text-[15px] font-black text-[#9234eb] outline-none focus:border-[#9234eb] focus:ring-1 focus:ring-[#9234eb] transition-all placeholder:text-[#9234eb]/20 tracking-tight"
                      required
                    />
                  </div>
                </div>
             </div>
          </motion.div>

          {numericAmount > 0 && (
            <motion.div 
               initial={{ opacity: 0, scale: 0.95 }}
               animate={{ opacity: 1, scale: 1 }}
               transition={{ duration: 0.4 }}
               className="bg-white rounded-3xl p-6 shadow-[0_15px_40px_-15px_rgba(146,52,235,0.15)] border border-purple-100 flex flex-col items-center text-center relative overflow-hidden"
            >
               <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-200 via-white to-white pointer-events-none"></div>
               
               <p className="text-xs font-bold text-[#9234eb]/50 tracking-widest uppercase mb-1 z-10">Your Retained Commission</p>
               <h3 className="text-4xl font-black text-emerald-500 tracking-tight z-10 mb-5">
                  +{agentCommission.toLocaleString()} UGX
               </h3>
               
               <div className="w-full bg-[#f7f9fa] border border-purple-100 rounded-2xl p-4 flex justify-between items-center text-left z-10 shadow-sm">
                  <div>
                     <span className="block text-[10px] font-bold uppercase tracking-widest text-[#9234eb]/50">Deduction from Float</span>
                     <span className="block text-sm font-black text-[#9234eb]">UGX {numericAmount.toLocaleString()}</span>
                  </div>
                  <div className="bg-purple-100 p-2 rounded-xl text-[#9234eb]">
                     <Percent size={18} strokeWidth={2.5} />
                  </div>
               </div>
            </motion.div>
          )}

          <motion.div
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.5, delay: 0.2 }}
          >
             <button 
               type="submit" 
               disabled={loading || numericAmount < 100000}
               className="w-full bg-[#9234eb] disabled:opacity-50 disabled:hover:scale-100 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-[#7823c6] transition-all hover:scale-[1.02] active:scale-95 shadow-lg shadow-[#9234eb]/20 mt-2"
             >
               {loading ? <div className="size-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <ArrowRight size={20} />}
               <span>{loading ? 'Processing...' : 'Authorize Investment Draw'}</span>
             </button>
          </motion.div>
        </form>
      </main>
    </div>
  );
}
