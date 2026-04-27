import { ArrowLeft, MoreVertical, Edit2, Verified, User as UserIcon, Bell, Shield, FileText, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function AgentSettings() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="bg-background-light dark:bg-background-dark font-sans text-slate-900 dark:text-slate-100 min-h-screen">
      <div className="max-w-md mx-auto bg-white dark:bg-background-dark min-h-screen flex flex-col shadow-xl">
        
        {/* Top Header */}
        <div className="flex items-center bg-white dark:bg-slate-900 p-4 sticky top-0 z-10 border-b border-primary/10">
          <div className="w-12">
            <button 
              onClick={() => navigate(-1)}
              className="flex items-center justify-center size-10 rounded-full hover:bg-primary/5 text-slate-900 dark:text-slate-100"
            >
              <ArrowLeft size={24} />
            </button>
          </div>
          <h2 className="text-lg font-bold flex-1 text-center">Settings</h2>
          <div className="w-12 flex justify-end">
            <button className="flex items-center justify-center size-10 rounded-full hover:bg-primary/5 text-slate-900 dark:text-slate-100">
              <MoreVertical size={24} />
            </button>
          </div>
        </div>

        {/* Profile Section */}
        <div className="flex flex-col items-center pt-8 pb-6 px-4">
          <div className="relative mb-4">
            <div className="bg-primary/10 rounded-full p-1 border-2 border-primary/20">
              <div 
                className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-32 shadow-lg" 
                style={{ backgroundImage: `url("https://lh3.googleusercontent.com/aida-public/AB6AXuB-6CEKUUwXceHTgHa8xkFgaTQj9GwZgYWe0cRKqkDqCCAeHzxA3v3Gr2OQOriVVLuGf37bi_fw5LucnOXTIfA05OMl7XFum7dVqOZjYfWCczapw9jB-Y9DYtEk9szasrM8XvHddv6LhgOl0C_KhDnn28n6f_dpB7KE5mezNp9-pjtyqq0GcgwCrEDjz2Bo48dZxGu9PTqMLsPUf71sDxdVu_l1p3_oX7aUm3po_Ih4WCHAHICKi11hC-_9SHHDRUKM4KHPJkV2BuU")` }}
              />
            </div>
            <button className="absolute bottom-1 right-1 bg-primary text-white rounded-full size-10 flex items-center justify-center border-4 border-white dark:border-background-dark shadow-md hover:scale-105 transition-transform">
              <Edit2 size={16} />
            </button>
          </div>
          <div className="text-center mb-4">
            <h1 className="text-2xl font-bold tracking-tight">
              {user?.firstName && user?.lastName ? `${user.firstName} ${user.lastName}` : 'Alex Johnson'}
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">{user?.phone || '+256 700 000 000'} • {user?.email || 'alex.j@example.com'}</p>
          </div>
          
          {/* Level Badge */}
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full border border-primary/20">
            <Verified size={20} />
            <span className="text-sm font-semibold uppercase tracking-wider">Silver Agent</span>
          </div>
        </div>

        {/* Settings List */}
        <div className="flex-1 px-4 py-4 space-y-1">
          <button onClick={() => navigate('/agent-edit-profile')} className="w-full flex items-center gap-4 p-4 rounded-xl hover:bg-primary/5 transition-colors group">
            <div className="size-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
              <UserIcon size={20} />
            </div>
            <span className="flex-1 text-left font-medium">Edit Profile</span>
            <ArrowLeft size={20} className="text-slate-400 rotate-180" />
          </button>
          
          <button onClick={() => navigate('/agent-notification-settings')} className="w-full flex items-center gap-4 p-4 rounded-xl hover:bg-primary/5 transition-colors group">
            <div className="size-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
              <Bell size={20} />
            </div>
            <span className="flex-1 text-left font-medium">Notification Settings</span>
            <ArrowLeft size={20} className="text-slate-400 rotate-180" />
          </button>
          
          <button onClick={() => navigate('/agent-security')} className="w-full flex items-center gap-4 p-4 rounded-xl hover:bg-primary/5 transition-colors group">
            <div className="size-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
              <Shield size={20} />
            </div>
            <span className="flex-1 text-left font-medium">Security</span>
            <ArrowLeft size={20} className="text-slate-400 rotate-180" />
          </button>
          
          <button onClick={() => navigate('/agent-privacy-policy')} className="w-full flex items-center gap-4 p-4 rounded-xl hover:bg-primary/5 transition-colors group">
            <div className="size-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
              <FileText size={20} />
            </div>
            <span className="flex-1 text-left font-medium">Privacy Policy</span>
            <ArrowLeft size={20} className="text-slate-400 rotate-180" />
          </button>
          
          <div className="pt-4 mt-4 border-t border-primary/5">
            <button 
              onClick={() => {
                logout();
                navigate('/');
              }}
              className="w-full flex items-center gap-4 p-4 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors group text-red-500"
            >
              <div className="size-10 rounded-lg bg-red-100 dark:bg-red-900/20 flex items-center justify-center group-hover:bg-red-500 group-hover:text-white transition-colors">
                <LogOut size={20} />
              </div>
              <span className="flex-1 text-left font-semibold">Logout</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
