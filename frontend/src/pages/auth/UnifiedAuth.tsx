import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Phone, Mail, Lock, Eye, EyeOff, ArrowRight, User, Loader2, KeyRound, CheckCircle2 } from 'lucide-react';
import PurpleBubbles from '../../components/PurpleBubbles';
import { loginUser, registerUser, sendOTP, verifyOTP } from '../../services/authApi';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

export default function UnifiedAuth() {
  const [searchParams] = useSearchParams();
  const initialMode = searchParams.get('mode') === 'signup' ? 'signup' : 'login';
  const refCode = searchParams.get('ref');

  const [mode, setMode] = useState<'login' | 'signup'>(initialMode);
  
  // Login State
  const [loginPhone, setLoginPhone] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);

  // Signup State - Multi-step Wizard
  const [signupStep, setSignupStep] = useState<1 | 2 | 3>(1);
  const [phone, setPhone] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Global UI State
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingTextIdx, setLoadingTextIdx] = useState(0);
  const loadingTexts = ["Authenticating...", "Securing Connection...", "Generating Keys...", "Almost there..."];

  const { updateSession, intendedRole, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      if (user.role === 'FUNDER') navigate('/funder');
      else if (user.role === 'COO') navigate('/coo/overview');
      else if (user.role === 'CFO') navigate('/cfo/dashboard');
      else if (user.role === 'CEO') navigate('/ceo/dashboard');
      else if (user.role === 'SUPER_ADMIN') navigate('/admin/dashboard');
      else navigate('/dashboard');
    }
  }, [user, navigate]);

  useEffect(() => {
    if (!loading) return;
    const interval = setInterval(() => {
      setLoadingTextIdx(p => (p + 1) % loadingTexts.length);
    }, 2000);
    return () => clearInterval(interval);
  }, [loading]);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!loginPhone || !loginPassword) {
      setError("Please enter your registered phone number and password.");
      return;
    }

    try {
      setLoading(true);
      const res = await loginUser({ phone: loginPhone, password: loginPassword });
      
      if (res.status === 'success') {
        const { access_token, user, onboarding_url } = res.data;
        updateSession(access_token, user);
        toast.success(`Welcome back, ${user.firstName}!`);
        
        if (onboarding_url && !user.verified) {
          navigate(onboarding_url);
        } else {
          switch(user.role) {
            case 'SUPER_ADMIN': navigate('/admin/dashboard'); break;
            case 'CEO': navigate('/ceo/dashboard'); break;
            case 'COO': navigate('/coo/overview'); break;
            case 'CFO': navigate('/cfo/dashboard'); break;
            case 'FUNDER': navigate('/funder'); break;
            default: navigate('/dashboard'); break;
          }
        }
      }
    } catch (err: any) {
      setError(err.response?.data?.detail || err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  // --- SIGNUP WIZARD HANDLERS ---
  
  const handleRequestOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!phone || phone.length < 9) {
      setError("Please enter a valid mobile number.");
      return;
    }

    try {
      setLoading(true);
      await sendOTP({ phone: phone.trim() });
      toast.success("Verification code sent via SMS.");
      setSignupStep(2);
    } catch (err: any) {
      setError(err.response?.data?.detail || "Could not send verification code.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!otpCode || otpCode.length < 4) {
      setError("Please enter the verification code sent to your phone.");
      return;
    }

    try {
      setLoading(true);
      await verifyOTP({ phone: phone.trim(), otp_code: otpCode.trim() });
      toast.success("Number verified successfully!");
      setSignupStep(3);
    } catch (err: any) {
      setError(err.response?.data?.detail || "Invalid or expired verification code.");
    } finally {
      setLoading(false);
    }
  };

  const handleSignupComplete = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!firstName || !lastName || !signupPassword || !confirmPassword) {
      setError("Please fill out all required fields.");
      return;
    }

    if (signupPassword !== confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    try {
      setLoading(true);
      const res = await registerUser({
        phone: phone.trim(),
        email: signupEmail.trim() || undefined,
        password: signupPassword,
        firstName,
        lastName,
        role: intendedRole || 'TENANT',
      });

      if (res.status === 'success') {
        const { access_token, user, onboarding_url } = res.data;
        updateSession(access_token, user);
        toast.success(`Welcome, ${user.firstName}! Your account has been created.`);
        
        if (onboarding_url) {
          navigate(onboarding_url);
        } else {
          navigate(intendedRole === 'TENANT' ? '/tenant-agreement' : '/dashboard');
        }
      }
    } catch (err: any) {
      setError(err.response?.data?.detail || err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
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
      
      <div className="absolute inset-0 bg-mesh pointer-events-none z-0"></div>
      <div className="fixed inset-0 z-0 pointer-events-none"><PurpleBubbles /></div>

      <main className="relative z-10 flex-1 flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8 overflow-y-auto w-full">
        {mode === 'login' && (
          <div className="mb-8 cursor-pointer" onClick={() => navigate('/')}>
             <img src="/welile-colored.png" alt="Welile Logo" className="h-8 object-contain" />
          </div>
        )}

        <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl shadow-[#6c11d4]/5 border border-slate-100 overflow-hidden shrink-0 my-4 transform transition-all duration-500">
          
          <div className="p-1.5 bg-slate-50 flex m-6 rounded-2xl relative">
            <button 
              onClick={() => { setMode('login'); setError(''); setSignupStep(1); }}
              className={`flex-1 py-2.5 px-4 text-sm font-semibold rounded-xl transition-all duration-300 ${mode === 'login' ? 'bg-white shadow-sm text-[#6c11d4]' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'}`}
            >
                Sign In
            </button>
            <button 
              onClick={() => { setMode('signup'); setError(''); }}
              className={`flex-1 py-2.5 px-4 text-sm font-semibold rounded-xl transition-all duration-300 ${mode === 'signup' ? 'bg-white shadow-sm text-[#6c11d4]' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'}`}
            >
                Sign Up
            </button>
          </div>

          <div className="px-8 pb-10 origin-top">
            
            <AnimatePresence mode="wait">
              {mode === 'login' ? (
                <motion.div 
                  key="login-form"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="mb-8 text-center">
                    <h1 className="text-2xl font-bold text-slate-900 mb-2">Welcome Back</h1>
                    <p className="text-slate-500 text-sm">Secure access using your phone number</p>
                  </div>

                  <form onSubmit={handleLoginSubmit} className="space-y-5">
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-slate-700 ml-1">Phone Number</label>
                      <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-[#6c11d4] transition-colors">
                          <Phone size={18} strokeWidth={2} />
                        </div>
                        <input 
                          type="tel" 
                          placeholder="0704825473"
                          value={loginPhone}
                          onChange={(e) => setLoginPhone(e.target.value)}
                          className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-100 focus:border-[#6c11d4]/30 focus:bg-white focus:ring-4 focus:ring-[#6c11d4]/10 rounded-xl transition-all outline-none text-slate-900 font-medium tracking-wide" 
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between items-center px-1">
                        <label className="text-sm font-semibold text-slate-700">Password</label>
                        <a className="text-xs font-semibold text-[#6c11d4] hover:underline cursor-pointer">Forgot?</a>
                      </div>
                      <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-[#6c11d4] transition-colors">
                          <Lock size={18} strokeWidth={2} />
                        </div>
                        <input 
                          type={showLoginPassword ? "text" : "password"} 
                          placeholder="••••••••"
                          value={loginPassword}
                          onChange={(e) => setLoginPassword(e.target.value)}
                          className="w-full pl-11 pr-12 py-3.5 bg-slate-50 border border-slate-100 focus:border-[#6c11d4]/30 focus:bg-white focus:ring-4 focus:ring-[#6c11d4]/10 rounded-xl transition-all outline-none text-slate-900 font-medium tracking-wide" 
                        />
                        <button 
                          type="button"
                          onClick={() => setShowLoginPassword(!showLoginPassword)}
                          className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-[#6c11d4]"
                        >
                          {showLoginPassword ? <EyeOff size={18} strokeWidth={2} /> : <Eye size={18} strokeWidth={2} />}
                        </button>
                      </div>
                    </div>

                    {error && <p className="text-red-500 text-center font-bold text-sm bg-red-50 py-2 rounded-xl border border-red-100">{error}</p>}

                    <button 
                      type="submit" 
                      disabled={loading}
                      className="w-full bg-[#6c11d4] hover:bg-[#5b21b6] disabled:opacity-70 disabled:cursor-not-allowed text-white font-bold py-4 px-6 rounded-xl transition-all shadow-lg shadow-[#6c11d4]/20 flex items-center justify-center gap-2 group mt-2 h-[56px] overflow-hidden"
                    >
                      {loading ? (
                        <div className="flex items-center gap-2 justify-center w-full">
                          <Loader2 size={18} className="animate-spin" />
                          <AnimatePresence mode="wait">
                            <motion.span key={loadingTextIdx} initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -20, opacity: 0 }} transition={{ duration: 0.3 }} className="whitespace-nowrap text-sm">
                              {loadingTexts[loadingTextIdx]}
                            </motion.span>
                          </AnimatePresence>
                        </div>
                      ) : (
                        <>
                          <span>Sign In Securely</span>
                          <ArrowRight size={18} strokeWidth={2} className="group-hover:translate-x-1 transition-transform" />
                        </>
                      )}
                    </button>
                    
                    <div className="text-center mt-6">
                      <button type="button" onClick={() => navigate('/')} className="text-sm font-semibold text-slate-500 hover:text-[#6c11d4] hover:underline transition-colors">
                        Return Home
                      </button>
                    </div>
                  </form>
                </motion.div>
              ) : (
                <motion.div 
                  key="signup-form"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="mb-6 text-center">
                    <h1 className="text-2xl font-bold text-slate-900 mb-2">Create Account</h1>
                    
                    {/* Progress Indicator */}
                    <div className="flex items-center justify-center gap-2 mt-4">
                      <div className={`h-1.5 w-8 rounded-full ${signupStep >= 1 ? 'bg-[#6c11d4]' : 'bg-slate-200'}`}></div>
                      <div className={`h-1.5 w-8 rounded-full ${signupStep >= 2 ? 'bg-[#6c11d4]' : 'bg-slate-200'}`}></div>
                      <div className={`h-1.5 w-8 rounded-full ${signupStep >= 3 ? 'bg-[#6c11d4]' : 'bg-slate-200'}`}></div>
                    </div>
                  </div>
                  
                  {refCode && signupStep === 1 && (
                    <div className="mb-6 p-3 bg-purple-50 border border-purple-100 rounded-xl text-center">
                      <p className="text-sm font-medium text-purple-700">You were invited by Agent <span className="font-bold">{refCode}</span></p>
                    </div>
                  )}

                  {/* STEP 1: PHONE COLLECTION */}
                  {signupStep === 1 && (
                    <form onSubmit={handleRequestOTP} className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-700 ml-1">Mobile Number</label>
                        <p className="text-xs text-slate-500 ml-1 mb-2">We will send a secure verification code to verify your identity.</p>
                        <div className="relative group">
                          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-[#6c11d4] transition-colors"><Phone size={18} strokeWidth={2} /></div>
                          <input type="tel" placeholder="e.g. 0704825473" value={phone} onChange={e => setPhone(e.target.value)} required className="w-full pl-11 pr-4 py-4 bg-slate-50 border border-slate-100 focus:border-[#6c11d4]/30 focus:bg-white focus:ring-4 focus:ring-[#6c11d4]/10 rounded-xl transition-all outline-none text-slate-900 font-medium tracking-widest text-lg" />
                        </div>
                      </div>
                      
                      {error && <p className="text-red-500 text-center font-bold text-sm bg-red-50 py-2 rounded-xl border border-red-100">{error}</p>}

                      <button type="submit" disabled={loading} className="w-full bg-[#6c11d4] hover:bg-[#5b21b6] disabled:opacity-70 disabled:cursor-not-allowed text-white font-bold py-4 px-6 rounded-xl transition-all shadow-lg shadow-[#6c11d4]/20 flex items-center justify-center gap-2 group mt-4">
                        {loading ? <Loader2 size={18} className="animate-spin" /> : <><span>Send SMS Code</span><ArrowRight size={18} strokeWidth={2} className="group-hover:translate-x-1 transition-transform" /></>}
                      </button>
                    </form>
                  )}

                  {/* STEP 2: OTP VERIFICATION */}
                  {signupStep === 2 && (
                    <form onSubmit={handleVerifyOTP} className="space-y-4">
                      <div className="space-y-2 text-center">
                        <div className="w-16 h-16 bg-purple-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-purple-100">
                           <KeyRound className="w-8 h-8 text-[#6c11d4]" />
                        </div>
                        <label className="text-sm font-semibold text-slate-700">Enter Verification Code</label>
                        <p className="text-xs text-slate-500">Sent to {phone}. <span className="text-[#6c11d4] cursor-pointer hover:underline" onClick={() => setSignupStep(1)}>Wrong number?</span></p>
                        
                        <div className="relative group mt-4">
                          <input type="text" placeholder="----" value={otpCode} onChange={e => setOtpCode(e.target.value)} required className="w-full text-center py-4 bg-slate-50 border border-slate-100 focus:border-[#6c11d4]/30 focus:bg-white focus:ring-4 focus:ring-[#6c11d4]/10 rounded-xl transition-all outline-none text-slate-900 font-bold tracking-[0.5em] text-2xl" maxLength={6} />
                        </div>
                      </div>

                      {error && <p className="text-red-500 text-center font-bold text-sm bg-red-50 py-2 rounded-xl border border-red-100">{error}</p>}

                      <button type="submit" disabled={loading} className="w-full bg-[#6c11d4] hover:bg-[#5b21b6] disabled:opacity-70 disabled:cursor-not-allowed text-white font-bold py-4 px-6 rounded-xl transition-all shadow-lg shadow-[#6c11d4]/20 flex items-center justify-center gap-2 group mt-4">
                        {loading ? <Loader2 size={18} className="animate-spin" /> : <><span>Verify Phone Number</span><CheckCircle2 size={18} strokeWidth={2} /></>}
                      </button>
                    </form>
                  )}

                  {/* STEP 3: FINAL PROFILE CREATION */}
                  {signupStep === 3 && (
                    <form onSubmit={handleSignupComplete} className="space-y-4">
                      <div className="flex gap-3">
                        <div className="space-y-2 flex-1">
                          <label className="text-sm font-semibold text-slate-700 ml-1">First Name</label>
                          <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-[#6c11d4] transition-colors"><User size={18} strokeWidth={2} /></div>
                            <input type="text" placeholder="Jane" value={firstName} onChange={e => setFirstName(e.target.value)} required className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-100 focus:border-[#6c11d4]/30 focus:bg-white focus:ring-4 focus:ring-[#6c11d4]/10 rounded-xl transition-all outline-none text-slate-900 font-medium" />
                          </div>
                        </div>
                        <div className="space-y-2 flex-1">
                          <label className="text-sm font-semibold text-slate-700 ml-1">Last Name</label>
                          <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-[#6c11d4] transition-colors"><User size={18} strokeWidth={2} /></div>
                            <input type="text" placeholder="Doe" value={lastName} onChange={e => setLastName(e.target.value)} required className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-100 focus:border-[#6c11d4]/30 focus:bg-white focus:ring-4 focus:ring-[#6c11d4]/10 rounded-xl transition-all outline-none text-slate-900 font-medium" />
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-700 ml-1">Email <span className="text-slate-400 font-normal">(Optional)</span></label>
                        <div className="relative group">
                          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-[#6c11d4] transition-colors"><Mail size={18} strokeWidth={2} /></div>
                          <input type="email" placeholder="name@company.com" value={signupEmail} onChange={e => setSignupEmail(e.target.value)} className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-100 focus:border-[#6c11d4]/30 focus:bg-white focus:ring-4 focus:ring-[#6c11d4]/10 rounded-xl transition-all outline-none text-slate-900 font-medium" />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-700 ml-1">Setup Password</label>
                        <div className="relative group">
                          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-[#6c11d4] transition-colors"><Lock size={18} strokeWidth={2} /></div>
                          <input type={showSignupPassword ? "text" : "password"} placeholder="••••••••" value={signupPassword} onChange={e => setSignupPassword(e.target.value)} required className="w-full pl-11 pr-12 py-3 bg-slate-50 border border-slate-100 focus:border-[#6c11d4]/30 focus:bg-white focus:ring-4 focus:ring-[#6c11d4]/10 rounded-xl transition-all outline-none text-slate-900 font-medium tracking-wide" />
                          <button type="button" onClick={() => setShowSignupPassword(!showSignupPassword)} className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600">
                            {showSignupPassword ? <EyeOff size={18} strokeWidth={2} /> : <Eye size={18} strokeWidth={2} />}
                          </button>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-700 ml-1">Confirm Password</label>
                        <div className="relative group">
                          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-[#6c11d4] transition-colors"><Lock size={18} strokeWidth={2} /></div>
                          <input type={showConfirmPassword ? "text" : "password"} placeholder="••••••••" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required className="w-full pl-11 pr-12 py-3 bg-slate-50 border border-slate-100 focus:border-[#6c11d4]/30 focus:bg-white focus:ring-4 focus:ring-[#6c11d4]/10 rounded-xl transition-all outline-none text-slate-900 font-medium tracking-wide" />
                          <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600">
                            {showConfirmPassword ? <EyeOff size={18} strokeWidth={2} /> : <Eye size={18} strokeWidth={2} />}
                          </button>
                        </div>
                      </div>

                      {error && <p className="text-red-500 text-center font-bold text-sm bg-red-50 py-2 rounded-xl border border-red-100">{error}</p>}

                      <button type="submit" disabled={loading} className="w-full bg-[#6c11d4] hover:bg-[#5b21b6] disabled:opacity-70 disabled:cursor-not-allowed text-white font-bold py-4 px-6 rounded-xl transition-all shadow-lg shadow-[#6c11d4]/20 flex items-center justify-center gap-2 group mt-4 h-[56px] overflow-hidden">
                        {loading ? <Loader2 size={18} className="animate-spin" /> : <><span>Create Account</span><ArrowRight size={18} strokeWidth={2} className="group-hover:translate-x-1 transition-transform shrink-0" /></>}
                      </button>
                    </form>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>

      <footer className="relative z-10 w-full max-w-7xl mx-auto px-6 py-8 flex flex-col sm:flex-row justify-between items-center gap-4">
        <p className="text-xs text-slate-400 font-medium">© 2026 Welile Technologies Limited. All rights reserved.</p>
        <div className="flex gap-6">
           <a className="text-xs text-slate-400 hover:text-[#6c11d4]" href="#">Privacy Policy</a>
           <a className="text-xs text-slate-400 hover:text-[#6c11d4]" href="#">Terms of Service</a>
        </div>
      </footer>
    </div>
  );
}
