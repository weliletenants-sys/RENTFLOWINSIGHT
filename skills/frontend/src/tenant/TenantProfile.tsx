import { ArrowLeft, MoreVertical, Edit2, User as UserIcon, Bell, Shield, FileText, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function TenantProfile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="bg-background-light dark:bg-background-dark font-sans text-slate-900 dark:text-slate-100 min-h-screen flex flex-col">
      <div className="relative flex h-auto min-h-screen w-full max-w-md mx-auto flex-col bg-white dark:bg-background-dark overflow-x-hidden shadow-xl">
        {/* Top Header */}
        <header className="flex items-center bg-white dark:bg-slate-900 p-4 border-b border-slate-100 dark:border-slate-800 sticky top-0 z-10">
          <div className="flex-1">
            <button 
              onClick={() => navigate(-1)}
              className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
            >
              <ArrowLeft size={24} className="text-slate-900 dark:text-slate-100" />
            </button>
          </div>
          <h1 className="text-lg font-bold flex-1 text-center">Profile</h1>
          <div className="flex-1 flex justify-end">
            <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
              <MoreVertical size={24} className="text-slate-900 dark:text-slate-100" />
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto pb-24">
          {/* Profile Header Section */}
          <div className="flex flex-col items-center pt-8 pb-6 px-4">
            <div className="relative group">
              <div className="size-32 rounded-full border-4 border-white dark:border-slate-800 shadow-lg overflow-hidden bg-slate-200 dark:bg-slate-700">
                <img 
                  alt="Profile picture" 
                  className="w-full h-full object-cover" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuD1Xe7qGPblaN_lNwa-0FHT-W5VCviDsz17FoZPP3vffhFAXcpuV6kc9c8hitxw1J7lz6uPKNRdq0pSYgdtXTimxOax3YOz03jrtrW-BkXbG7RDuJ-ry-URQkiI8pYYcVmi_gxbyYkWayzwbhQ6UqAdFFOEtxnHr60t9VKnv3CmUbDYbPgR-Hal1gh7PoFk0dUdwTHbvxPA5trO5Ksx6sQU1RjBeHiqWoHgrAZPP3wmS9t4ytfu-ieUUWkOVn5Ze91L8GO9AqKBag8"
                />
              </div>
              <button className="absolute bottom-1 right-1 bg-primary text-white p-2 rounded-full shadow-md hover:scale-105 transition-transform flex items-center justify-center">
                <Edit2 size={16} />
              </button>
            </div>
            <div className="mt-4 text-center">
              <h2 className="text-2xl font-bold tracking-tight">
                {user?.firstName && user?.lastName ? `${user.firstName} ${user.lastName}` : 'Alex Johnson'}
              </h2>
              <p className="text-slate-500 dark:text-slate-400 font-medium mt-1">{user?.phone || '+1 (555) 000-1234'}</p>
              <p className="text-slate-500 dark:text-slate-400">{user?.email || 'alex.johnson@example.com'}</p>
            </div>
          </div>

          {/* Settings List */}
          <div className="px-4 mt-4 space-y-2">
            <div className="bg-white dark:bg-slate-900 rounded-xl overflow-hidden shadow-sm border border-slate-100 dark:border-slate-800">
              <button className="w-full flex items-center gap-4 px-4 py-4 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors group">
                <div className="size-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                  <UserIcon size={24} />
                </div>
                <span className="flex-1 text-left font-medium">Edit Profile</span>
                <ArrowLeft size={24} className="text-slate-400 rotate-180" />
              </button>
              
              <div className="h-px bg-slate-100 dark:bg-slate-800 mx-4"></div>
              
              <button className="w-full flex items-center gap-4 px-4 py-4 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors group">
                <div className="size-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                  <Bell size={24} />
                </div>
                <span className="flex-1 text-left font-medium">Notification Settings</span>
                <ArrowLeft size={24} className="text-slate-400 rotate-180" />
              </button>
              
              <div className="h-px bg-slate-100 dark:bg-slate-800 mx-4"></div>
              
              <button className="w-full flex items-center gap-4 px-4 py-4 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors group">
                <div className="size-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                  <Shield size={24} />
                </div>
                <span className="flex-1 text-left font-medium">Security</span>
                <ArrowLeft size={24} className="text-slate-400 rotate-180" />
              </button>
              
              <div className="h-px bg-slate-100 dark:bg-slate-800 mx-4"></div>
              
              <button className="w-full flex items-center gap-4 px-4 py-4 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors group">
                <div className="size-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                  <FileText size={24} />
                </div>
                <span className="flex-1 text-left font-medium">Privacy Policy</span>
                <ArrowLeft size={24} className="text-slate-400 rotate-180" />
              </button>
            </div>
          </div>

          {/* Logout Button */}
          <div className="px-4 mt-8 pb-8">
            <button 
              onClick={() => {
                logout();
                navigate('/');
              }}
              className="w-full py-4 rounded-xl border-2 border-primary/20 text-primary font-bold flex items-center justify-center gap-2 hover:bg-primary/5 transition-colors"
            >
              <LogOut size={24} />
              Logout
            </button>
          </div>
        </main>
        
      </div>
    </div>
  );
}
