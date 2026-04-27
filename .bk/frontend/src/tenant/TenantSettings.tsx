import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Settings as SettingsIcon, User, Lock, Bell, Moon, LogOut, ChevronRight } from 'lucide-react';

export default function TenantSettings() {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState(true);
  
  const [darkMode, setDarkMode] = useState(() => document.documentElement.classList.contains('dark'));

  const toggleDarkMode = () => {
    if (darkMode) {
      document.documentElement.classList.remove('dark');
      setDarkMode(false);
    } else {
      document.documentElement.classList.add('dark');
      setDarkMode(true);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 font-sans text-slate-900 dark:text-slate-100 pb-20 selection:bg-purple-100 transition-colors duration-300">
      
      {/* Header */}
      <div className="w-full bg-[#8b5cf6] dark:bg-[#6b45c2] pt-6 pb-20 px-6 md:px-12 relative rounded-b-[2.5rem] shadow-xl shadow-purple-600/20 dark:shadow-none overflow-hidden transition-colors duration-300">
         <div className="absolute -top-10 -right-10 p-8 opacity-10">
            <SettingsIcon size={220} />
         </div>

         <div className="flex items-center gap-6 relative z-10">
            <button 
              onClick={() => navigate(-1)} 
              className="text-white hover:bg-white/10 p-2 rounded-full transition-colors flex items-center justify-center cursor-pointer"
            >
               <ArrowLeft size={24} />
            </button>
            <h1 className="text-xl font-bold text-white tracking-wide">Settings</h1>
         </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-2xl mx-auto px-4 md:px-8 -mt-10 relative z-10 flex flex-col gap-5">
         
         <div className="w-full bg-white dark:bg-slate-800 rounded-3xl p-2 shadow-sm border border-slate-100 dark:border-slate-700/60 overflow-hidden transition-colors duration-300">
            
            {/* Profile */}
            <div onClick={() => navigate('/settings/profile')} className="p-4 flex items-center justify-between border-b border-slate-50 dark:border-slate-700/50 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
               <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-indigo-50 dark:bg-indigo-500/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400 transition-colors duration-300">
                     <User size={18} />
                  </div>
                  <div>
                     <p className="text-[14px] font-bold text-slate-800 dark:text-white">Profile Information</p>
                     <p className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold">Update your name & contact</p>
                  </div>
               </div>
               <ChevronRight size={18} className="text-slate-400 dark:text-slate-500" />
            </div>

            {/* Security */}
            <div onClick={() => navigate('/settings/security')} className="p-4 flex items-center justify-between border-b border-slate-50 dark:border-slate-700/50 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
               <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-rose-50 dark:bg-rose-500/20 flex items-center justify-center text-rose-600 dark:text-rose-400 transition-colors duration-300">
                     <Lock size={18} />
                  </div>
                  <div>
                     <p className="text-[14px] font-bold text-slate-800 dark:text-white">Security & Password</p>
                     <p className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold">Manage your account security</p>
                  </div>
               </div>
               <ChevronRight size={18} className="text-slate-400 dark:text-slate-500" />
            </div>

            {/* Notifications Toggle */}
            <div className="p-4 flex items-center justify-between border-b border-slate-50 dark:border-slate-700/50">
               <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-amber-50 dark:bg-amber-500/20 flex items-center justify-center text-amber-600 dark:text-amber-400 transition-colors duration-300">
                     <Bell size={18} />
                  </div>
                  <div>
                     <p className="text-[14px] font-bold text-slate-800 dark:text-white">Notifications</p>
                     <p className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold">Push and SMS alerts</p>
                  </div>
               </div>
               <button 
                  onClick={() => setNotifications(!notifications)} 
                  className={`w-12 h-6 rounded-full p-1 transition-colors duration-200 ease-in-out cursor-pointer ${notifications ? 'bg-emerald-500 dark:bg-emerald-600' : 'bg-slate-200 dark:bg-slate-600'}`}
               >
                  <div className={`w-4 h-4 rounded-full bg-white shadow-sm transform transition-transform duration-200 ease-in-out ${notifications ? 'translate-x-6' : 'translate-x-0'}`} />
               </button>
            </div>

            {/* Dark Mode Toggle */}
            <div className="p-4 flex items-center justify-between border-b border-slate-50 dark:border-slate-700/50">
               <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 transition-colors duration-300">
                     <Moon size={18} />
                  </div>
                  <div>
                     <p className="text-[14px] font-bold text-slate-800 dark:text-white">Dark Mode</p>
                     <p className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold">Switch app theme</p>
                  </div>
               </div>
               <button 
                  onClick={toggleDarkMode} 
                  className={`w-12 h-6 rounded-full p-1 transition-colors duration-200 ease-in-out cursor-pointer ${darkMode ? 'bg-indigo-500 dark:bg-[#8b5cf6]' : 'bg-slate-200 dark:bg-slate-600'}`}
               >
                  <div className={`w-4 h-4 rounded-full bg-white shadow-sm transform transition-transform duration-200 ease-in-out ${darkMode ? 'translate-x-6' : 'translate-x-0'}`} />
               </button>
            </div>

            {/* Logout */}
            <div onClick={() => navigate('/')} className="p-4 flex items-center justify-between cursor-pointer hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors rounded-b-2xl group">
               <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-slate-50 dark:bg-slate-700 flex items-center justify-center text-slate-400 dark:text-slate-500 group-hover:bg-rose-100 dark:group-hover:bg-rose-500/20 group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors duration-300">
                     <LogOut size={18} />
                  </div>
                  <div>
                     <p className="text-[14px] font-bold text-slate-800 dark:text-white group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors">Log Out</p>
                  </div>
               </div>
               <ChevronRight size={18} className="text-slate-400 dark:text-slate-500 group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors" />
            </div>

         </div>
         
         <p className="text-center text-[11px] font-bold text-slate-400 dark:text-slate-500 mt-4 tracking-widest uppercase transition-colors duration-300">RentFlow v2.4.1</p>

      </div>
    </div>
  );
}
