import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { LogIn, UserPlus, ShieldCheck, Banknote } from 'lucide-react';

export default function LandingPage() {
  const navigate = useNavigate();
  const { intendedRole, rentAmount, setRentAmount } = useAuth();

  return (
    <div className="min-h-screen bg-[#8155FF] sm:p-4 flex justify-center items-center relative overflow-hidden">
      {/* Decorative Wavy Background Lines */}
      <div className="absolute inset-0 opacity-20 pointer-events-none flex justify-center items-center">
        <svg viewBox="0 0 1000 1000" preserveAspectRatio="none" className="w-[150vw] h-[150vh]">
           <path d="M0,500 Q250,300 500,500 T1000,500" stroke="white" strokeWidth="2" fill="none"/>
           <path d="M0,700 Q250,500 500,700 T1000,700" stroke="white" strokeWidth="2" fill="none"/>
           <path d="M0,300 Q250,100 500,300 T1000,300" stroke="white" strokeWidth="2" fill="none"/>
        </svg>
      </div>

      {/* Main Container Outline */}
      <div className="w-full max-w-[420px] h-[100dvh] sm:h-[880px] max-h-screen bg-gradient-to-b from-[#673AB7] to-[#512DA8] relative flex flex-col sm:rounded-[40px] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] overflow-hidden z-10 border-[12px] border-gray-900 sm:border-[14px]">
        {/* Fake iPhone Notch */}
        <div className="hidden sm:block absolute top-0 left-1/2 -translate-x-1/2 w-[120px] h-[30px] bg-gray-900 rounded-b-3xl z-50"></div>

        {/* Content Body */}
        <div className="flex-1 flex flex-col px-6 pt-20 pb-12 relative z-10 justify-between">
          
          {/* Top Hero Section */}
          <div>
            <div className="w-16 h-16 bg-white/10 backdrop-blur-xl rounded-[1.2rem] flex items-center justify-center mb-8 border border-white/20 shadow-xl">
              <ShieldCheck className="text-white" size={32} strokeWidth={1.5} />
            </div>
            <h1 className="text-4xl font-extrabold text-white tracking-tight mb-4 leading-[1.1]">
              Redefining <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D8B4FE] to-[#FCA5A5]">
                African Rent.
              </span>
            </h1>
            <p className="text-purple-100/90 text-[15px] font-medium leading-relaxed max-w-[280px]">
              Access housing seamlessly, collect effortlessly, and secure massive ROI on dynamic rent pools.
            </p>
          </div>

          {/* Abstract Center Graphic */}
          <div className="flex-1 flex items-center justify-center my-8 relative">
            <div className="absolute w-64 h-64 bg-purple-500/30 rounded-full blur-[60px] mix-blend-screen"></div>
            {/* Visual focal point */}
            <div className="w-48 h-48 border border-white/10 rounded-full flex items-center justify-center relative shadow-[inset_0_0_40px_rgba(255,255,255,0.1)]">
               <div className="w-32 h-32 bg-white/5 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/20">
                 <div className="w-16 h-16 bg-gradient-to-tr from-white to-purple-200 rounded-full shadow-[0_0_30px_rgba(255,255,255,0.5)]"></div>
               </div>
            </div>
          </div>

          {/* Bottom Call to Actions */}
          <div className="flex flex-col gap-3">
            
            {/* Conditional Rent Amount Input for Tenants */}
            {intendedRole === 'TENANT' && (
              <div className="mb-2 relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-200">
                  <Banknote size={20} strokeWidth={1.5} />
                </div>
                <input 
                  type="number" 
                  placeholder="Specific Rent Amount (KSh)"
                  value={rentAmount}
                  onChange={(e) => setRentAmount(e.target.value)}
                  className="w-full bg-white/10 border border-white/20 text-white placeholder:text-purple-200 rounded-[1.2rem] py-4 pl-12 pr-4 font-semibold text-[15px] focus:outline-none focus:border-white/50 focus:bg-white/20 focus:ring-4 focus:ring-white/10 transition backdrop-blur-md"
                />
              </div>
            )}
            
            <button 
              onClick={() => navigate('/login')}
              className="w-full bg-white text-[#512DA8] py-4 rounded-[1.2rem] font-bold text-[16px] shadow-[0_8px_20px_-6px_rgba(0,0,0,0.3)] flex items-center justify-center gap-2 transition active:scale-[0.98] hover:bg-gray-50"
            >
              <LogIn size={20} strokeWidth={2} /> Sign In to Welile
            </button>
            <button 
              onClick={() => navigate('/signup')} /* Placeholder for future signup page */
              className="w-full bg-transparent border border-white/30 text-white backdrop-blur-sm py-4 rounded-[1.2rem] font-bold text-[16px] flex items-center justify-center gap-2 hover:bg-white/10 transition active:scale-[0.98]"
            >
              <UserPlus size={20} strokeWidth={2} /> Create an Account
            </button>
          </div>
          
        </div>
      </div>
    </div>
  );
}
