import { BadgeCheck, User } from 'lucide-react';

interface DashboardHeaderProps {
  user: {
    fullName: string;
    role: string;
    isVerified: boolean;
    avatarUrl?: string;
  };
  onAvatarClick: () => void;
}

export default function DashboardHeader({ user, onAvatarClick }: DashboardHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-3">
        {/* Avatar */}
        <button 
          onClick={onAvatarClick}
          className="w-12 h-12 rounded-full overflow-hidden bg-purple-100 flex items-center justify-center border-2 border-white shadow-sm transition active:scale-95"
        >
          {user.avatarUrl ? (
            <img src={user.avatarUrl} alt={user.fullName} className="w-full h-full object-cover" />
          ) : (
            <User className="text-[#512DA8]" size={24} />
          )}
        </button>

        {/* Profile Info */}
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5">
            <h2 className="font-bold text-gray-900 leading-tight">{user.fullName || "UserName"}</h2>
            <BadgeCheck 
              size={16} 
              className={user.isVerified ? "text-[#512DA8]" : "text-gray-400"} 
              fill={user.isVerified ? "#e9d5ff" : "#f3f4f6"}
            />
          </div>
          <span className="text-xs text-gray-500 font-medium">Welile Tenant</span>
        </div>
      </div>

      {/* Optional: Future Merchant Pills / AI ID could slot in here or just rely on the main layout */}
      <div className="flex items-center gap-2">
         {/* Small decorative element or notification bell could go here */}
      </div>
    </div>
  );
}
