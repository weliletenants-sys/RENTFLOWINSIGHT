import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Share2, Copy, Users, Gift, CheckCircle2, Clock, Medal, Flame } from 'lucide-react';

export default function TenantReferrals() {
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);
  
  const referralCode = "WF-KAMPALA-24X";
  const referralLink = `https://app.welile.com/join/${referralCode}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Join Welile Homes',
        text: 'Sign up for Welile to build your rent credit and access flexible payments!',
        url: referralLink,
      }).catch(console.error);
    } else {
      handleCopy();
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 font-sans text-slate-900 dark:text-slate-100 pb-20 selection:bg-purple-100 transition-colors duration-300">
      
      {/* Header */}
      <div className="w-full bg-[#8b5cf6] dark:bg-[#6b45c2] pt-6 pb-24 px-6 md:px-12 relative rounded-b-[2.5rem] shadow-xl shadow-purple-600/20 dark:shadow-none overflow-hidden transition-colors duration-300">
         {/* Background Decoration */}
         <div className="absolute -top-10 -right-10 p-8 opacity-10">
            <Share2 size={220} />
         </div>

         <div className="flex items-center gap-6 relative z-10">
            <button 
              onClick={() => navigate(-1)} 
              className="text-white hover:bg-white/10 p-2 rounded-full transition-colors flex items-center justify-center cursor-pointer"
            >
               <ArrowLeft size={24} />
            </button>
            <h1 className="text-xl font-bold text-white tracking-wide">Share & Earn</h1>
         </div>

         <div className="relative z-10 mt-8">
            <div className="inline-flex items-center gap-2 bg-purple-500/30 text-purple-100 px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-widest mb-3 backdrop-blur-sm border border-purple-400/30 shadow-sm transition-colors">
               <Flame size={13} strokeWidth={2.5} /> Double Bonus Week
            </div>
            <h2 className="text-[32px] font-black text-white leading-[1.1] tracking-tight">Invite Friends,<br/>Earn Cash.</h2>
         </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-2xl mx-auto px-4 md:px-8 -mt-14 relative z-10 flex flex-col gap-5">
         
         {/* Referral Code Card */}
         <div className="w-full bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.06)] dark:shadow-none border border-slate-100 dark:border-slate-700 flex flex-col items-center transition-colors duration-300">
            
            <p className="text-[13px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-4 transition-colors">Your Referral Link</p>
            
            <div className="w-full bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-2xl p-4 flex items-center justify-between mb-4 transition-colors">
               <span className="font-mono font-bold text-slate-800 dark:text-white text-sm truncate pr-4 transition-colors">{referralLink}</span>
               <button 
                 onClick={handleCopy} 
                 className={`p-2 rounded-xl transition-colors shrink-0 cursor-pointer ${copied ? 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400' : 'bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-600'}`}
               >
                 {copied ? <CheckCircle2 size={18} /> : <Copy size={18} />}
               </button>
            </div>

            <button onClick={handleShare} className="w-full bg-[#4f46e5] dark:bg-[#4338ca] text-white py-3.5 rounded-xl font-bold shadow-lg shadow-indigo-500/25 dark:shadow-none hover:bg-indigo-600 dark:hover:bg-indigo-500 transition-all hover:-translate-y-0.5 active:translate-y-0 flex justify-center items-center gap-2 text-[14px] cursor-pointer">
              <Share2 strokeWidth={2.5} size={18}/> Share with Network
            </button>            

            <div className="grid grid-cols-2 gap-4 w-full mt-6 pt-6 border-t border-slate-100 dark:border-slate-700 transition-colors">
               <div className="text-center">
                  <p className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1 transition-colors">Total Earned</p>
                  <p className="text-xl font-black text-emerald-600 dark:text-emerald-400 transition-colors">UGX 50K</p>
               </div>
               <div className="text-center">
                  <p className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1 transition-colors">Friends Joined</p>
                  <p className="text-xl font-black text-indigo-600 dark:text-indigo-400 transition-colors">5</p>
               </div>
            </div>
         </div>

         {/* How it Works */}
         <h3 className="text-[13px] font-bold text-slate-800 dark:text-white mt-2 px-1 transition-colors">How it works</h3>
         <div className="grid grid-cols-3 gap-3">
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-sm border border-slate-100 dark:border-slate-700 flex flex-col items-center text-center transition-colors">
               <div className="w-10 h-10 bg-indigo-50 dark:bg-indigo-500/20 rounded-full flex items-center justify-center text-indigo-600 dark:text-indigo-400 mb-3 transition-colors"><Share2 size={18}/></div>
               <h4 className="text-[11px] font-extrabold text-slate-800 dark:text-white mb-1 transition-colors">1. Share</h4>
               <p className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold leading-relaxed transition-colors">Send your code to a friend.</p>
            </div>
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-sm border border-slate-100 dark:border-slate-700 flex flex-col items-center text-center transition-colors">
               <div className="w-10 h-10 bg-purple-50 dark:bg-purple-500/20 rounded-full flex items-center justify-center text-purple-600 dark:text-purple-400 mb-3 transition-colors"><Users size={18}/></div>
               <h4 className="text-[11px] font-extrabold text-slate-800 dark:text-white mb-1 transition-colors">2. Join</h4>
               <p className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold leading-relaxed transition-colors">They create an account.</p>
            </div>
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-sm border border-slate-100 dark:border-slate-700 flex flex-col items-center text-center transition-colors">
               <div className="w-10 h-10 bg-emerald-50 dark:bg-emerald-500/20 rounded-full flex items-center justify-center text-emerald-600 dark:text-emerald-400 mb-3 transition-colors"><Gift size={18}/></div>
               <h4 className="text-[11px] font-extrabold text-slate-800 dark:text-white mb-1 transition-colors">3. Earn</h4>
               <p className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold leading-relaxed transition-colors">You both get 10k UGX!</p>
            </div>
         </div>

         {/* My Network */}
         <div className="w-full bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-sm border border-slate-200/60 dark:border-slate-700 mt-3 mb-8 transition-colors duration-300">
            <div className="flex items-center gap-2 mb-5">
               <div className="bg-indigo-50 dark:bg-indigo-500/20 p-1.5 rounded-lg transition-colors">
                  <Medal size={18} className="text-indigo-500 dark:text-indigo-400 transition-colors" />
               </div>
               <h3 className="font-bold text-slate-800 dark:text-white text-[15px] transition-colors">My Network</h3>
            </div>
            
            <div className="space-y-4">
               {[
                 { id: 1, name: 'Grace K.', date: 'Joined Mar 24', status: 'completed', reward: '+10,000 UGX' },
                 { id: 2, name: 'David M.', date: 'Joined Mar 20', status: 'completed', reward: '+10,000 UGX' },
                 { id: 3, name: 'Alice W.', date: 'Invited Mar 26', status: 'pending', reward: 'Pending...' },
               ].map(ref => (
                 <div key={ref.id} className="flex items-center justify-between pb-4 border-b border-slate-50 dark:border-slate-700/50 last:border-0 last:pb-0 transition-colors">
                    <div className="flex items-center gap-3">
                       <div className="w-10 h-10 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center text-slate-500 dark:text-slate-400 font-bold text-sm transition-colors">
                          {ref.name.charAt(0)}
                       </div>
                       <div>
                          <p className="text-[13px] font-bold text-slate-800 dark:text-white transition-colors">{ref.name}</p>
                          <p className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 transition-colors">{ref.date}</p>
                       </div>
                    </div>
                    <div className="text-right">
                       <p className={`text-[12.5px] font-black transition-colors ${ref.status === 'completed' ? 'text-emerald-500 dark:text-emerald-400' : 'text-amber-500 dark:text-amber-400'}`}>{ref.reward}</p>
                       <div className="flex items-center justify-end gap-1 mt-0.5">
                          {ref.status === 'completed' ? <CheckCircle2 size={10} className="text-emerald-500 dark:text-emerald-400 transition-colors"/> : <Clock size={10} className="text-amber-500 dark:text-amber-400 transition-colors"/>}
                          <p className={`text-[9px] font-extrabold uppercase tracking-widest transition-colors ${ref.status === 'completed' ? 'text-emerald-500 dark:text-emerald-400' : 'text-amber-500 dark:text-amber-400'}`}>{ref.status}</p>
                       </div>
                    </div>
                 </div>
               ))}
            </div>
         </div>

      </div>
    </div>
  );
}
