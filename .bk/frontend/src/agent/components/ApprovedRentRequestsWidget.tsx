import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function ApprovedRentRequestsWidget() {
  const navigate = useNavigate();

  return (
    <div 
      onClick={() => navigate('/agent-rent-requests')}
      className="bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl p-4 shadow-lg cursor-pointer active:scale-95 transition-transform relative overflow-hidden mt-6 flex items-center justify-between"
    >
      <div className="absolute -right-6 -top-6 w-24 h-24 bg-white/10 rounded-full blur-xl" />
      
      <div className="flex items-center gap-3 relative z-10">
        <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-md">
          <CheckCircle2 size={24} className="text-white" />
        </div>
        <div>
          <h4 className="font-bold text-white text-sm">Approved Rent Requests</h4>
          <p className="text-emerald-50 text-xs mt-0.5">1 pending ready for funding</p>
        </div>
      </div>
      
      <div className="text-white relative z-10 opacity-80 group-hover:opacity-100">
         <ArrowRight size={20} />
      </div>
    </div>
  );
}
