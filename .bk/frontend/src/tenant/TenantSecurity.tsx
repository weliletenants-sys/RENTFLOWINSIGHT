import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Check, Lock, ShieldCheck, KeyRound, EyeOff, Eye } from 'lucide-react';
import { toast, Toaster } from 'react-hot-toast';

export default function TenantSecurity() {
  const navigate = useNavigate();
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [twoFactor, setTwoFactor] = useState(false);
  
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.newPassword !== formData.confirmPassword) {
      toast.error('New passwords do not match!');
      return;
    }
    toast.success('Security settings updated securely');
    setTimeout(() => navigate(-1), 1500);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 font-sans text-slate-900 dark:text-slate-100 pb-20 selection:bg-purple-100 transition-colors duration-300">
      <Toaster position="top-center" />
      
      {/* Header */}
      <div className="w-full bg-[#8b5cf6] dark:bg-[#6b45c2] pt-6 pb-24 px-6 md:px-12 relative rounded-b-[2.5rem] shadow-xl shadow-purple-600/20 dark:shadow-none overflow-hidden transition-colors duration-300">
         <div className="absolute -top-10 -right-10 p-8 opacity-10">
            <Lock size={220} />
         </div>

         <div className="flex items-center gap-6 relative z-10">
            <button 
              onClick={() => navigate(-1)} 
              className="text-white hover:bg-white/10 p-2 rounded-full transition-colors flex items-center justify-center cursor-pointer"
            >
               <ArrowLeft size={24} />
            </button>
            <h1 className="text-xl font-bold text-white tracking-wide">Security Checkpoint</h1>
         </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-2xl mx-auto px-4 md:px-8 -mt-14 relative z-10 flex flex-col gap-5">
         
         {/* 2FA Toggle Card */}
         <div className="w-full bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-sm border border-slate-100 dark:border-slate-700 flex items-center justify-between transition-colors duration-300">
            <div className="flex items-center gap-4">
               <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${twoFactor ? 'bg-emerald-50 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400' : 'bg-slate-50 dark:bg-slate-700/50 text-slate-400 dark:text-slate-500'}`}>
                  <ShieldCheck size={24} />
               </div>
               <div>
                  <p className="text-[15px] font-bold text-slate-800 dark:text-white transition-colors">Two-Factor Auth</p>
                  <p className="text-[12px] text-slate-500 dark:text-slate-400 font-semibold transition-colors">Require SMS code on login</p>
               </div>
            </div>
            <button 
               onClick={() => setTwoFactor(!twoFactor)} 
               className={`w-14 h-7 rounded-full p-1 transition-colors duration-200 ease-in-out cursor-pointer ${twoFactor ? 'bg-emerald-500 dark:bg-emerald-600' : 'bg-slate-200 dark:bg-slate-600'}`}
            >
               <div className={`w-5 h-5 rounded-full bg-white shadow-sm transform transition-transform duration-200 ease-in-out ${twoFactor ? 'translate-x-7' : 'translate-x-0'}`} />
            </button>
         </div>

         {/* Password Reset Form */}
         <div className="w-full bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-sm border border-slate-100 dark:border-slate-700 transition-colors duration-300">
            <div className="flex items-center gap-3 mb-6 border-b border-slate-50 dark:border-slate-700/50 pb-4 transition-colors">
               <div className="bg-rose-50 dark:bg-rose-500/20 text-rose-500 dark:text-rose-400 p-2 rounded-xl transition-colors">
                 <KeyRound size={20} />
               </div>
               <h2 className="text-[16px] font-bold text-slate-800 dark:text-white transition-colors">Change Password</h2>
            </div>
            
            <form onSubmit={handleSave} className="space-y-5">
               
               <div className="space-y-1.5">
                  <label className="text-[12px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest pl-1 transition-colors">Current Password</label>
                  <div className="relative">
                     <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-slate-400 dark:text-slate-500 transition-colors">
                        <Lock size={18} />
                     </div>
                     <input 
                        type={showCurrent ? "text" : "password"} 
                        name="currentPassword" 
                        value={formData.currentPassword} 
                        onChange={handleChange} 
                        className="w-full pl-11 pr-12 py-3.5 bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-xl outline-none focus:ring-2 focus:ring-purple-500/50 dark:focus:ring-purple-400/50 transition-all font-semibold text-[15px] text-slate-800 dark:text-white tracking-wider" 
                        required 
                     />
                     <button type="button" onClick={() => setShowCurrent(!showCurrent)} className="absolute inset-y-0 right-4 flex items-center text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 cursor-pointer transition-colors">
                        {showCurrent ? <Eye size={18}/> : <EyeOff size={18} />}
                     </button>
                  </div>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                     <label className="text-[12px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest pl-1 transition-colors">New Password</label>
                     <div className="relative">
                        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-slate-400 dark:text-slate-500 transition-colors">
                           <Lock size={18} />
                        </div>
                        <input 
                           type={showNew ? "text" : "password"} 
                           name="newPassword" 
                           value={formData.newPassword} 
                           onChange={handleChange} 
                           className="w-full pl-11 pr-12 py-3.5 bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-xl outline-none focus:ring-2 focus:ring-purple-500/50 dark:focus:ring-purple-400/50 transition-all font-semibold text-[15px] text-slate-800 dark:text-white tracking-wider" 
                           required 
                           minLength={8}
                        />
                        <button type="button" onClick={() => setShowNew(!showNew)} className="absolute inset-y-0 right-4 flex items-center text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 cursor-pointer transition-colors">
                           {showNew ? <Eye size={18}/> : <EyeOff size={18} />}
                        </button>
                     </div>
                  </div>

                  <div className="space-y-1.5">
                     <label className="text-[12px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest pl-1 transition-colors">Confirm New</label>
                     <div className="relative">
                        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-slate-400 dark:text-slate-500 transition-colors">
                           <Check size={18} />
                        </div>
                        <input 
                           type={showNew ? "text" : "password"} 
                           name="confirmPassword" 
                           value={formData.confirmPassword} 
                           onChange={handleChange} 
                           className="w-full pl-11 pr-4 py-3.5 bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-xl outline-none focus:ring-2 focus:ring-purple-500/50 dark:focus:ring-purple-400/50 transition-all font-semibold text-[15px] text-slate-800 dark:text-white tracking-wider" 
                           required 
                        />
                     </div>
                  </div>
               </div>

               <p className="text-[11px] text-slate-400 dark:text-slate-500 font-semibold pl-1 transition-colors">Password must be at least 8 characters long.</p>

               <button type="submit" className="w-full flex items-center justify-center gap-2 bg-[#8b5cf6] dark:bg-[#6b45c2] hover:bg-purple-600 dark:hover:bg-[#5a2e9d] text-white py-4 rounded-xl font-bold shadow-lg shadow-purple-500/25 dark:shadow-none transition-all active:translate-y-0.5 mt-2 cursor-pointer text-[15px]">
                  <Check strokeWidth={3} size={18} /> Update Security Settings
               </button>
            </form>

         </div>
      </div>
    </div>
  );
}
