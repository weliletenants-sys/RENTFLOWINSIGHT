import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Phone, MapPin, CheckCircle2 } from 'lucide-react';
import PurpleBubbles from '../components/PurpleBubbles';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import toast from 'react-hot-toast';

export default function AgentRegisterSubAgent() {
  const navigate = useNavigate();
  const [isSuccess, setIsSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    phoneNumber: '',
    location: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await axios.post('/api/agent/users/subagent', {
        sub_agent_name: formData.fullName,
        phone: formData.phoneNumber
      });
      setIsSuccess(true);
      toast.success('Sub-agent registered successfully!');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to register sub-agent.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-[#f8f6f6] dark:bg-[#221610] min-h-screen relative font-['Public_Sans'] text-slate-900 dark:text-slate-100 antialiased overflow-hidden flex flex-col">
      
      {/* Background Bubbles (z-0) */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <PurpleBubbles />
      </div>

      <div className="relative z-10 w-full max-w-md mx-auto min-h-screen flex flex-col bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border-x border-slate-100 dark:border-slate-800 shadow-2xl">
        
        {/* Header */}
        <header className="sticky top-0 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md px-4 py-4 flex items-center justify-between border-b border-slate-100 dark:border-slate-800 z-50">
          <button 
            onClick={() => navigate(-1)} 
            className="p-2 -ml-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-600 dark:text-slate-400"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-lg font-bold">Register Sub-Agent</h1>
          <div className="w-9" />
        </header>

        <main className="flex-1 overflow-y-auto w-full flex flex-col pb-10">
          <AnimatePresence mode="wait">
            
            {!isSuccess ? (
              <motion.div 
                key="form"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.4 }}
                className="w-full flex-1 flex flex-col p-6"
              >
                
                <div className="mb-8">
                  <h2 className="text-2xl font-bold tracking-tight mb-2 text-slate-800 dark:text-white">New Sub-Agent</h2>
                  <p className="text-slate-500 dark:text-slate-400 text-sm">Fill in the details below to onboard a new sub-agent to your network.</p>
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-5 flex-1 flex flex-col">
                  
                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">Full Name</label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-[#6d28d9] transition-colors">
                        <User size={18} strokeWidth={2} />
                      </div>
                      <input 
                        name="fullName" value={formData.fullName} onChange={handleChange} 
                        placeholder="John Doe"
                        className="w-full pl-11 pr-4 py-3.5 bg-slate-50 dark:bg-slate-800/50 border border-transparent focus:border-[#6d28d9]/30 focus:bg-white dark:focus:bg-slate-800 focus:ring-4 focus:ring-[#6d28d9]/10 rounded-xl transition-all outline-none font-medium placeholder:text-slate-400" 
                        required 
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">Phone Number</label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-[#6d28d9] transition-colors">
                        <Phone size={18} strokeWidth={2} />
                      </div>
                      <input 
                        type="tel"
                        name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} 
                        placeholder="0700 000 000"
                        className="w-full pl-11 pr-4 py-3.5 bg-slate-50 dark:bg-slate-800/50 border border-transparent focus:border-[#6d28d9]/30 focus:bg-white dark:focus:bg-slate-800 focus:ring-4 focus:ring-[#6d28d9]/10 rounded-xl transition-all outline-none font-medium placeholder:text-slate-400" 
                        required 
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5 mb-8">
                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">Location</label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-[#6d28d9] transition-colors">
                        <MapPin size={18} strokeWidth={2} />
                      </div>
                      <input 
                        name="location" value={formData.location} onChange={handleChange} 
                        placeholder="Kampala, Uganda"
                        className="w-full pl-11 pr-4 py-3.5 bg-slate-50 dark:bg-slate-800/50 border border-transparent focus:border-[#6d28d9]/30 focus:bg-white dark:focus:bg-slate-800 focus:ring-4 focus:ring-[#6d28d9]/10 rounded-xl transition-all outline-none font-medium placeholder:text-slate-400" 
                        required 
                      />
                    </div>
                  </div>

                  <div className="mt-auto pt-8">
                    <button 
                      type="submit" 
                      disabled={isSubmitting}
                      className="w-full bg-[#6d28d9] hover:bg-[#5b21b6] text-white font-bold py-4 px-6 rounded-xl shadow-lg shadow-[#6d28d9]/25 transition-all transform active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {isSubmitting ? (
                        <div className="size-5 border-2 border-white/30 border-t-white rounded-full animate-spin"/>
                      ) : (
                        'Register Sub-Agent'
                      )}
                    </button>
                  </div>
                
                </form>

              </motion.div>
            ) : (
              <motion.div 
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
                className="flex-1 flex flex-col items-center justify-center p-8 text-center"
              >
                <div className="size-20 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-500 rounded-full flex items-center justify-center mb-6 shadow-xl shadow-emerald-500/20">
                  <CheckCircle2 size={40} strokeWidth={2.5} />
                </div>
                
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">Registration Successful!</h2>
                
                <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-[300px] leading-relaxed">
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{formData.fullName}</span> has been successfully registered as a sub-agent.
                </p>

                <div className="w-full bg-orange-50 dark:bg-orange-900/10 border border-orange-200 dark:border-orange-800/30 rounded-2xl p-5 mb-8">
                  <p className="text-sm text-orange-800 dark:text-orange-400 font-medium mb-3">Default One-Time Password:</p>
                  <div className="bg-white dark:bg-slate-800 text-center py-3 rounded-xl border border-orange-100 dark:border-orange-900/20">
                    <span className="text-xl font-mono font-bold tracking-widest text-[#6d28d9]">WELILE123</span>
                  </div>
                  <p className="text-[11px] text-orange-600 dark:text-orange-500/70 mt-3 font-medium">Please share this password with the sub-agent. They will be prompted to change it upon their first login.</p>
                </div>

                <button 
                  onClick={() => navigate('/dashboard')}
                  className="w-full bg-[#6d28d9]/10 hover:bg-[#6d28d9]/20 text-[#6d28d9] font-bold py-4 px-6 rounded-xl transition-colors"
                >
                  Back to Dashboard
                </button>
              </motion.div>
            )}

          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
