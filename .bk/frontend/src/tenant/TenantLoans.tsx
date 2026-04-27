
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Banknote } from 'lucide-react';

export default function TenantLoans() {
  const navigate = useNavigate();

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
            <h1 className="text-2xl font-bold text-white tracking-wide">My Credit & Loans</h1>
         </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-3xl mx-auto px-4 md:px-8 -mt-12 relative z-10 flex flex-col gap-6 items-center">
         
         <div className="w-full bg-white dark:bg-slate-800 rounded-3xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none border border-slate-100 dark:border-slate-700 flex flex-col items-center justify-center py-12 transition-colors duration-300">
           <div className="w-24 h-24 bg-purple-50 dark:bg-purple-500/20 rounded-full flex items-center justify-center mb-6 transition-colors">
              <Banknote size={48} className="text-[#8b5cf6] dark:text-purple-400" />
           </div>
           
           <h2 className="text-2xl font-black text-slate-800 dark:text-white text-center tracking-tight mb-2 transition-colors">Good Standing!</h2>
           <p className="text-slate-500 dark:text-slate-400 text-center max-w-sm leading-relaxed mb-8 transition-colors">
              You currently have no active loans or defaulted credit. Your total credit limit is fully available for any future emergency rent assistance.
           </p>
           
           <button 
             onClick={() => navigate('/rent-request')}
             className="bg-[#8b5cf6] text-white px-8 py-3 rounded-2xl font-bold shadow-lg shadow-purple-600/30 hover:bg-purple-600 hover:-translate-y-1 transition-all cursor-pointer w-full md:w-auto"
           >
              Request Rent Assistance
           </button>
         </div>

      </div>
    </div>
  );
}
