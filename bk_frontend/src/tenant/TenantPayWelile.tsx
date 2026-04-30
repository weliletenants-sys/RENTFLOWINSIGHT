import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Phone, Copy, Receipt, Calendar, Clock, Upload, X, CreditCard, Image as ImageIcon, Trash2 } from 'lucide-react';

export default function TenantPayWelile() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [screenshot, setScreenshot] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setScreenshot(e.target.files[0]);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 font-sans text-slate-900 dark:text-slate-100 pb-20 selection:bg-purple-100 transition-colors duration-300">
      
      {/* Header */}
      <div className="flex justify-between items-center px-4 py-5 border-b border-slate-200 dark:border-slate-800 sticky top-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur z-20 transition-colors duration-300">
        <h1 className="text-[17px] font-bold text-slate-800 dark:text-white flex-1 text-center pl-6 transition-colors tracking-wide">Pay Welile via Mobile Money</h1>
        <button onClick={() => navigate(-1)} className="text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 transition w-8 flex justify-end">
           <X size={22} />
        </button>
      </div>

      <div className="px-4 py-6 max-w-xl mx-auto space-y-6">
        
        {/* Payment Partners Section */}
        <div className="bg-white dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700/60 rounded-[1.75rem] p-5 shadow-sm transition-colors duration-300">
          <div className="flex items-center gap-3 mb-1">
             <div className="bg-purple-50 dark:bg-purple-500/20 p-2 rounded-lg transition-colors">
                <CreditCard size={18} className="text-purple-600 dark:text-purple-400" />
             </div>
             <h2 className="text-[17px] font-semibold text-slate-800 dark:text-white transition-colors">Payment Partners</h2>
          </div>
          <p className="text-[13px] text-slate-500 dark:text-slate-400 mb-6 transition-colors">Pay in 10 seconds using Mobile Money</p>

          <div className="grid grid-cols-2 gap-4">
            {/* MTN Card */}
            <div className="rounded-[1.25rem] border border-[#ffcc00]/40 dark:border-[#ffcc00]/20 bg-white dark:bg-[#1f1a00] overflow-hidden flex flex-col relative shadow-[0_4px_20px_rgb(255,204,0,0.08)] transition-colors duration-300">
               <div className="bg-[#ffcc00] p-3.5 flex flex-col gap-2">
                  <div className="flex gap-2 items-center">
                      <div className="w-8 h-8 bg-white/90 rounded-full flex items-center justify-center shrink-0 shadow-sm"></div>
                      <div className="leading-tight">
                        <div className="text-black font-extrabold text-[15px] truncate">MTN MoMo</div>
                        <div className="text-black/80 text-[10px] font-bold uppercase tracking-wider mt-0.5">Pay Merchant</div>
                      </div>
                  </div>
               </div>
               <div className="p-3.5 flex flex-col items-center">
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold tracking-wide transition-colors">Merchant ID</span>
                  <span className="text-[22px] font-black text-slate-800 dark:text-white tracking-widest my-1.5 transition-colors">090777</span>
                  
                  <button className="w-full bg-[#ffcc00] text-black font-extrabold py-2.5 rounded-[10px] flex items-center justify-center gap-2 mt-2 mb-2 hover:bg-yellow-400 transition text-[13px] shadow-sm">
                     <Phone strokeWidth={2.5} size={14} /> Pay Now
                  </button>
                  <button className="w-full border border-slate-200 dark:border-slate-700/50 text-slate-700 dark:text-slate-300 font-semibold py-2.5 rounded-[10px] flex items-center justify-center gap-2 hover:bg-slate-50 dark:hover:bg-slate-800/80 transition text-[13px]">
                     <Copy strokeWidth={2} size={14} /> Copy ID
                  </button>
                  <button className="mt-3.5 text-[11px] font-bold text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 transition uppercase tracking-wider mb-1">View Manual Step</button>
               </div>
            </div>

            {/* Airtel Card */}
            <div className="rounded-[1.25rem] border border-red-500/30 dark:border-red-500/20 bg-white dark:bg-[#200000] overflow-hidden flex flex-col relative shadow-[0_4px_20px_rgb(239,68,68,0.08)] transition-colors duration-300">
               <div className="bg-[#ff0000] p-3.5 flex flex-col gap-2">
                  <div className="flex gap-2 items-center">
                      <div className="w-8 h-8 bg-white/90 rounded-full flex items-center justify-center shrink-0 shadow-sm"></div>
                      <div className="leading-tight">
                        <div className="text-white font-extrabold text-[15px] truncate">Airtel Money</div>
                        <div className="text-white/80 text-[10px] font-bold uppercase tracking-wider mt-0.5">Pay Merchant</div>
                      </div>
                  </div>
               </div>
               <div className="p-3.5 flex flex-col items-center">
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold tracking-wide transition-colors">Merchant ID</span>
                  <span className="text-[22px] font-black text-slate-800 dark:text-white tracking-widest my-1.5 transition-colors">4380664</span>
                  
                  <button className="w-full bg-[#ff0000] text-white font-extrabold py-2.5 rounded-[10px] flex items-center justify-center gap-2 mt-2 mb-2 hover:bg-red-600 transition text-[13px] shadow-sm">
                     <Phone strokeWidth={2.5} size={14} /> Pay Now
                  </button>
                  <button className="w-full border border-slate-200 dark:border-slate-700/50 text-slate-700 dark:text-slate-300 font-semibold py-2.5 rounded-[10px] flex items-center justify-center gap-2 hover:bg-slate-50 dark:hover:bg-slate-800/80 transition text-[13px]">
                     <Copy strokeWidth={2} size={14} /> Copy ID
                  </button>
                  <button className="mt-3.5 text-[11px] font-bold text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 transition uppercase tracking-wider mb-1">View Manual Step</button>
               </div>
            </div>
          </div>
        </div>

        {/* Confirm Payment Section */}
        <div className="bg-white dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700/60 rounded-[1.75rem] p-6 shadow-sm transition-colors duration-300">
           <div className="flex items-center gap-3 mb-7">
             <div className="bg-purple-50 dark:bg-purple-500/20 p-2 rounded-lg transition-colors">
               <Receipt size={18} className="text-purple-600 dark:text-purple-400" />
             </div>
             <h2 className="text-[17px] font-semibold text-slate-800 dark:text-white transition-colors">Confirm Your Payment</h2>
           </div>

           <div className="space-y-6">
              
              <div className="grid grid-cols-2 gap-4">
                 <div>
                   <label className="flex items-center text-[13px] font-semibold text-slate-700 dark:text-slate-300 mb-2 transition-colors">Amount Paid (UGX) <span className="text-purple-500 ml-1">*</span></label>
                   <input type="text" placeholder="e.g. 50000" className="w-full bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-xl px-4 py-3.5 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 text-[14px] transition-all" />
                 </div>
                 <div>
                   <label className="flex items-center text-[13px] font-semibold text-slate-700 dark:text-slate-300 mb-2 transition-colors">Payment Partner <span className="text-purple-500 ml-1">*</span></label>
                   <div className="relative">
                       <select className="w-full bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-xl px-4 py-3.5 text-slate-900 dark:text-white focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 appearance-none text-[14px] cursor-pointer transition-all">
                         <option value="">Select...</option>
                         <option value="mtn">MTN MoMo</option>
                         <option value="airtel">Airtel Money</option>
                       </select>
                       <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                         <svg className="w-4 h-4 text-slate-400 dark:text-slate-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                       </div>
                   </div>
                 </div>
              </div>

              <div>
                <label className="flex items-center text-[13px] font-semibold text-slate-700 dark:text-slate-300 mb-2 transition-colors">Transaction ID <span className="text-purple-500 ml-1">*</span></label>
                <input type="text" placeholder="Enter transaction reference" className="w-full bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-xl px-4 py-3.5 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 text-[14px] transition-all" />
              </div>

              <div>
                  <div className="grid grid-cols-2 gap-4 mb-2">
                     <div>
                       <label className="flex items-center gap-1.5 text-[13px] font-semibold text-slate-700 dark:text-slate-300 mb-2 transition-colors"><Calendar strokeWidth={2} size={15} className="text-slate-400 dark:text-slate-500 transition-colors"/> Transaction Date <span className="text-purple-500 ml-1">*</span></label>
                       <input type="date" defaultValue="2026-03-27" className="w-full bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-xl px-4 py-3.5 text-slate-900 dark:text-white focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 text-[14px] transition-all" />
                     </div>
                     <div>
                       <label className="flex items-center gap-1.5 text-[13px] font-semibold text-slate-700 dark:text-slate-300 mb-2 transition-colors"><Clock strokeWidth={2} size={15} className="text-slate-400 dark:text-slate-500 transition-colors"/> Transaction Time <span className="text-purple-500 ml-1">*</span></label>
                       <input type="time" defaultValue="12:10" className="w-full bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-xl px-4 py-3.5 text-slate-900 dark:text-white focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 text-[14px] transition-all" />
                     </div>
                  </div>
                  <p className="text-[12px] text-slate-500 dark:text-slate-400 transition-colors">Within last 7 days only</p>
              </div>

              <div>
                <label className="flex items-center text-[13px] font-semibold text-slate-700 dark:text-slate-300 mb-2 transition-colors">Reason / Narration <span className="text-purple-500 ml-1">*</span></label>
                <input type="text" placeholder="e.g. Rent repayment, Access fee, Walle" className="w-full bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-xl px-4 py-3.5 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 text-[14px] transition-all" />
              </div>

              <div>
                <label className="flex items-center text-[13px] font-semibold text-slate-700 dark:text-slate-300 mb-2 transition-colors">Screenshot (Optional)</label>
                
                <input 
                  type="file" 
                  accept="image/*" 
                  ref={fileInputRef} 
                  onChange={handleFileChange} 
                  className="hidden" 
                />
                
                {!screenshot ? (
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-2xl flex flex-col items-center justify-center p-8 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700/50 hover:border-purple-300 dark:hover:border-purple-500/50 transition-all bg-slate-50/50 dark:bg-slate-700/30 group"
                  >
                     <Upload size={24} strokeWidth={1.5} className="text-slate-400 dark:text-slate-500 mb-3 group-hover:scale-110 group-hover:text-purple-500 dark:group-hover:text-purple-400 transition-all" />
                     <span className="text-[13px] font-semibold text-slate-500 dark:text-slate-400 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">Tap to upload</span>
                  </div>
                ) : (
                  <div className="w-full border border-slate-200 dark:border-slate-700 rounded-2xl flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700/50 shrink-0 transition-colors">
                     <div className="flex items-center gap-3 overflow-hidden">
                        <div className="w-10 h-10 bg-purple-100 dark:bg-purple-500/20 rounded-lg flex items-center justify-center shrink-0 transition-colors">
                           <ImageIcon size={18} className="text-purple-600 dark:text-purple-400 transition-colors" />
                        </div>
                        <div className="overflow-hidden">
                           <p className="text-[13px] font-semibold text-slate-800 dark:text-white truncate transition-colors">{screenshot.name}</p>
                           <p className="text-[11px] text-slate-500 dark:text-slate-400 transition-colors">{(screenshot.size / 1024).toFixed(1)} KB</p>
                        </div>
                     </div>
                     <button 
                       onClick={() => { setScreenshot(null); if(fileInputRef.current) fileInputRef.current.value = ''; }} 
                       className="p-2 text-slate-400 dark:text-slate-500 hover:text-red-500 dark:hover:text-rose-400 hover:bg-red-50 dark:hover:bg-rose-500/10 rounded-lg transition shrink-0 cursor-pointer"
                     >
                       <Trash2 size={18} />
                     </button>
                  </div>
                )}
              </div>

              <div className="pt-2">
                 <button onClick={() => navigate(-1)} className="w-full bg-[#8b5cf6] dark:bg-[#6b45c2] shadow-[0_8px_30px_rgb(139,92,246,0.3)] dark:shadow-none hover:bg-[#7c3aed] dark:hover:bg-[#5a2e9d] hover:-translate-y-[2px] active:translate-y-[1px] text-white font-bold py-4 rounded-xl transition-all text-[15px]">
                    Submit Payment Confirmation
                 </button>
              </div>

           </div>
        </div>

      </div>
    </div>
  );
}
