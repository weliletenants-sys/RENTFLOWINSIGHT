import { Share2, Lock, Star, Zap, Shield, TrendingUp } from 'lucide-react';

export default function AchievementBadges() {
  const badges = [
    { id: 1, title: 'Early Bird', description: 'First repayment made early', icon: <Zap className="w-5 h-5 text-amber-500" />, unlocked: true, bg: 'bg-amber-100', border: 'border-amber-200' },
    { id: 2, title: 'Trusted', description: 'Verify your ID and Landlord', icon: <Shield className="w-5 h-5 text-blue-500" />, unlocked: true, bg: 'bg-blue-100', border: 'border-blue-200' },
    { id: 3, title: '30-Day Streak', description: '30 consecutive days paid', icon: <TrendingUp className="w-5 h-5 text-emerald-500" />, unlocked: false, bg: 'bg-slate-100', border: 'border-slate-200' },
    { id: 4, title: 'Super Star', description: 'Invite 5 active friends', icon: <Star className="w-5 h-5 text-purple-500" />, unlocked: false, bg: 'bg-slate-100', border: 'border-slate-200' },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.02)] border border-slate-100 p-6 flex flex-col h-full relative overflow-hidden group">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-[17px] font-bold text-slate-900 tracking-tight leading-none">Your Achievements</h3>
          <p className="text-xs font-medium text-slate-500 mt-1">Unlock badges to boost your limits</p>
        </div>
        <button className="text-blue-600 hover:text-blue-700 font-bold text-xs flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          Share <Share2 className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3 flex-1">
        {badges.map((badge) => (
          <div 
            key={badge.id} 
            className={`rounded-xl border ${badge.unlocked ? badge.border : 'border-slate-100'} p-4 flex flex-col items-center justify-center text-center relative overflow-hidden transition-all hover:scale-[1.02]`}
          >
            <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 z-10 ${badge.unlocked ? badge.bg : 'bg-slate-50'}`}>
               {!badge.unlocked ? <Lock className="w-4 h-4 text-slate-300" /> : badge.icon}
            </div>
            <h4 className={`text-xs font-bold z-10 ${badge.unlocked ? 'text-slate-900' : 'text-slate-400'}`}>{badge.title}</h4>
            <p className="text-[9px] text-slate-400 font-medium leading-tight mt-1 px-1 z-10">{badge.description}</p>
            
            {/* Ambient Background for unlocked */}
            {badge.unlocked && (
              <div className={`absolute -inset-4 opacity-10 blur-xl ${badge.bg.replace('100', '400')}`}></div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
