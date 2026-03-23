import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Mail, Lock, Eye, EyeOff, ArrowRight, ShieldCheck, Sparkles, Loader2 } from 'lucide-react';
import { loginUser } from '../../services/authApi';
import toast from 'react-hot-toast';
import { GoogleOAuthProvider, useGoogleLogin } from '@react-oauth/google';

function GoogleSSOButton({ disabled, onStart, onSuccess, onError }: any) {
  const triggerLogin = useGoogleLogin({
    onSuccess,
    onError,
  });

  return (
    <button 
      type="button" 
      onClick={() => { onStart(); triggerLogin(); }}
      disabled={disabled}
      className="w-full flex items-center justify-center gap-3 py-3.5 px-4 bg-white border border-zinc-200 hover:bg-zinc-50 disabled:opacity-60 transition-colors rounded-xl shadow-[0_2px_10px_rgba(0,0,0,0.03)] cursor-pointer group"
    >
      {disabled ? <Loader2 size={18} strokeWidth={3} className="animate-spin text-zinc-400" /> : (
        <svg className="w-5 h-5 group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
        </svg>
      )}
      <span className="text-zinc-700 font-bold text-sm tracking-wide">{disabled ? 'Bridging Secure Auth...' : 'Continue with Google'}</span>
    </button>
  );
}

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  
  const { updateSession, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate(user.role === 'FUNDER' ? '/funder' : '/dashboard');
    }
  }, [user, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!email || !password) {
      setError("Please enter your email and password.");
      return;
    }

    // --- Hardcoded Test Bypass Credentials ---
    const bypassUsers: Record<string, any> = {
      'tenant@welile.com': { role: 'TENANT', name: 'Tenant User' },
      'agent@welile.com': { role: 'AGENT', name: 'Agent User' },
      'funder@welile.com': { role: 'FUNDER', name: 'Funder User' },
    };

    if (bypassUsers[email] && password === 'admin') {
        const u: any = { id: 999, email, full_name: bypassUsers[email].name, firstName: 'Test', lastName: 'User', role: bypassUsers[email].role, verified: true };
        updateSession('dummy-token', u);
        toast.success(`Logged in as ${u.role} (Bypass)`);
        
        switch(u.role) {
            case 'SUPER_ADMIN': navigate('/admin/dashboard'); break;
            case 'CEO': navigate('/ceo/dashboard'); break;
            case 'COO': navigate('/coo/overview'); break;
            case 'CFO': navigate('/cfo/dashboard'); break;
            case 'FUNDER': navigate('/funder'); break;
            case 'TENANT': 
            case 'AGENT':
            case 'LANDLORD':
            default: navigate('/dashboard'); break;
        }
        return;
    }
    // -----------------------------------------
    
    try {
      setLoading(true);
      const res = await loginUser({ email, password });
      
      // Update real JWT session via AuthContext
      if (res.status === 'success') {
        const { access_token, user, onboarding_url } = res.data;
        updateSession(access_token, user);
        toast.success('Successfully logged in!');
        
        if (onboarding_url && !user.verified) {
          navigate(onboarding_url);
        } else {
          switch(user.role) {
            case 'SUPER_ADMIN': navigate('/admin/dashboard'); break;
            case 'CEO': navigate('/ceo/dashboard'); break;
            case 'COO': navigate('/coo/overview'); break;
            case 'CFO': navigate('/cfo/dashboard'); break;
            case 'FUNDER': navigate('/funder'); break;
            case 'TENANT': 
            case 'AGENT':
            case 'LANDLORD':
            default: navigate('/dashboard'); break;
          }
        }
      }
    } catch (err: any) {
      const respError = err.response?.data?.detail || err.response?.data?.message || err.message;
      setError(respError);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (tokenResponse: any) => {
    try {
      setError('');
      
      const res = await fetch('http://localhost:3000/api/auth/sessions/sso', {
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify({ credential: tokenResponse.access_token })
      });
      
      const data = await res.json();
      
      if (data.status === 'success') {
        updateSession(data.data.access_token, data.data.user);
        toast.success('Successfully authenticated via Google!');
        
        if (data.data.onboarding_url && !data.data.user.verified) {
           navigate(data.data.onboarding_url);
        } else {
           const role = data.data.user.role;
           switch(role) {
             case 'SUPER_ADMIN': navigate('/admin/dashboard'); break;
             case 'CEO': navigate('/ceo/dashboard'); break;
             case 'COO': navigate('/coo/overview'); break;
             case 'CFO': navigate('/cfo/dashboard'); break;
             case 'FUNDER': navigate('/funder'); break;
             case 'TENANT': 
             case 'AGENT':
             case 'LANDLORD':
             default: navigate('/dashboard'); break;
           }
        }
      } else {
        setError(data.message || data.detail || "Account doesn't exist, try again.");
      }
    } catch (err: any) {
      setError("Account doesn't exist, try again.");
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-[#170330] font-sans selection:bg-[var(--color-primary)] selection:text-white">
      <style>{`
        @keyframes shimmer {
          100% { transform: translateX(100%); }
        }
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
      `}</style>
      
      {/* LEFT: Branding & Aesthetic Half */}
      <div className="hidden lg:flex lg:w-5/12 relative overflow-hidden flex-col justify-between p-8 xl:p-10">
        <div className="absolute inset-0 z-0 bg-[#0a0115]">
          <img 
            src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1600&auto=format&fit=crop&q=80" 
            alt="Premium Real Estate Architecture" 
            className="absolute inset-0 w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-primary-darker)]/70 via-[#170330]/80 to-[#0a0115]/90 z-10 mix-blend-multiply" />
          {/* Abstract glows */}
          <div className="absolute -top-[10%] -left-[10%] w-[80%] h-[60%] bg-[var(--color-primary)] rounded-full mix-blend-screen filter blur-[140px] opacity-30 animate-pulse" />
          <div className="absolute top-[50%] -right-[20%] w-[60%] h-[60%] bg-[var(--color-primary-dark)] rounded-full mix-blend-screen filter blur-[150px] opacity-40" />
        </div>
        
        <div className="relative z-20">
          <Link to="/">
            {/* If there is no white version of the logo, this colored one still works well */}
            <img src="/welile-colored.png" alt="Welile Logo" className="h-6 object-contain mb-8 brightness-0 invert" />
          </Link>
          <div className="space-y-4 mt-6">
            <h1 className="text-3xl xl:text-5xl font-extrabold text-white tracking-tight leading-[1.1]">
              Unlock <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-[var(--color-primary-border)]">
                Digital Wealth
              </span>
            </h1>
            <p className="text-zinc-300 text-sm xl:text-base leading-relaxed max-w-md font-medium">
              Access your unified portfolio, track high-yield investments, and orchestrate global real estate capital with military-grade precision.
            </p>
          </div>
        </div>

        <div className="relative z-20 bg-white/5 backdrop-blur-xl border border-[var(--color-primary-border)]/20 rounded-2xl p-5 max-w-md shadow-2xl">
          <div className="flex items-start gap-3 mb-4">
            <div className="p-2 bg-[var(--color-primary)]/40 rounded-xl mt-0.5 ring-1 ring-white/20 shadow-inner block">
              <ShieldCheck className="w-4 h-4 text-white" />
            </div>
            <div>
              <h4 className="text-white font-bold text-xs xl:text-sm tracking-wide">Rent Guarantee Protocol</h4>
              <p className="text-zinc-400 text-[10px] xl:text-xs mt-0.5 leading-relaxed">Eliminating vacancy and default risk for landlords while providing flexible daily repayments for tenants.</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="p-2 bg-[var(--color-primary-dark)]/40 rounded-xl mt-0.5 ring-1 ring-[var(--color-primary-border)]/30 shadow-inner block">
              <Sparkles className="w-4 h-4 text-[var(--color-primary-border)]" />
            </div>
            <div>
              <h4 className="text-white font-bold text-xs xl:text-sm tracking-wide">Trust-Based Ecosystem</h4>
              <p className="text-zinc-400 text-[10px] xl:text-xs mt-0.5 leading-relaxed">Connecting tenants, field agents, and global supporters through a unified, secure financial ledger.</p>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT: The Pure Login Form */}
      <div className="w-full lg:w-7/12 bg-white flex flex-col justify-center relative overflow-hidden lg:rounded-l-[2.5rem] shadow-[-20px_0_40px_rgba(0,0,0,0.3)] z-10 transition-all">
        
        {/* Subtle background blob for the white side */}
        <div className="absolute top-0 right-0 w-[50%] h-[40%] bg-[#6c11d4]/5 rounded-full filter blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[40%] h-[30%] bg-[#ec5b13]/5 rounded-full filter blur-[100px] pointer-events-none" />

        <div className="w-full max-w-md mx-auto p-8 sm:p-12 relative z-20">
          
          <div className="lg:hidden mb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
             <Link to="/">
               <img src="/welile-colored.png" alt="Welile Logo" className="h-8 object-contain" />
             </Link>
          </div>

          <div className="mb-10 animate-in fade-in slide-in-from-bottom-6 duration-700 delay-100">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-zinc-900 tracking-tight mb-2">Welcome Back</h2>
            <p className="text-zinc-500 font-semibold text-sm">Enter your secure credentials to access your dashboard.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
            <div className="space-y-2 group">
              <label className="text-[11px] font-bold text-zinc-700 uppercase tracking-widest pl-1">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-zinc-400 group-focus-within:text-[#6c11d4] transition-colors">
                   <Mail size={18} strokeWidth={2.5} />
                </div>
                <input 
                  type="email" 
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-zinc-50/50 border border-zinc-200 hover:border-zinc-300 focus:border-[#6c11d4]/50 focus:bg-white focus:ring-4 focus:ring-[#6c11d4]/10 rounded-2xl transition-all outline-none text-zinc-900 font-medium placeholder:text-zinc-400 placeholder:font-medium shadow-sm" 
                  autoComplete="email"
                />
              </div>
            </div>

            <div className="space-y-2 group">
              <div className="flex justify-between items-center px-1">
                <label className="text-[11px] font-bold text-zinc-700 uppercase tracking-widest">Password</label>
                <a className="text-[11px] font-bold text-[#6c11d4] hover:text-[#5b21b6] transition-colors" href="#">Forgot Password?</a>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-zinc-400 group-focus-within:text-[#6c11d4] transition-colors">
                   <Lock size={18} strokeWidth={2.5} />
                </div>
                <input 
                  type={showPassword ? "text" : "password"} 
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-12 py-4 bg-slate-50/50 border border-slate-200 hover:border-slate-300 focus:border-[#6c11d4]/50 focus:bg-white focus:ring-4 focus:ring-[#6c11d4]/10 rounded-2xl transition-all outline-none text-slate-900 font-medium tracking-wide placeholder:text-slate-400 placeholder:tracking-normal placeholder:font-medium shadow-sm" 
                  autoComplete="current-password"
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-[#6c11d4] transition-colors cursor-pointer"
                >
                  {showPassword ? <EyeOff size={18} strokeWidth={2.5} /> : <Eye size={18} strokeWidth={2.5} />}
                </button>
              </div>
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-100 rounded-xl flex items-center gap-3 animate-in fade-in zoom-in-95 duration-200">
                <div className="w-1.5 h-8 bg-red-500 rounded-full shadow-sm"></div>
                <p className="text-red-700 font-bold text-xs leading-relaxed">{error}</p>
              </div>
            )}

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-[var(--color-primary-darker)] hover:bg-[var(--color-primary-dark)] text-white disabled:opacity-60 disabled:hover:bg-[var(--color-primary-darker)] disabled:cursor-not-allowed font-bold py-4 px-6 rounded-2xl transition-all duration-300 shadow-[0_8px_30px_var(--color-primary-shadow)] flex items-center justify-center gap-3 group mt-6 relative overflow-hidden cursor-pointer"
            >
              {/* Shine effect */}
              <div className="absolute inset-0 -translate-x-full group-hover:animate-shimmer bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
              
              <span className="relative z-10">{loading ? 'Authenticating Session...' : 'Sign In'}</span>
              
              <div className="relative z-10 flex items-center">
                 {loading ? <Loader2 size={18} strokeWidth={3} className="animate-spin text-white/80" /> : <ArrowRight size={18} strokeWidth={2.5} className="group-hover:translate-x-1.5 transition-transform" />}
              </div>
            </button>
            
            {/* Divider */}
            <div className="relative mt-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-zinc-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-3 bg-white text-zinc-400 font-bold tracking-wide uppercase text-[10px]">Or continue with</span>
              </div>
            </div>

            {/* SSO Buttons */}
            <div className="mt-6">
              <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID || "dummy"}>
                <GoogleSSOButton 
                  disabled={googleLoading || loading}
                  onStart={() => setGoogleLoading(true)}
                  onSuccess={handleGoogleSuccess}
                  onError={() => {
                    setGoogleLoading(false);
                    setError('Google authorization completely failed or was closed.');
                  }}
                />
              </GoogleOAuthProvider>
            </div>
            
            <div className="text-center pt-8 mt-4">
              <p className="text-sm font-medium text-slate-500">
                Don't have an account?{' '}
                <Link to="/signup" className="text-[#6c11d4] font-bold hover:text-[#5b21b6] hover:underline ml-1 transition-colors">
                  Create Account
                </Link>
              </p>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}
