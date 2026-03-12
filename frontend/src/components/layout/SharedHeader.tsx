import { Bell, Repeat, Settings, User } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

interface SharedHeaderProps {
  title?: string;
}

export default function SharedHeader({ title = "Dashboard" }: SharedHeaderProps) {
  const { user, switchRoleMode, role } = useAuth();
  const navigate = useNavigate();

  const handleRoleSwitch = () => {
    switchRoleMode(null);
    navigate('/');
  };

  return (
    <div className="flex flex-col mb-4">
      {/* Top action bar */}
      <div className="flex justify-between items-center mb-4">
        <button 
          onClick={handleRoleSwitch}
          className="px-3 py-1.5 bg-[#512DA8]/10 text-[#512DA8] hover:bg-[#512DA8]/20 rounded-xl transition flex items-center gap-2 text-xs font-bold"
        >
          <Repeat size={14} strokeWidth={2.5}/>
          Switch Role
        </button>
        <div className="flex items-center gap-3">
          <button className="p-2 bg-gray-50 text-gray-500 hover:bg-gray-100 rounded-full relative transition">
            <Bell size={20} />
            <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
          </button>
          <button className="p-2 bg-gray-50 text-gray-500 hover:bg-gray-100 rounded-full transition">
            <Settings size={20} />
          </button>
        </div>
      </div>

      {/* Greeting and Avatar */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">{title}</h1>
          <p className="text-sm text-gray-500 font-medium flex gap-2 items-center">
            Hi, {user?.firstName}!
            <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider">
              {role} View
            </span>
          </p>
        </div>
        <div className="h-12 w-12 bg-purple-100 rounded-full flex justify-center items-center text-purple-700 font-bold border-[3px] border-white shadow-sm ring-1 ring-purple-100/50 text-lg">
          {user?.firstName ? user.firstName.charAt(0) : <User size={24} />}
        </div>
      </div>
    </div>
  );
}
