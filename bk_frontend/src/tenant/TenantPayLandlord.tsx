import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Home } from 'lucide-react';

export default function TenantPayLandlord() {
  const navigate = useNavigate();
  const [showDialog, setShowDialog] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 font-sans text-slate-900 dark:text-slate-100 pb-20 transition-colors duration-300">
      
      {/* Header */}
      <div className="w-full bg-[#8b5cf6] dark:bg-[#6b45c2] pt-6 pb-20 px-6 md:px-12 relative rounded-b-[3rem] shadow-lg shadow-purple-600/20 dark:shadow-none transition-colors duration-300">
         <div className="flex items-center gap-6">
            <button 
              onClick={() => navigate(-1)} 
              className="text-white hover:bg-white/10 p-2 rounded-full transition-colors flex items-center justify-center cursor-pointer"
            >
               <ArrowLeft size={24} />
            </button>
            <h1 className="text-2xl font-bold text-white tracking-wide">Pay Rent</h1>
         </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-3xl mx-auto px-4 md:px-8 -mt-12 relative z-10 flex flex-col gap-6 items-center">
         
         <div className="w-full bg-white dark:bg-slate-800 rounded-3xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none border border-slate-100 dark:border-slate-700 flex flex-col items-center justify-center py-12 transition-colors duration-300">
           <div className="w-24 h-24 bg-purple-50 dark:bg-purple-500/20 rounded-full flex items-center justify-center mb-6 transition-colors">
              <Home size={48} className="text-[#8b5cf6] dark:text-purple-400" />
           </div>
           
           <h2 className="text-2xl font-black text-slate-800 dark:text-white text-center tracking-tight mb-2 transition-colors">Direct Landlord Payment</h2>
           <p className="text-slate-500 dark:text-slate-400 text-center max-w-sm leading-relaxed mb-8 transition-colors">
              Use your wallet balance to pay rent directly to your verified landlord or caretakers.
           </p>
           
           <button 
             onClick={() => setShowDialog(true)}
             className="bg-[#8b5cf6] text-white px-8 py-3 rounded-2xl font-bold shadow-lg shadow-purple-600/30 hover:bg-purple-600 hover:-translate-y-1 transition-all cursor-pointer w-full md:w-auto"
           >
              Select Landlord
           </button>
         </div>
         
         {/* Landlord Selection Dialog */}
         {showDialog && (
           <div className="fixed inset-0 bg-black/40 dark:bg-black/60 z-50 flex items-center justify-center p-4">
             <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 w-full max-w-md shadow-2xl dark:shadow-[0_20px_40px_rgba(0,0,0,0.5)] animate-in fade-in zoom-in duration-200 transition-colors">
               {!isAdding ? (
                 <>
                   <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-4 transition-colors">Select Landlord</h3>
                   <p className="text-slate-500 dark:text-slate-400 mb-6 text-sm transition-colors">Your landlord list is currently empty. Please add a landlord or verify your current rental agreement to proceed with direct payment.</p>
                   <div className="flex justify-end gap-3">
                     <button onClick={() => setShowDialog(false)} className="px-4 py-2 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700/50 rounded-xl font-bold transition-colors cursor-pointer text-sm">Cancel</button>
                     <button onClick={() => setIsAdding(true)} className="px-5 py-2 bg-[#8b5cf6] text-white rounded-xl font-bold shrink-0 hover:bg-purple-600 transition-colors cursor-pointer text-sm">Add Landlord</button>
                   </div>
                 </>
               ) : (
                 <>
                   <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-4 transition-colors">Register Landlord</h3>
                   <div className="space-y-4 mb-6">
                     <div>
                       <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1 transition-colors">Landlord Full Name</label>
                       <input type="text" className="w-full bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all placeholder-slate-400 dark:placeholder-slate-500 text-slate-900 dark:text-white" placeholder="e.g. John Doe" />
                     </div>
                     <div>
                       <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1 transition-colors">Phone Number</label>
                       <input type="tel" className="w-full bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all placeholder-slate-400 dark:placeholder-slate-500 text-slate-900 dark:text-white" placeholder="07XX XXX XXX" />
                     </div>
                   </div>
                   <div className="flex justify-end gap-3">
                     <button onClick={() => setIsAdding(false)} className="px-4 py-2 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700/50 rounded-xl font-bold transition-colors cursor-pointer text-sm">Back</button>
                     <button 
                       onClick={() => {
                         setIsAdding(false);
                         setShowDialog(false);
                         alert("Verification link sent! The landlord will be added to your profile once verified.");
                       }} 
                       className="px-5 py-2 bg-[#8b5cf6] text-white rounded-xl font-bold shrink-0 hover:bg-purple-600 transition-colors cursor-pointer text-sm"
                     >
                       Send Request
                     </button>
                   </div>
                 </>
               )}
             </div>
           </div>
         )}

      </div>
    </div>
  );
}
