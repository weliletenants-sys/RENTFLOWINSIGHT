import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Check, User, Mail, Phone, Shield } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { toast, Toaster } from 'react-hot-toast';

export default function TenantEditProfile() {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [formData, setFormData] = useState({
    firstName: user?.firstName || 'Alex',
    lastName: user?.lastName || 'Johnson',
    email: user?.email || 'alex.johnson@example.com',
    phone: user?.phone || '+256 772 123456',
  });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [avatarUrl, setAvatarUrl] = useState(`url("https://lh3.googleusercontent.com/aida-public/AB6AXuD1Xe7qGPblaN_lNwa-0FHT-W5VCviDsz17FoZPP3vffhFAXcpuV6kc9c8hitxw1J7lz6uPKNRdq0pSYgdtXTimxOax3YOz03jrtrW-BkXbG7RDuJ-ry-URQkiI8pYYcVmi_gxbyYkWayzwbhQ6UqAdFFOEtxnHr60t9VKnv3CmUbDYbPgR-Hal1gh7PoFk0dUdwTHbvxPA5trO5Ksx6sQU1RjBeHiqWoHgrAZPP3wmS9t4ytfu-ieUUWkOVn5Ze91L8GO9AqKBag8")`);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const imageUrl = URL.createObjectURL(file);
      setAvatarUrl(`url("${imageUrl}")`);
      toast.success('Profile picture sequence staged');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Profile updated successfully');
    setTimeout(() => navigate(-1), 1500);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 font-sans text-slate-900 dark:text-slate-100 pb-20 selection:bg-purple-100 transition-colors duration-300">
      <Toaster position="top-center" />
      
      {/* Header */}
      <div className="w-full bg-[#8b5cf6] dark:bg-[#6b45c2] pt-6 pb-24 px-6 md:px-12 relative rounded-b-[2.5rem] shadow-xl shadow-purple-600/20 dark:shadow-none overflow-hidden transition-colors duration-300">
         <div className="absolute -top-10 -right-10 p-8 opacity-10">
            <User size={220} />
         </div>

         <div className="flex items-center gap-6 relative z-10">
            <button 
              onClick={() => navigate(-1)} 
              className="text-white hover:bg-white/10 p-2 rounded-full transition-colors flex items-center justify-center cursor-pointer"
            >
               <ArrowLeft size={24} />
            </button>
            <h1 className="text-xl font-bold text-white tracking-wide">Edit Profile</h1>
         </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-2xl mx-auto px-4 md:px-8 -mt-14 relative z-10 flex flex-col gap-5">
         
         <div className="w-full bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-sm border border-slate-100 dark:border-slate-700 transition-colors duration-300">
            
            {/* Avatar Section */}
            <div className="flex justify-center mb-8 relative">
               <input 
                  type="file" 
                  accept="image/*" 
                  className="hidden" 
                  ref={fileInputRef} 
                  onChange={handleFileChange} 
               />
               <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                  <div 
                     className="size-28 rounded-full bg-cover bg-center border-4 border-white dark:border-slate-700 shadow-lg overflow-hidden bg-slate-200 dark:bg-slate-600 transition-all" 
                     style={{ backgroundImage: avatarUrl }}
                  >
                     <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <span className="text-white text-xs font-bold tracking-widest uppercase">Change</span>
                     </div>
                  </div>
               </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSave} className="space-y-5">
               <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                     <label className="text-[12px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest pl-1 transition-colors">First Name</label>
                     <input 
                        name="firstName" 
                        value={formData.firstName} 
                        onChange={handleChange} 
                        className="w-full px-4 py-3.5 bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-xl outline-none focus:ring-2 focus:ring-purple-500/50 dark:focus:ring-purple-400/50 transition-all font-semibold text-[15px] text-slate-800 dark:text-white" 
                        required 
                     />
                  </div>
                  <div className="space-y-1.5">
                     <label className="text-[12px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest pl-1 transition-colors">Last Name</label>
                     <input 
                        name="lastName" 
                        value={formData.lastName} 
                        onChange={handleChange} 
                        className="w-full px-4 py-3.5 bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-xl outline-none focus:ring-2 focus:ring-purple-500/50 dark:focus:ring-purple-400/50 transition-all font-semibold text-[15px] text-slate-800 dark:text-white" 
                        required 
                     />
                  </div>
               </div>

               <div className="space-y-1.5">
                  <label className="text-[12px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest pl-1 transition-colors">Email Address</label>
                  <div className="relative">
                     <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-slate-400 dark:text-slate-500 transition-colors">
                        <Mail size={18} />
                     </div>
                     <input 
                        type="email" 
                        name="email" 
                        value={formData.email} 
                        onChange={handleChange} 
                        className="w-full pl-11 pr-11 py-3.5 bg-slate-50 dark:bg-slate-700/30 border border-slate-100 dark:border-slate-600/50 rounded-xl outline-none transition-all font-semibold text-[15px] text-slate-500 dark:text-slate-400 cursor-not-allowed" 
                        disabled 
                     />
                     <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-slate-300 dark:text-slate-500 transition-colors">
                        <Shield size={16} />
                     </div>
                  </div>
                  <p className="text-[11px] text-slate-400 dark:text-slate-500 font-semibold pl-1 transition-colors">Verified email cannot be changed directly.</p>
               </div>

               <div className="space-y-1.5">
                  <label className="text-[12px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest pl-1 transition-colors">Phone Number</label>
                  <div className="relative">
                     <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-slate-400 dark:text-slate-500 transition-colors">
                        <Phone size={18} />
                     </div>
                     <input 
                        type="tel" 
                        name="phone" 
                        value={formData.phone} 
                        onChange={handleChange} 
                        className="w-full pl-11 pr-4 py-3.5 bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-xl outline-none focus:ring-2 focus:ring-purple-500/50 dark:focus:ring-purple-400/50 transition-all font-semibold text-[15px] text-slate-800 dark:text-white" 
                     />
                  </div>
               </div>

               <button type="submit" className="w-full flex items-center justify-center gap-2 bg-[#8b5cf6] dark:bg-[#6b45c2] hover:bg-purple-600 dark:hover:bg-[#5a2e9d] text-white py-4 rounded-xl font-bold shadow-lg shadow-purple-500/25 dark:shadow-none transition-all active:translate-y-0.5 mt-8 cursor-pointer text-[15px]">
                  <Check strokeWidth={3} size={18} /> Save Changes
               </button>
            </form>

         </div>
      </div>
    </div>
  );
}
