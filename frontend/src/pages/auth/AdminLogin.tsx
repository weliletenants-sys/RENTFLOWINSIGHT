import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Phone, Lock, Eye, EyeOff, ArrowRight, Server, ShieldAlert, Loader2 } from 'lucide-react';
import { loginUser } from '../../services/authApi';
import toast from 'react-hot-toast';

export default function AdminLogin() {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { updateSession, user } = useAuth();
  const navigate = useNavigate();

  // If already logged in, redirect to admin dashboard (or normal dashboard based on permission)
  useEffect(() => {
    if (user) {
      if (user.role === 'CEO') navigate('/admin/executive/ceo');
      else if (user.role === 'COO') navigate('/admin/executive/coo');
      else if (user.role === 'CFO') navigate('/admin/executive/cfo');
      else navigate('/admin/dashboard');
    }
  }, [user, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!phone || !password) {
      setError("Root access requires complete credentials.");
      return;
    }

    // --- Hardcoded Test Bypass Credentials ---
    const adminBypassUsers: Record<string, any> = {
      '0700000000': { role: 'CEO', name: 'CEO User' },
      '0700000001': { role: 'COO', name: 'COO User' },
      '0700000002': { role: 'CFO', name: 'CFO User' }
    };

    if (adminBypassUsers[phone] && password === 'admin') {
        const u: any = { id: 999, phone, full_name: adminBypassUsers[phone].name, firstName: 'Test', lastName: 'User', role: adminBypassUsers[phone].role, verified: true };
        updateSession('dummy-token-admin_' + u.role, u);
        toast.success(`Admin authorization granted (${u.role}).`);
        
        if (u.role === 'CEO') navigate('/admin/executive/ceo');
        else if (u.role === 'COO') navigate('/admin/executive/coo');
        else if (u.role === 'CFO') navigate('/admin/executive/cfo');
        else navigate('/admin/dashboard');
        return;
    }
    // -----------------------------------------
    
    try {
      setLoading(true);
      const res = await loginUser({ phone, password });
      
      if (res.status === 'success') {
        const { access_token, user } = res.data;
        if (!['CEO', 'COO', 'CFO', 'ADMIN', 'SUPER_ADMIN'].includes(user.role)) {
           setError("Restricted: Your role does not have admin privileges.");
           return;
        }
        updateSession(access_token, user);
        toast.success(`Admin authorization granted (${user.role}).`);
        if (user.role === 'CEO') navigate('/admin/executive/ceo');
        else if (user.role === 'COO') navigate('/admin/executive/coo');
        else if (user.role === 'CFO') navigate('/admin/executive/cfo');
        else navigate('/admin/dashboard');
      }
    } catch (err: any) {
      const respError = err.response?.data?.detail || err.response?.data?.message || err.message;
      setError(respError);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-[#060b13] font-sans selection:bg-red-500/30 selection:text-red-200">
      <style>{`
        @keyframes shimmer {
          100% { transform: translateX(100%); }
        }
        .animate-shimmer {
          animation: shimmer 3s infinite;
        }
      `}</style>
      
      {/* LEFT: Branding & Aesthetic Half */}
      <div className="hidden lg:flex lg:w-5/12 relative overflow-hidden flex-col justify-between p-8 xl:p-10 border-r border-slate-800">
        <div className="absolute inset-0 z-0 bg-[#020617]">
          {/* Admin aesthetic image: abstract network / servers */}
          <img 
            src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=1600&auto=format&fit=crop&q=80" 
            alt="Secure Servers" 
            className="absolute inset-0 w-full h-full object-cover opacity-20 grayscale brightness-50 contrast-125"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-[#020617]/80 to-transparent z-10" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#020617] via-transparent to-[#020617] z-10" />
          
          {/* Abstract glows */}
          <div className="absolute top-[20%] -left-[20%] w-[60%] h-[60%] bg-blue-900/20 rounded-full mix-blend-screen filter blur-[120px] opacity-30 animate-pulse" />
          <div className="absolute bottom-[10%] -right-[20%] w-[60%] h-[60%] bg-red-900/20 rounded-full mix-blend-screen filter blur-[120px] opacity-30" />
        </div>
        
        <div className="relative z-20">
          <Link to="/">
            <img src="/welile-colored.png" alt="Welile Logo" className="h-6 object-contain mb-8 brightness-0 invert" />
          </Link>
          <div className="space-y-4 mt-6">
            <div className="inline-block px-3 py-1 bg-red-500/10 border border-red-500/20 text-red-500 text-[10px] font-bold tracking-widest uppercase rounded-full mb-2 shadow-[0_0_15px_rgba(239,68,68,0.2)]">Restricted Area</div>
            <h1 className="text-3xl xl:text-5xl font-extrabold text-white tracking-tight leading-[1.1]">
              System <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-200 to-slate-500">
                Administration
              </span>
            </h1>
            <p className="text-slate-400 text-sm xl:text-base leading-relaxed max-w-md font-medium">
              Authorized access only. All actions are logged, monitored, and rigorously audited by the security protocol.
            </p>
          </div>
        </div>

        <div className="relative z-20 bg-slate-900/50 backdrop-blur-md border border-slate-800 rounded-2xl p-5 max-w-md shadow-2xl">
          <div className="flex items-start gap-3 mb-4">
            <div className="p-2 bg-slate-800 rounded-xl mt-0.5 border border-slate-700">
              <Server className="w-4 h-4 text-blue-400" />
            </div>
            <div>
              <h4 className="text-slate-200 font-bold text-xs xl:text-sm tracking-wide">Root Control Access</h4>
              <p className="text-slate-500 text-[10px] xl:text-xs mt-0.5 leading-relaxed">Direct connection to master configuration, global ledgers, and architectural overrides.</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="p-2 bg-slate-800 rounded-xl mt-0.5 border border-slate-700">
              <ShieldAlert className="w-4 h-4 text-red-400" />
            </div>
            <div>
              <h4 className="text-slate-200 font-bold text-xs xl:text-sm tracking-wide">Zero Trust Layer</h4>
              <p className="text-slate-500 text-[10px] xl:text-xs mt-0.5 leading-relaxed">Cryptographically verified sessions with immediate anomaly termination.</p>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT: The Dark Admin Login Form */}
      <div className="w-full lg:w-7/12 bg-[#0a0f1c] flex flex-col justify-center relative overflow-hidden z-10 transition-all">
        
        {/* Subtle grid pattern background */}
        <div className="absolute inset-0 z-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-20 pointer-events-none"></div>

        <div className="w-full max-w-md mx-auto p-8 sm:p-12 relative z-20">
          
          <div className="lg:hidden mb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
             <Link to="/">
               <img src="/welile-colored.png" alt="Welile Logo" className="h-8 object-contain brightness-0 invert" />
             </Link>
          </div>

          <div className="mb-10 animate-in fade-in slide-in-from-bottom-6 duration-700 delay-100">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-2">Master Login</h2>
            <p className="text-slate-500 font-semibold text-sm">Provide root credentials to access the administration matrix.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
            <div className="space-y-2 group">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest pl-1">Admin Phone Number</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-600 group-focus-within:text-blue-500 transition-colors">
                   <Phone size={18} strokeWidth={2.5} />
                </div>
                <input 
                  type="tel" 
                  placeholder="0700000000"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-[#0f172a] border border-slate-800 hover:border-slate-700 focus:border-blue-500/50 focus:bg-[#1e293b] focus:ring-4 focus:ring-blue-500/10 rounded-2xl transition-all outline-none text-white font-medium placeholder:text-slate-600 placeholder:font-medium shadow-inner" 
                  autoComplete="tel"
                />
              </div>
            </div>

            <div className="space-y-2 group">
              <div className="flex justify-between items-center px-1">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Master Key</label>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-600 group-focus-within:text-blue-500 transition-colors">
                   <Lock size={18} strokeWidth={2.5} />
                </div>
                <input 
                  type={showPassword ? "text" : "password"} 
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-12 py-4 bg-[#0f172a] border border-slate-800 hover:border-slate-700 focus:border-blue-500/50 focus:bg-[#1e293b] focus:ring-4 focus:ring-blue-500/10 rounded-2xl transition-all outline-none text-white font-medium tracking-wide placeholder:text-slate-600 placeholder:tracking-normal placeholder:font-medium shadow-inner" 
                  autoComplete="current-password"
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-600 hover:text-blue-400 transition-colors cursor-pointer"
                >
                  {showPassword ? <EyeOff size={18} strokeWidth={2.5} /> : <Eye size={18} strokeWidth={2.5} />}
                </button>
              </div>
            </div>

            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 animate-in fade-in zoom-in-95 duration-200">
                <div className="w-1.5 h-8 bg-red-500 rounded-full shadow-[0_0_10px_rgba(239,68,68,0.5)]"></div>
                <p className="text-red-400 font-bold text-xs leading-relaxed">{error}</p>
              </div>
            )}

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-500 text-white disabled:opacity-60 disabled:hover:bg-blue-600 disabled:cursor-not-allowed font-bold py-4 px-6 rounded-2xl transition-all duration-300 shadow-[0_8px_30px_rgba(37,99,235,0.2)] hover:shadow-[0_8px_40px_rgba(37,99,235,0.4)] flex items-center justify-center gap-3 group mt-6 relative overflow-hidden cursor-pointer"
            >
              {/* Shine effect */}
              <div className="absolute inset-0 -translate-x-full group-hover:animate-shimmer bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
              
              <span className="relative z-10">{loading ? 'Validating Root Layer...' : 'Initialize Session'}</span>
              
              <div className="relative z-10 flex items-center">
                 {loading ? <Loader2 size={18} strokeWidth={3} className="animate-spin text-white/80" /> : <ArrowRight size={18} strokeWidth={2.5} className="group-hover:translate-x-1.5 transition-transform" />}
              </div>
            </button>

            <div className="text-center pt-8 mt-4">
              <p className="text-xs font-bold text-slate-700 tracking-widest uppercase">
                Welile Intelligence Core v1.0
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
