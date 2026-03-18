import { useNavigate } from 'react-router-dom';
import { Home, Wallet, Users, Settings, PlusCircle, ArrowDown, Send, FileText, Download } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AgentWallet() {
  const navigate = useNavigate();
  const balance = 1450000; // Mock balance

  const handleDownloadStatement = () => {
    // Mock download action
    alert("Downloading wallet statement PDF...");
  };

  return (
    <div className="bg-[#f8f6f6] dark:bg-[#221610] text-slate-900 dark:text-slate-100 antialiased min-h-screen font-['Public_Sans'] pb-20">
      <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden pt-4">
        
        {/* Header */}
        <header className="px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Your Wallet</h1>
        </header>

        <main className="flex-1 w-full max-w-5xl mx-auto px-4 py-2 space-y-6">

          {/* Wallet Card */}
          <motion.section 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="mb-6 relative overflow-hidden bg-[#6d28d9] rounded-2xl p-6 text-white shadow-xl shadow-[#6d28d9]/20"
          >
            {/* Abstract Background Patterns */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-black/10 rounded-full -ml-12 -mb-12 blur-xl"></div>
            
            <div className="relative z-10">
              <p className="text-white/80 text-sm font-medium uppercase tracking-widest">Available Balance</p>
              <div className="flex items-center justify-between mt-1">
                <h2 className="text-4xl font-extrabold tracking-tight">UGX {balance.toLocaleString()}</h2>
              </div>
            </div>
            
            {/* Action Buttons Grid */}
            <div className="grid grid-cols-3 gap-3 mt-8 relative z-10">
              <button 
                onClick={() => navigate('/agent-deposit')}
                className="flex flex-col items-center justify-center gap-2 py-3 bg-white/10 hover:bg-white/20 border border-white/10 backdrop-blur-sm rounded-xl transition-colors shadow-sm"
              >
                <PlusCircle size={24} className="text-white" />
                <span className="text-xs font-bold uppercase">Deposit</span>
              </button>
              
              <button 
                onClick={() => navigate('/agent-withdraw')}
                className="flex flex-col items-center justify-center gap-2 py-3 bg-white/10 hover:bg-white/20 border border-white/10 backdrop-blur-sm rounded-xl transition-colors shadow-sm"
              >
                <ArrowDown size={24} className="text-white" />
                <span className="text-xs font-bold uppercase">Withdraw</span>
              </button>
              
              <button 
                onClick={() => navigate('/agent-transfer')}
                className="flex flex-col items-center justify-center gap-2 py-3 bg-white/10 hover:bg-white/20 border border-white/10 backdrop-blur-sm rounded-xl transition-colors shadow-sm"
              >
                <Send size={24} className="text-white" />
                <span className="text-xs font-bold uppercase">Send</span>
              </button>
            </div>
          </motion.section>

          {/* Statement Section */}
          <motion.section 
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.4, delay: 0.1 }}
             className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-700"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center">
                  <FileText size={20} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">Wallet Statement</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">View or download your transaction history</p>
                </div>
              </div>
            </div>
            
            <button 
              onClick={handleDownloadStatement}
              className="w-full mt-2 py-4 flex items-center justify-center gap-2 bg-slate-50 hover:bg-slate-100 dark:bg-slate-700/50 dark:hover:bg-slate-700 rounded-xl text-slate-700 dark:text-slate-300 font-bold transition-all border border-slate-200 dark:border-slate-600 border-dashed"
            >
              <Download size={18} />
              Download PDF Statement
            </button>
          </motion.section>

          {/* Recent Activity Placeholders */}
          <motion.section 
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.4, delay: 0.2 }}
             className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-700"
          >
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4">Recent Activity</h3>
            <div className="space-y-4">
               {/* Activity items can be dynamically mapped here */}
               <div className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-700/50 last:border-0 last:pb-0">
                  <div className="flex flex-col">
                     <span className="font-semibold text-slate-800 dark:text-slate-200 text-sm">Commission Earned</span>
                     <span className="text-xs text-slate-400">Today, 2:45 PM</span>
                  </div>
                  <span className="text-green-600 font-bold text-sm">+ UGX 15,000</span>
               </div>
               <div className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-700/50 last:border-0 last:pb-0">
                  <div className="flex flex-col">
                     <span className="font-semibold text-slate-800 dark:text-slate-200 text-sm">Withdrawal to Bank</span>
                     <span className="text-xs text-slate-400">Yesterday, 9:20 AM</span>
                  </div>
                  <span className="text-slate-700 dark:text-slate-300 font-bold text-sm">- UGX 200,000</span>
               </div>
               <div className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-700/50 last:border-0 last:pb-0">
                  <div className="flex flex-col">
                     <span className="font-semibold text-slate-800 dark:text-slate-200 text-sm">Commission Earned</span>
                     <span className="text-xs text-slate-400">Oct 12, 4:10 PM</span>
                  </div>
                  <span className="text-green-600 font-bold text-sm">+ UGX 30,000</span>
               </div>
            </div>
            
            <button className="w-full mt-4 py-3 text-sm font-bold text-[#6d28d9] bg-[#6d28d9]/5 hover:bg-[#6d28d9]/10 rounded-xl transition-colors">
              View All Transactions
            </button>
          </motion.section>

        </main>

        <nav className="md:hidden fixed bottom-0 left-0 w-full bg-white dark:bg-[#221610] border-t border-slate-200 dark:border-slate-800 px-6 py-3 flex items-center justify-between z-50">
          <button onClick={() => navigate('/dashboard')} className="flex flex-col items-center gap-1 text-slate-400 hover:text-[#6d28d9] transition-colors">
            <Home size={24} />
            <span className="text-[10px] font-bold">Home</span>
          </button>
          <button className="flex flex-col items-center gap-1 text-[#6d28d9]">
            <Wallet size={24} />
            <span className="text-[10px] font-bold">Wallet</span>
          </button>
          <button onClick={() => navigate('/dashboard/agent/clients')} className="flex flex-col items-center gap-1 text-slate-400 hover:text-[#6d28d9] transition-colors">
            <Users size={24} />
            <span className="text-[10px] font-bold">Clients</span>
          </button>
          <button onClick={() => navigate('/dashboard/agent/settings')} className="flex flex-col items-center gap-1 text-slate-400 hover:text-[#6d28d9] transition-colors">
            <Settings size={24} />
            <span className="text-[10px] font-bold">Settings</span>
          </button>
        </nav>
      </div>
    </div>
  );
}
