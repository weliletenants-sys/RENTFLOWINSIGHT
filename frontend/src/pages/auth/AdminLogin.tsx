import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Mail, User, Lock, Eye, EyeOff, ArrowRight, Loader2 } from 'lucide-react';
import { loginAdmin } from '../../services/authApi';
import toast from 'react-hot-toast';

export default function AdminLogin() {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { updateSession, user } = useAuth();
  const navigate = useNavigate();

  // If already logged in, redirect to admin dashboard (or normal dashboard based on permission)
  useEffect(() => {
    if (user) {
      navigate('/admin/dashboard');
    }
  }, [user, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!identifier || !password) {
      setError("Please provide complete credentials.");
      return;
    }


    try {
      setLoading(true);
      const res = await loginAdmin({ phone: identifier, password });
      
      if (res.status === 'success') {
        const { access_token, user, onboarding_url } = res.data;
        updateSession(access_token, user, true); // True to enforce ephemeral admin session
        toast.success(`Admin access granted (${user.role}).`);
        navigate(onboarding_url || '/admin/dashboard');
      }
    } catch (err: any) {
      const respError = err.response?.data?.detail || err.response?.data?.message || err.message;
      setError(respError);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-slate-50 font-sans">
      
      {/* LEFT: Branding & Image Half */}
      <div className="hidden lg:flex lg:w-5/12 relative overflow-hidden flex-col justify-between border-r border-slate-200">
        <div className="absolute inset-0 z-0 bg-slate-100">
          <img 
            src="/images/welile-event-kampala-C5qGC2jg.jpg" 
            alt="Event" 
            className="absolute inset-0 w-full h-full object-cover"
          />
          {/* Subtle gradient overlay to make text readable */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30 z-10" />
        </div>
        
        <div className="relative z-20 p-8 xl:p-10 flex flex-col h-full">
          <div className="mb-12">
            <Link to="/">
              <img src="/welile-colored.png" alt="Welile Logo" className="h-6 object-contain brightness-0 invert" />
            </Link>
          </div>

          <div className="space-y-4">
            <div className="inline-block px-3 py-1 bg-white/20 backdrop-blur-sm text-white text-[10px] font-bold tracking-widest uppercase rounded-full mb-2">Staff Only</div>
            <h1 className="text-3xl xl:text-5xl font-extrabold text-white tracking-tight leading-[1.1]">
              System Admin
            </h1>
            <p className="text-white/90 text-sm xl:text-base leading-relaxed max-w-md font-medium">
              Welcome back. Log in to manage the system.
            </p>
          </div>
        </div>
      </div>

      {/* RIGHT: Login Form */}
      <div className="w-full lg:w-7/12 bg-white flex flex-col justify-center relative overflow-hidden z-10">
        
        {/* Very subtle background grid */}
        <div className="absolute inset-0 z-0 bg-[linear-gradient(to_right,#f1f5f9_1px,transparent_1px),linear-gradient(to_bottom,#f1f5f9_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-60 pointer-events-none"></div>

        <div className="w-full max-w-md mx-auto p-8 sm:p-12 relative z-20">
          
          <div className="lg:hidden mb-12">
             <Link to="/">
               <img src="/welile-colored.png" alt="Welile Logo" className="h-8 object-contain" />
             </Link>
          </div>

          <div className="mb-10">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-2">Admin Login</h2>
            <p className="text-slate-500 font-medium text-sm">Please sign in to access the admin portal.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2 group">
              <label className="text-sm font-semibold text-slate-700">Email or Employee ID</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-500 transition-colors">
                   {identifier.includes('@') ? (
                     <Mail size={18} strokeWidth={2.5} />
                   ) : (
                     <User size={18} strokeWidth={2.5} />
                   )}
                </div>
                <input 
                  type="text" 
                  placeholder="email/ID"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-white border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 rounded-xl transition-all outline-none text-slate-900 font-medium placeholder:text-slate-400" 
                  autoComplete="username"
                />
              </div>
            </div>

            <div className="space-y-2 group">
              <div className="flex justify-between items-center">
                <label className="text-sm font-semibold text-slate-700">Password</label>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-500">
                   <Lock size={18} strokeWidth={2.5} />
                </div>
                <input 
                  type={showPassword ? "text" : "password"} 
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-12 py-3 bg-white border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 rounded-xl transition-all outline-none text-slate-900 font-medium placeholder:text-slate-400" 
                  autoComplete="current-password"
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-blue-500 cursor-pointer"
                >
                  {showPassword ? <EyeOff size={18} strokeWidth={2.5} /> : <Eye size={18} strokeWidth={2.5} />}
                </button>
              </div>
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3">
                <p className="text-red-600 font-medium text-sm">{error}</p>
              </div>
            )}

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-60 disabled:hover:bg-blue-600 font-bold py-3.5 px-6 rounded-xl transition-colors flex items-center justify-center gap-3 mt-4"
            >
              <span>{loading ? 'Signing in...' : 'Sign In'}</span>
              
              <div className="flex items-center">
                 {loading ? <Loader2 size={18} strokeWidth={3} className="animate-spin text-white/80" /> : <ArrowRight size={18} strokeWidth={2.5} />}
              </div>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
