import { BarChart2, LayoutDashboard, Target, User } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

export default function BottomNavigation() {
  const location = useLocation();
  const navigate = useNavigate();
  const { role } = useAuth();
  
  // Base dashboard route based on role
  const dashboardPath = role ? `/dashboard/${role.toLowerCase()}` : '/dashboard';

  return (
    <nav className="absolute inset-x-0 bottom-0 h-[88px] bg-[#F8F9FA] border-t border-gray-200 flex justify-around items-center text-gray-400 z-20 sm:rounded-b-[24px] pb-4 sm:pb-0 px-2 shadow-[0_-10px_40px_-20px_rgba(0,0,0,0.05)]">
      
      <button 
        onClick={() => navigate(dashboardPath)}
        className={`flex flex-col items-center gap-1 transition-all px-4 w-16 relative \${location.pathname === dashboardPath ? 'text-[#512DA8] scale-105' : 'hover:text-gray-600'}`}
      >
        <div className={`p-1.5 rounded-xl transition-colors \${location.pathname === dashboardPath ? 'bg-purple-100' : 'bg-transparent'}`}>
           <LayoutDashboard size={24} strokeWidth={location.pathname === dashboardPath ? 2.5 : 2} />
        </div>
        <span className={`text-[10px] font-bold \${location.pathname === dashboardPath ? 'opacity-100' : 'opacity-0'}`}>Home</span>
      </button>

      <button className="flex flex-col items-center gap-1 hover:text-gray-600 transition-all px-4 w-16">
        <div className="p-1.5 rounded-xl bg-transparent">
          <BarChart2 size={24} strokeWidth={2} />
        </div>
        <span className="text-[10px] font-bold opacity-0">Activity</span>
      </button>
      
      <button className="flex flex-col items-center gap-1 hover:text-gray-600 transition-all px-4 w-16">
        <div className="p-1.5 rounded-xl bg-transparent">
          <Target size={24} strokeWidth={2} />
        </div>
        <span className="text-[10px] font-bold opacity-0">Goals</span>
      </button>
      
      <button className="flex flex-col items-center gap-1 hover:text-gray-600 transition-all px-4 w-16">
         <div className="p-1.5 rounded-xl bg-transparent">
          <User size={24} strokeWidth={2} />
        </div>
        <span className="text-[10px] font-bold opacity-0">Profile</span>
      </button>

    </nav>
  );
}
