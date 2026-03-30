import { useState, useEffect } from 'react';
import { Copy, Check, Users, ShieldCheck, TrendingUp, Search, Loader2 } from 'lucide-react';
import { getFunderReferralStats } from '../services/funderApi';

export default function FunderReferralsPage() {
  const [copied, setCopied] = useState(false);
  const [stats, setStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  // You would dynamically read this from user info if connected, mock for demo
  const inviteLink = 'https://invest.rentflowinsight.com/join/funder?ref=w_902A'; 

  useEffect(() => {
    const fetchGamificationData = async () => {
       try {
          const statsData = await getFunderReferralStats();
          setStats(statsData);
       } catch (error) {
          console.error('Failed to load referral data:', error);
       } finally {
          setIsLoading(false);
       }
    };
    fetchGamificationData();
  }, []);

  const handleCopy = () => {
    navigator.clipboard.writeText(inviteLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (isLoading) {
    return (
      <div className="bg-slate-50 min-h-screen p-8 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[var(--color-primary)] animate-spin" />
      </div>
    );
  }

  const recentInvites = stats?.recentInvites || [];

  return (
    <div className="flex-1 p-6 lg:p-8 pb-32 lg:pb-8 bg-slate-50 min-h-screen">
      {/* Page Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-3">
            Network & Referrals
          </h1>
          <p className="text-sm text-slate-500 mt-1">Grow your network and track your ambassador effectiveness.</p>
        </div>
      </div>

      <div className="flex flex-col space-y-6">
        
        {/* ModernInviteCard */}
        <div className="bg-slate-900 rounded-[24px] p-6 lg:p-8 text-white relative flex flex-col sm:flex-row justify-between items-center sm:items-start overflow-hidden shadow-xl border border-slate-800">
            <div className="absolute top-0 right-0 w-64 h-64 bg-purple-600 rounded-full mix-blend-screen filter blur-3xl opacity-20 pointer-events-none" />
            <div className="relative z-10 w-full text-center sm:text-left">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800 text-purple-300 text-[10px] font-bold uppercase tracking-widest mb-4">
                    <Users className="w-3.5 h-3.5" /> Funder Ambassador Network
                </div>
                <h2 className="text-3xl font-black tracking-tight mb-2">Grow Your Network. Lead The Pool.</h2>
                <p className="text-slate-400 text-sm leading-relaxed mb-6 max-w-2xl">
                    Share your secure invitation link with partners. Unlock priority early-access to premium real-estate rent pools by expanding your elite Funder Ambassador Network.
                </p>

                <div className="flex w-full max-w-xl items-center bg-white/10 rounded-xl p-1.5 border border-white/20 backdrop-blur">
                   <div className="flex-1 px-4 text-xs font-medium text-slate-300 truncate">
                      {inviteLink}
                   </div>
                   <button 
                      onClick={handleCopy}
                      className="flex shrink-0 items-center justify-center gap-1.5 bg-white text-slate-900 rounded-lg px-4 py-2 font-bold text-xs hover:bg-slate-100 transition-all cursor-pointer"
                   >
                      {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                      {copied ? 'Copied' : 'Copy'}
                   </button>
                </div>
            </div>
        </div>

        {/* SupporterReferralStats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex flex-col items-center sm:items-start text-center sm:text-left gap-2">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-tight mb-1">Total Invites Sent</p>
                <p className="font-black text-slate-900 text-xl tracking-tight">{stats?.totalInvited || 0}</p>
              </div>
            </div>
            
            <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex flex-col items-center sm:items-start text-center sm:text-left gap-2">
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-tight mb-1">Fully Verified</p>
                <p className="font-black text-slate-900 text-xl tracking-tight">{stats?.activeJoined || 0}</p>
              </div>
            </div>

            {/* This card uses col-span-2 on all screen sizes to stretch horizontally */}
            <div className="col-span-2 bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex flex-col items-center sm:items-start text-center sm:text-left gap-2">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-tight mb-1">Network Capital Deployed</p>
                <p className="font-black text-slate-900 text-xl tracking-tight flex items-center justify-center sm:justify-start gap-2">
                    UGX {((stats?.capitalDeployed || 0) * 1000000).toLocaleString()}
                    <span className="text-[10px] px-2 py-0.5 bg-slate-100 text-slate-500 rounded-full font-bold">Estimated</span>
                </p>
              </div>
            </div>
        </div>

        {/* Referred Users List at the bottom */}
        <div className="border border-slate-200 bg-white rounded-[24px] shadow-sm overflow-hidden flex flex-col mt-4">
           <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
               <div>
                  <h3 className="font-black text-slate-900 tracking-tight flex items-center gap-2">
                     <Users className="w-5 h-5 text-[var(--color-primary)]" /> 
                     Referred Users
                  </h3>
                  <p className="font-medium text-[11px] text-slate-400 mt-0.5">Your personal network</p>
               </div>
           </div>
           
           <div className="w-full">
               <div className="divide-y divide-slate-100 w-full">
                 {recentInvites.length === 0 ? (
                    <div className="p-12 text-center text-slate-400 flex flex-col items-center justify-center">
                        <Search className="w-8 h-8 mb-3 opacity-20" />
                        <p className="text-sm font-bold">You haven't referred anyone yet.</p>
                    </div>
                 ) : (
                    recentInvites.map((user: any, idx: number) => (
                      <div key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between px-6 py-4 hover:bg-slate-50 transition-colors gap-4">
                          <div className="flex items-center gap-4">
                              <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center font-bold text-sm uppercase shrink-0">
                                  {user.name.substring(0, 2)}
                              </div>
                              <div>
                                  <p className="font-bold text-sm text-slate-800">{user.name}</p>
                                  <p className="text-xs text-slate-500 font-medium">Joined: {user.date}</p>
                              </div>
                          </div>
                          
                          <div className="shrink-0 flex items-center gap-1 sm:self-center self-start pl-14 sm:pl-0">
                             <span className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest ${
                                 user.status === 'Active' ? 'bg-emerald-50 text-emerald-600' : 'bg-orange-50 text-orange-600'
                             }`}>
                                 {user.status}
                             </span>
                          </div>
                      </div>
                    ))
                 )}
               </div>
           </div>
        </div>

      </div>
    </div>
  );
}
