import { ArrowLeft, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useState } from 'react';
import { toast, Toaster } from 'react-hot-toast';

export default function AgentEditProfile() {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: user?.phone || '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Profile updated successfully');
    setTimeout(() => navigate(-1), 1500);
  };

  return (
    <div className="bg-[#f8f6f6] dark:bg-[#221610] min-h-screen text-slate-900 dark:text-slate-100 font-['Public_Sans'] pb-10">
      <Toaster position="top-center" />
      <div className="max-w-md mx-auto bg-white dark:bg-slate-900 min-h-screen shadow-sm border-x border-slate-100 dark:border-slate-800">
        
        {/* Header */}
        <header className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-100 dark:border-slate-800 px-4 py-4 flex items-center justify-between">
          <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-lg font-bold">Edit Profile</h1>
          <div className="w-9" /> {/* Spacer */}
        </header>

        {/* Content */}
        <div className="p-6">
          <div className="flex justify-center mb-8">
            <div className="relative group cursor-pointer">
              <div 
                className="size-28 rounded-full bg-cover bg-center border-4 border-white dark:border-slate-800 shadow-lg" 
                style={{ backgroundImage: `url("https://lh3.googleusercontent.com/aida-public/AB6AXuB-6CEKUUwXceHTgHa8xkFgaTQj9GwZgYWe0cRKqkDqCCAeHzxA3v3Gr2OQOriVVLuGf37bi_fw5LucnOXTIfA05OMl7XFum7dVqOZjYfWCczapw9jB-Y9DYtEk9szasrM8XvHddv6LhgOl0C_KhDnn28n6f_dpB7KE5mezNp9-pjtyqq0GcgwCrEDjz2Bo48dZxGu9PTqMLsPUf71sDxdVu_l1p3_oX7aUm3po_Ih4WCHAHICKi11hC-_9SHHDRUKM4KHPJkV2BuU")` }}
              >
                <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                   <span className="text-white text-xs font-bold">Change</span>
                </div>
              </div>
            </div>
          </div>

          <form onSubmit={handleSave} className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">First Name</label>
              <input 
                name="firstName" value={formData.firstName} onChange={handleChange} 
                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-[#6d28d9]/50 transition-all font-medium" 
                required 
              />
            </div>
            
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Last Name</label>
              <input 
                name="lastName" value={formData.lastName} onChange={handleChange} 
                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-[#6d28d9]/50 transition-all font-medium" 
                required 
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Email Address</label>
              <input 
                type="email" name="email" value={formData.email} onChange={handleChange} 
                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-[#6d28d9]/50 transition-all font-medium text-slate-500" 
                disabled 
              />
              <p className="text-[10px] text-slate-400 font-medium">Email address cannot be changed.</p>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Phone Number</label>
              <input 
                type="tel" name="phone" value={formData.phone} onChange={handleChange} 
                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-[#6d28d9]/50 transition-all font-medium" 
              />
            </div>

            <button type="submit" className="w-full mt-8 flex items-center justify-center gap-2 bg-[#6d28d9] hover:bg-[#5b21b6] text-white py-4 rounded-xl font-bold shadow-lg shadow-[#6d28d9]/25 transition-all active:scale-[0.98]">
              <Check size={20} />
              Save Changes
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
