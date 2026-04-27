import { Gift, Copy, CheckCircle2 } from 'lucide-react';
import { useState } from 'react';

export default function InviteFriendsCard() {
  const [copied, setCopied] = useState(false);
  const referralCode = "TEN-24A-98F";

  const handleCopy = () => {
    navigator.clipboard.writeText(referralCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-gradient-to-br from-[#1e4b9c] to-[#0f3b7d] rounded-2xl shadow-lg p-6 lg:p-8 flex flex-col h-full relative overflow-hidden group border-t border-[#4680e6]">
      {/* Glow Effect */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-blue-400/20 rounded-full blur-3xl opacity-50 -mr-10 -mt-10 pointer-events-none"></div>

      <div className="flex justify-between items-start mb-6 relative z-10">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Gift className="w-5 h-5 text-blue-300" />
            <h3 className="text-[17px] font-bold text-white tracking-tight leading-none">Refer a friend</h3>
          </div>
          <p className="text-xs font-medium text-blue-200 mt-2 max-w-[200px]">Get UGX 10,000 rent credit for every friend who successfully funds their rent through Welile.</p>
        </div>
      </div>

      <div className="mt-auto relative z-10">
        <p className="text-[10px] font-bold text-blue-300 tracking-widest uppercase mb-2">Your Invite Code</p>
        <div className="flex items-center p-1.5 rounded-xl bg-white/10 border border-white/20 backdrop-blur-sm">
          <div className="px-4 py-2 font-black text-white tracking-wider font-mono text-sm leading-none flex-1">
            {referralCode}
          </div>
          <button 
            onClick={handleCopy}
            className={`p-2.5 rounded-lg font-bold text-xs flex items-center justify-center transition-all ${copied ? 'bg-[#4ade80] text-emerald-950' : 'bg-white hover:bg-slate-100 text-[#0f3b7d]'}`}
          >
            {copied ? <CheckCircle2 className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </div>
  );
}
