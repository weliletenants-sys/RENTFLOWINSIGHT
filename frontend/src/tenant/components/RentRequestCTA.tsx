import { KeyRound, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function RentRequestCTA() {
  const navigate = useNavigate();

  return (
    <div className="bg-[#1e4b9c] rounded-2xl p-8 lg:p-10 shadow-lg relative overflow-hidden group hover:shadow-xl transition-all border-t border-[#4680e6] w-full">
       <div className="absolute right-0 bottom-0 opacity-10">
          <KeyRound className="w-48 h-48 -mr-12 -mb-12 rotate-[-25deg] transform group-hover:rotate-0 transition-transform duration-700 pointer-events-none" />
       </div>

       <div className="mb-6 relative z-10">
          <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center backdrop-blur-md border border-white/20 text-white">
             <KeyRound strokeWidth={2.5} className="w-6 h-6" />
          </div>
       </div>
       
       <h3 className="text-[26px] font-black tracking-tight text-white leading-none mb-3 relative z-10">
          Request Rent Assistance
       </h3>
       
       <p className="text-blue-200 text-sm font-medium leading-relaxed max-w-[260px] relative z-10 mb-8 opacity-90">
          Get your landlord paid out today. Pay Welile back on flexible daily or weekly schedules.
       </p>

       <button 
          onClick={() => navigate('/rent-request')}
          className="relative z-10 bg-white hover:bg-slate-50 text-[#0f3b7d] px-6 py-3.5 rounded-xl font-bold text-sm tracking-wide shadow-sm flex items-center gap-3 transition-colors active:scale-[0.98] cursor-pointer"
       >
          Start Rent Request <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
       </button>
    </div>
  );
}
