import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Download, Smartphone, WifiOff, BellRing, Gauge, Share, PlusSquare, MoreVertical, Apple, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AgentInstallApp() {
  const navigate = useNavigate();
  const [osType, setOsType] = useState<'iOS' | 'Android' | 'Desktop'>('Desktop');

  // Naive OS detection for tailored tutorial rendering
  useEffect(() => {
    const userAgent = window.navigator.userAgent.toLowerCase();
    if (/iphone|ipad|ipod/.test(userAgent)) {
      setOsType('iOS');
    } else if (/android/.test(userAgent)) {
      setOsType('Android');
    }
  }, []);

  return (
    <div className="w-full min-h-screen bg-[#f7f9fa] font-sans antialiased pb-24 selection:bg-[#9234eb]/20">
      
      {/* Background ambient light */}
      <div className="fixed top-[-5%] right-[-10%] w-[50rem] h-[50rem] bg-[#9234eb]/5 rounded-[100%] blur-[120px] pointer-events-none z-0"></div>

      {/* Sticky Header */}
      <header className="sticky top-0 left-0 right-0 z-50 w-full border-b border-purple-100 bg-white/80 backdrop-blur-md px-4 py-4 mb-6">
        <div className="max-w-4xl mx-auto flex items-center gap-3">
           <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-xl text-[#9234eb]/50 hover:text-[#9234eb] hover:bg-purple-50 transition-colors">
              <ArrowLeft size={24} />
           </button>
           <div>
               <h1 className="text-xl font-black text-slate-800 leading-none mb-1">Install Application</h1>
               <p className="text-[10px] font-bold text-[#9234eb]/70 uppercase tracking-widest flex items-center gap-1.5"><Smartphone size={12} /> Native Build</p>
           </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 relative z-10 space-y-6">
        
        {/* Massive Hero Block */}
        <motion.div 
           initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
           className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#9234eb] to-[#6a15ba] border border-white/10 p-8 shadow-2xl flex flex-col items-center justify-center text-center"
        >
           {/* Abstract Design Elements */}
           <div className="absolute inset-0 bg-black/5 pointer-events-none" />
           <div className="absolute top-0 right-0 p-8 opacity-10 transform translate-x-12 -translate-y-4 pointer-events-none text-white">
              <Download size={300} strokeWidth={1} />
           </div>

           <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center shadow-xl shadow-black/20 mb-6 relative z-10">
              <div className="w-16 h-16 bg-gradient-to-br from-[#9234eb] to-[#7b2cbf] rounded-2xl flex items-center justify-center text-white font-black text-2xl tracking-tighter shadow-inner">
                 RF
              </div>
           </div>

           <h2 className="text-3xl font-black text-white mb-3 relative z-10">Get the Native Setup</h2>
           <p className="text-purple-100 font-medium mb-8 max-w-sm relative z-10">
              Remove the browser URL bars and install the Rentflow Field Application directly onto your mobile homescreen for full-screen performance.
           </p>

           <div className="flex items-center gap-2 bg-black/20 text-white border border-white/20 px-4 py-2 rounded-xl backdrop-blur-sm relative z-10">
               <ShieldCheck size={16} className="text-emerald-400" />
               <span className="text-xs font-bold tracking-widest uppercase text-emerald-100">Verified PWA Secure Module</span>
           </div>
        </motion.div>

        {/* Dynamic Instructional Deck */}
        <motion.div 
           initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.1 }}
           className="bg-white rounded-[2rem] p-8 border border-slate-200 shadow-sm"
        >
           {osType === 'iOS' || osType === 'Desktop' ? (
              <div className="flex flex-col gap-6">
                 <h3 className="text-xl font-black text-slate-800 flex items-center gap-2 border-b border-slate-100 pb-4">
                    <Apple size={24} className="text-slate-800" />
                    iOS Apple Instructions
                 </h3>
                 <p className="text-sm font-semibold text-slate-500 mb-2">You are viewing this on Safari. Execute these precise taps to install the app locally:</p>
                 
                 <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                       <div className="w-12 h-12 bg-white rounded-xl shadow-sm border border-slate-200 flex items-center justify-center text-[#007AFF]">
                          <Share size={24} />
                       </div>
                       <div>
                          <p className="font-bold text-slate-800">1. Tap the Share Button</p>
                          <p className="text-xs font-semibold text-slate-500">Located identically at the bottom of your Safari browser bar.</p>
                       </div>
                    </div>
                    
                    <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                       <div className="w-12 h-12 bg-white rounded-xl shadow-sm border border-slate-200 flex items-center justify-center text-slate-800">
                          <PlusSquare size={24} />
                       </div>
                       <div>
                          <p className="font-bold text-slate-800">2. Select "Add to Home Screen"</p>
                          <p className="text-xs font-semibold text-slate-500">Scroll down the menu list until you spot the thick plus icon.</p>
                       </div>
                    </div>
                 </div>
              </div>
           ) : null}

           {osType === 'Android' || osType === 'Desktop' ? (
              <div className={`flex flex-col gap-6 ${osType === 'Desktop' ? 'mt-8 pt-8 border-t border-slate-200' : ''}`}>
                 <h3 className="text-xl font-black text-emerald-800 flex items-center gap-2 border-b border-emerald-50 pb-4">
                    <Smartphone size={24} className="text-emerald-600" />
                    Android Chrome Instructions
                 </h3>
                 <p className="text-sm font-semibold text-slate-500 mb-2">You are viewing this on an Android device. Trigger the native installation hook:</p>
                 
                 <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-4 bg-emerald-50/50 p-4 rounded-2xl border border-emerald-100">
                       <div className="w-12 h-12 bg-white rounded-xl shadow-sm border border-emerald-200 flex items-center justify-center text-slate-800">
                          <MoreVertical size={24} />
                       </div>
                       <div>
                          <p className="font-bold text-emerald-900">1. Tap Browser Settings</p>
                          <p className="text-xs font-semibold text-emerald-700/70">Tap the three vertical dots located at the top-right of Chrome.</p>
                       </div>
                    </div>
                    
                    <div className="flex items-center gap-4 bg-emerald-50/50 p-4 rounded-2xl border border-emerald-100">
                       <div className="w-12 h-12 bg-white rounded-xl shadow-sm border border-emerald-200 flex items-center justify-center text-emerald-600">
                          <Download size={24} />
                       </div>
                       <div>
                          <p className="font-bold text-emerald-900">2. Hit "Install App"</p>
                          <p className="text-xs font-semibold text-emerald-700/70">Click the direct install prompt and approve the system download.</p>
                       </div>
                    </div>
                 </div>
                 
                 {/* Raw trigger button for modern chromiums connecting to manifest.json */}
                 <button className="w-full mt-4 bg-emerald-500 hover:bg-emerald-600 active:scale-[0.98] transition-all text-white font-black text-lg py-4 rounded-2xl shadow-lg shadow-emerald-500/30 flex justify-center items-center gap-2">
                    <Download size={24} />
                    Force Native Install Prompt
                 </button>
              </div>
           ) : null}
        </motion.div>

        {/* Technical Value Proposition Matrix */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
           
           <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.2 }}
              className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm"
           >
              <div className="w-10 h-10 bg-blue-50 text-blue-500 rounded-xl flex items-center justify-center mb-4 border border-blue-100">
                 <Gauge size={20} />
              </div>
              <h4 className="font-black text-slate-800 mb-1">Full-Screen Velocity</h4>
              <p className="text-xs font-semibold text-slate-500">Executing purely off the OS means zero browser bars clogging your view and 40% faster loading components.</p>
           </motion.div>

           <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.3 }}
              className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm"
           >
              <div className="w-10 h-10 bg-rose-50 text-rose-500 rounded-xl flex items-center justify-center mb-4 border border-rose-100">
                 <WifiOff size={20} />
              </div>
              <h4 className="font-black text-slate-800 mb-1">Drought Mode Offline</h4>
              <p className="text-xs font-semibold text-slate-500">Service workers natively cache the Rentflow framework structure, operating even inside deep cell-towers deadzones.</p>
           </motion.div>

           <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.4 }}
              className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm"
           >
              <div className="w-10 h-10 bg-purple-50 text-[#9234eb] rounded-xl flex items-center justify-center mb-4 border border-purple-100">
                 <BellRing size={20} />
              </div>
              <h4 className="font-black text-slate-800 mb-1">System PUSH Alerts</h4>
              <p className="text-xs font-semibold text-slate-500">Installing natively bypasses browser blocks, letting Rentflow inject direct Push Notifications to your lock screen.</p>
           </motion.div>

        </div>

      </main>
    </div>
  );
}
