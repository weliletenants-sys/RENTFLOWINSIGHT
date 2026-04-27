import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Share2, Copy, CheckCircle2, MessageCircle, MessageSquare, Twitter, QrCode, MousePointerClick, Users, Wallet, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AgentShareLink() {
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);

  const MASTER_LINK = 'https://rentflow.io/ref/AG-5034-EXPERT';

  // Mock Affiliate Performance Data
  const stats = {
    clicks: 1402,
    conversions: 84, // Tenants/Landlords successfully registered
    earned: 4200000 // Commission earned via this specific link
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(MASTER_LINK);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full min-h-screen bg-[#f7f9fa] font-sans antialiased pb-24 selection:bg-[#9234eb]/20">
      
      {/* Background ambient light */}
      <div className="fixed top-[-10%] left-[-5%] w-[40rem] h-[40rem] bg-[#9234eb]/5 rounded-full blur-[120px] pointer-events-none z-0"></div>

      {/* Sticky Header */}
      <header className="sticky top-0 left-0 right-0 z-50 w-full border-b border-purple-100 bg-white/80 backdrop-blur-md px-4 py-4 mb-4">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
             <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-xl text-[#9234eb]/50 hover:text-[#9234eb] hover:bg-purple-50 transition-colors">
                <ArrowLeft size={24} />
             </button>
             <div>
                 <h1 className="text-xl font-black text-slate-800 leading-none mb-1">Affiliate Hub</h1>
                 <p className="text-[10px] font-bold text-[#9234eb]/70 uppercase tracking-widest">Growth Engine</p>
             </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 relative z-10 space-y-6">
        
        {/* KPI Dashboard - High Impact Volume */}
        <motion.div 
           initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
           className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
           <div className="md:col-span-2 relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#9234eb] to-[#6a15ba] p-8 shadow-[0_20px_40px_-10px_rgba(146,52,235,0.3)] border border-white/10 text-white flex flex-col justify-center">
              <div className="absolute top-0 right-0 p-8 opacity-10 transform translate-x-4">
                 <Wallet size={160} strokeWidth={1} />
              </div>
              <div className="relative z-10">
                 <p className="text-[10px] font-bold tracking-widest uppercase text-purple-200 mb-2 flex items-center gap-2">
                    <Share2 size={14} /> Affiliate Commissions
                 </p>
                 <p className="text-4xl md:text-5xl font-black text-white leading-none tracking-tighter drop-shadow-md">
                    UGX {(stats.earned / 1000000).toFixed(1)}<span className="text-2xl text-white/50 ml-1">M</span>
                 </p>
              </div>
           </div>

           <div className="grid grid-cols-2 md:grid-cols-1 gap-4">
              <div className="bg-white rounded-3xl p-6 border border-purple-100 shadow-sm flex flex-col justify-center">
                 <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center text-[#9234eb] mb-3 border border-purple-100">
                    <MousePointerClick size={20} />
                 </div>
                 <p className="text-2xl font-black text-slate-800 leading-none mb-1">{stats.clicks.toLocaleString()}</p>
                 <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Total Clicks</p>
              </div>
              <div className="bg-white rounded-3xl p-6 border border-purple-100 shadow-sm flex flex-col justify-center">
                 <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-500 mb-3 border border-emerald-100">
                    <Users size={20} />
                 </div>
                 <p className="text-2xl font-black text-slate-800 leading-none mb-1">{stats.conversions}</p>
                 <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Conversions</p>
              </div>
           </div>
        </motion.div>

        {/* Master Output Frame UI */}
        <motion.div 
           initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.1 }}
           className="bg-white rounded-[2rem] p-8 border border-slate-200 shadow-sm relative overflow-hidden group"
        >
           {/* Abstract Design Elements */}
           <div className="absolute -top-24 -right-24 w-64 h-64 bg-purple-50/50 rounded-full blur-3xl group-hover:bg-purple-100/50 transition-colors duration-700 pointer-events-none" />
           
           <h3 className="text-xl font-black text-slate-800 mb-2">Your Master URL</h3>
           <p className="text-sm font-semibold text-slate-500 max-w-lg mb-8">
              Copy and share this highly-optimized affiliate link directly with landlords or tenants. You instantly earn whenever an account converts through it.
           </p>

           <div className="flex flex-col md:flex-row items-center gap-4 bg-slate-50 border border-slate-200 p-2 pl-6 rounded-2xl">
              <input 
                 readOnly 
                 value={MASTER_LINK} 
                 className="w-full bg-transparent text-slate-700 font-bold text-sm outline-none tracking-wide"
              />
              <button 
                 onClick={copyToClipboard}
                 className={`w-full md:w-auto shrink-0 flex items-center justify-center gap-2 py-3 px-6 rounded-xl font-bold uppercase tracking-widest text-xs transition-all shadow-md ${
                    copied ? 'bg-emerald-500 text-white shadow-emerald-500/30' : 'bg-[#9234eb] text-white hover:bg-[#7b2cbf] shadow-[#9234eb]/30'
                 }`}
              >
                 {copied ? <><CheckCircle2 size={16} /> Attached</> : <><Copy size={16} /> Copy URL</>}
              </button>
           </div>
        </motion.div>

        {/* Dispatch Modules & QR Target Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           
           {/* QR Code Container */}
           <motion.div 
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4, delay: 0.2 }}
              className="bg-slate-900 rounded-[2rem] p-8 border border-slate-800 shadow-xl flex flex-col items-center justify-center text-center relative overflow-hidden"
           >
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(146,52,235,0.2),transparent_50%)]" />
              
              <div className="w-12 h-12 bg-[#9234eb]/20 text-[#9234eb] rounded-2xl flex items-center justify-center mb-6 relative z-10">
                 <QrCode size={24} />
              </div>
              <h4 className="text-white text-xl font-black mb-2 relative z-10">Field QR Setup</h4>
              <p className="text-slate-400 text-xs font-semibold mb-8 max-w-[200px] relative z-10">
                 Have clients scan your phone screen here for instant proxy registration.
              </p>

              <div className="w-48 h-48 bg-white p-4 rounded-3xl shadow-2xl relative z-10 group cursor-pointer hover:scale-105 transition-transform duration-300">
                 {/* CSS Mock QR block pattern for visual prototyping */}
                 <div className="w-full h-full bg-slate-100 rounded-xl relative overflow-hidden border border-slate-200">
                    <div className="absolute top-2 left-2 w-8 h-8 border-4 border-slate-800 rounded-lg" />
                    <div className="absolute top-2 right-2 w-8 h-8 border-4 border-slate-800 rounded-lg" />
                    <div className="absolute bottom-2 left-2 w-8 h-8 border-4 border-slate-800 rounded-lg" />
                    <div className="absolute inset-8 grid grid-cols-5 grid-rows-5 gap-1 p-2">
                       {Array(25).fill(0).map((_, i) => (
                          <div key={i} className={`rounded-sm ${Math.random() > 0.4 ? 'bg-slate-800' : 'bg-transparent'}`} />
                       ))}
                    </div>
                    {/* Centered Logo Fake */}
                    <div className="absolute inset-0 flex items-center justify-center">
                       <div className="bg-white p-1 rounded-md">
                          <div className="w-6 h-6 bg-[#9234eb] rounded-sm flex items-center justify-center">
                             <QrCode size={12} className="text-white" />
                          </div>
                       </div>
                    </div>
                 </div>
              </div>
           </motion.div>

           {/* Social Blaster Stack */}
           <motion.div 
              initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4, delay: 0.3 }}
              className="flex flex-col gap-4"
           >
              <h4 className="text-sm font-black uppercase tracking-widest text-slate-800 px-2 pt-2 mb-2 flex items-center gap-2">
                 <Share2 size={16} className="text-[#9234eb]" /> Social Dispatch
              </h4>

              <button className="flex items-center justify-between p-5 bg-[#25D366]/10 hover:bg-[#25D366]/20 border border-[#25D366]/30 text-[#075e54] rounded-2xl transition-colors group">
                 <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-[#25D366] text-white rounded-xl flex items-center justify-center shadow-lg shadow-[#25D366]/30 group-hover:scale-110 transition-transform">
                       <MessageCircle size={24} />
                    </div>
                    <div className="text-left">
                       <h5 className="font-black text-[15px] leading-tight mb-0.5">WhatsApp Blast</h5>
                       <p className="text-[10px] font-bold uppercase tracking-widest opacity-80">Direct Messaging</p>
                    </div>
                 </div>
                 <ChevronRight size={20} className="opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
              </button>

              <button className="flex items-center justify-between p-5 bg-sky-100 hover:bg-sky-200/60 border border-sky-200 text-sky-800 rounded-2xl transition-colors group">
                 <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-sky-500 text-white rounded-xl flex items-center justify-center shadow-lg shadow-sky-500/30 group-hover:scale-110 transition-transform">
                       <Twitter size={24} />
                    </div>
                    <div className="text-left">
                       <h5 className="font-black text-[15px] leading-tight mb-0.5">Twitter / X Post</h5>
                       <p className="text-[10px] font-bold uppercase tracking-widest opacity-80">Public Broadcast</p>
                    </div>
                 </div>
                 <ChevronRight size={20} className="opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
              </button>

              <button className="flex items-center justify-between p-5 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 text-indigo-900 rounded-2xl transition-colors group">
                 <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-indigo-500 text-white rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/30 group-hover:scale-110 transition-transform">
                       <MessageSquare size={24} />
                    </div>
                    <div className="text-left">
                       <h5 className="font-black text-[15px] leading-tight mb-0.5">Mobile SMS</h5>
                       <p className="text-[10px] font-bold uppercase tracking-widest opacity-80">Localized Dispatch</p>
                    </div>
                 </div>
                 <ChevronRight size={20} className="opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
              </button>
           </motion.div>

        </div>
      </main>
    </div>
  );
}
