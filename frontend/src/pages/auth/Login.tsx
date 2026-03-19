import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Phone, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';
import PurpleBubbles from '../../components/PurpleBubbles';

export default function Login() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  
  const { login, intendedRole } = useAuth();
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!phoneNumber || !password) {
      setError("Please enter your phone number and password.");
      return;
    }
    
    // Mock login action
    login({
      id: 'mock-uuid',
      email: phoneNumber + '@welile.com', // Mocked linking until actual Auth is wired
      firstName: 'Paul',
      lastName: 'Ndlovu',
      role: intendedRole, // Assign the role they clicked back at step 1
      isVerified: false,  // Force onboarding for demo
    });
    
    // Send directly to the Dashboard
    navigate('/dashboard');
  };

  return (
    <div className="bg-[#fdfcff] min-h-screen flex flex-col antialiased text-slate-900 relative z-0">
      <style>{`
        .bg-mesh {
            background-color: #fdfcff;
            background-image: 
                radial-gradient(at 0% 0%, rgba(109, 40, 217, 0.05) 0px, transparent 50%),
                radial-gradient(at 100% 100%, rgba(109, 40, 217, 0.08) 0px, transparent 50%),
                radial-gradient(at 50% 50%, rgba(236, 91, 19, 0.02) 0px, transparent 50%);
        }
      `}</style>
      
      {/* Background Mesh (applied via absolute div to keep body clean) */}
      <div className="absolute inset-0 bg-mesh pointer-events-none z-0"></div>

      {/* Animated Purple Bubbles */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <PurpleBubbles />
      </div>

      <main className="relative z-10 flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl shadow-[#6d28d9]/5 border border-slate-100 overflow-hidden">
          
          <div className="p-1.5 bg-slate-50 flex m-6 rounded-2xl">
            <button className="flex-1 py-2.5 px-4 text-sm font-semibold rounded-xl transition-all duration-200 bg-white shadow-sm text-[#6d28d9]">
                Sign In
            </button>
            <button 
              onClick={() => navigate('/signup')}
              className="flex-1 py-2.5 px-4 text-sm font-semibold rounded-xl transition-all duration-200 text-slate-500 hover:text-slate-700 hover:bg-slate-200/50"
            >
                Sign Up
            </button>
          </div>

          <div className="px-8 pb-10">
            <div className="mb-8 text-center">
              <h1 className="text-2xl font-bold text-slate-900 mb-2">Welcome Back</h1>
              <p className="text-slate-500 text-sm">Secure access to your digital wealth</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-5">
              
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 ml-1">Phone Number</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-[#6d28d9] transition-colors">
                    <Phone size={18} strokeWidth={2} />
                  </div>
                  <input 
                    type="tel" 
                    placeholder="0704825473"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border-transparent focus:border-[#6d28d9]/30 focus:bg-white focus:ring-4 focus:ring-[#6d28d9]/10 rounded-xl transition-all outline-none text-slate-900 font-medium" 
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center px-1">
                  <label className="text-sm font-semibold text-slate-700">Password</label>
                  <a className="text-xs font-semibold text-[#6d28d9] hover:underline" href="#">Forgot?</a>
                </div>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-[#6d28d9] transition-colors">
                    <Lock size={18} strokeWidth={2} />
                  </div>
                  <input 
                    type={showPassword ? "text" : "password"} 
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-11 pr-12 py-3.5 bg-slate-50 border-transparent focus:border-[#6d28d9]/30 focus:bg-white focus:ring-4 focus:ring-[#6d28d9]/10 rounded-xl transition-all outline-none text-slate-900 font-medium tracking-wide" 
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff size={18} strokeWidth={2} /> : <Eye size={18} strokeWidth={2} />}
                  </button>
                </div>
              </div>

              {error && <p className="text-red-500 text-center font-bold text-sm bg-red-50 py-2 rounded-xl border border-red-100">{error}</p>}

              <button 
                type="submit" 
                className="w-full bg-[#6d28d9] hover:bg-[#5b21b6] text-white font-bold py-4 px-6 rounded-xl transition-all shadow-lg shadow-[#6d28d9]/20 flex items-center justify-center gap-2 group mt-2"
              >
                <span>Continue</span>
                <ArrowRight size={18} strokeWidth={2} className="group-hover:translate-x-1 transition-transform" />
              </button>
              
              <div className="text-center mt-6">
                <button 
                  type="button" 
                  onClick={() => navigate('/')} 
                  className="text-sm font-semibold text-slate-500 hover:text-[#6d28d9] hover:underline transition-colors"
                >
                  Return to Home
                </button>
              </div>
            </form>



          </div>
        </div>
      </main>

      <footer className="relative z-10 w-full max-w-7xl mx-auto px-6 py-8 flex flex-col sm:flex-row justify-between items-center gap-4">
        <p className="text-xs text-slate-400 font-medium">© 2024 Welile Technologies Limited. All rights reserved.</p>
        <div className="flex gap-6">
          <a className="text-xs text-slate-400 hover:text-[#6d28d9] transition-colors" href="#">Privacy Policy</a>
          <a className="text-xs text-slate-400 hover:text-[#6d28d9] transition-colors" href="#">Terms of Service</a>
          <a className="text-xs text-slate-400 hover:text-[#6d28d9] transition-colors" href="#">Cookies</a>
        </div>
      </footer>

      {/* Floating Colored Blurs */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-[-1] overflow-hidden">
        <div className="absolute top-[10%] left-[-10%] w-[40%] h-[40%] bg-[#6d28d9]/5 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#6d28d9]/10 rounded-full blur-[120px]"></div>
      </div>
    </div>
  );
}
