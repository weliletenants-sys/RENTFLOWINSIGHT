import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { ArrowRight, Wallet } from 'lucide-react';

export default function WelcomePage() {
  const navigate = useNavigate();
  const {} = useAuth(); 

  return (
    <div className="min-h-screen bg-[#F8F9FA] sm:p-4 flex justify-center items-center relative overflow-hidden">
      <div className="w-full max-w-[420px] h-[100dvh] sm:h-[880px] max-h-screen bg-white relative flex flex-col sm:rounded-[40px] shadow-2xl overflow-hidden z-10 border-[12px] border-gray-900 sm:border-[14px]">
        {/* Fake iPhone Notch */}
        <div className="hidden sm:block absolute top-0 left-1/2 -translate-x-1/2 w-[120px] h-[30px] bg-gray-900 rounded-b-3xl z-50"></div>

        <div className="flex-1 flex flex-col px-6 pt-20 pb-12">
          
          <div className="flex-1 flex flex-col items-center justify-center text-center -mt-10">
            <div className="w-24 h-24 bg-purple-100 rounded-full flex items-center justify-center mb-8">
              <Wallet className="text-[#673AB7]" size={40} />
            </div>
            <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Welcome to Welile</h1>
            <p className="text-gray-500 mb-8 max-w-[280px]">Join over 25 Million tenants securing housing seamlessly everyday.</p>
            
            <div className="bg-purple-50 px-6 py-4 rounded-2xl w-full border border-purple-100">
              <p className="text-sm text-purple-600 font-bold uppercase tracking-wider mb-1">Total Tenant Pool</p>
              <p className="text-3xl font-black text-[#512DA8]">25,102,400</p>
            </div>
          </div>

          <div>
            <button 
              onClick={() => navigate('/signup')} // Route to sign up before starting the actual application
              className="w-full bg-[#673AB7] text-white py-4 rounded-[1.2rem] font-bold text-[16px] shadow-lg shadow-purple-500/30 flex items-center justify-center gap-2 transition active:scale-[0.98] hover:bg-[#512DA8]"
            >
              Request Rent <ArrowRight size={20} strokeWidth={2} />
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
