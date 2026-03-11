import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Banknote, MapPin, Calendar, ArrowRight, Home } from 'lucide-react';

export default function RentRequestForm() {
  const { rentAmount, setRentAmount } = useAuth();
  const [location, setLocation] = useState('');
  const [duration, setDuration] = useState('');
  const navigate = useNavigate();

  const handleContinue = (e: React.FormEvent) => {
    e.preventDefault();
    // After filling out rent details, proceed to sign up flow to provision an account
    navigate('/signup');
  };

  return (
    <div className="min-h-screen bg-[#8155FF] sm:p-4 flex justify-center items-center relative overflow-hidden">
      {/* Decorative background */}
      <div className="absolute inset-0 opacity-20 pointer-events-none flex justify-center items-center">
        <svg viewBox="0 0 1000 1000" preserveAspectRatio="none" className="w-[150vw] h-[150vh]">
           <path d="M0,500 Q250,300 500,500 T1000,500" stroke="white" strokeWidth="2" fill="none"/>
           <path d="M0,700 Q250,500 500,700 T1000,700" stroke="white" strokeWidth="2" fill="none"/>
        </svg>
      </div>

      <div className="w-full max-w-[420px] h-[100dvh] sm:h-[880px] max-h-screen bg-[#F8F9FA] relative flex flex-col sm:rounded-[40px] shadow-2xl overflow-hidden z-10 border-[12px] border-gray-900 sm:border-[14px]">
        {/* Fake iPhone Notch */}
        <div className="hidden sm:block absolute top-0 left-1/2 -translate-x-1/2 w-[120px] h-[30px] bg-gray-900 rounded-b-3xl z-50"></div>

        <div className="flex-1 flex flex-col pt-16 px-8 relative z-10 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          
          <div className="text-center mb-8 shrink-0">
            <div className="w-16 h-16 bg-gradient-to-br from-[#915BFE] to-[#713BF0] rounded-[1.2rem] mx-auto mb-4 flex items-center justify-center shadow-lg shadow-purple-500/30">
              <Home className="text-white" size={30} strokeWidth={1.5} />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight mb-2">Request Rent</h1>
            <p className="text-gray-500 font-medium text-sm">Tell us about your housing needs.</p>
          </div>

          <form onSubmit={handleContinue} className="flex flex-col gap-4 pb-8 shrink-0">

            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                <Banknote size={18} strokeWidth={1.5} />
              </div>
              <input 
                type="number" 
                required
                placeholder="Specific Rent Amount (KSh)"
                value={rentAmount}
                onChange={(e) => setRentAmount(e.target.value)}
                className="w-full bg-white border border-gray-200 rounded-2xl py-3.5 pl-10 pr-4 text-gray-800 font-medium text-sm focus:outline-none focus:border-[#51319E] focus:ring-4 focus:ring-purple-500/10 transition"
              />
            </div>

            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                <MapPin size={18} strokeWidth={1.5} />
              </div>
              <input 
                type="text" 
                required
                placeholder="Property Location (e.g., Kilimani)"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full bg-white border border-gray-200 rounded-2xl py-3.5 pl-10 pr-4 text-gray-800 font-medium text-sm focus:outline-none focus:border-[#51319E] focus:ring-4 focus:ring-purple-500/10 transition"
              />
            </div>
            
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                <Calendar size={18} strokeWidth={1.5} />
              </div>
              <input 
                type="number" 
                required
                placeholder="Lease Duration (Months)"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="w-full bg-white border border-gray-200 rounded-2xl py-3.5 pl-10 pr-4 text-gray-800 font-medium text-sm focus:outline-none focus:border-[#51319E] focus:ring-4 focus:ring-purple-500/10 transition"
              />
            </div>

            <button type="submit" className="w-full bg-[#51319E] hover:bg-[#412780] text-white py-4 rounded-2xl font-bold text-[15px] shadow-lg flex items-center justify-center gap-2 transition active:scale-[0.98] mt-2">
              Continue to Sign Up <ArrowRight size={18} />
            </button>

          </form>

        </div>
      </div>
    </div>
  );
}
