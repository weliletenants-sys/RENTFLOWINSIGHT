import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ChevronLeft, Wallet, BadgeCheck, Users, Copy, RefreshCcw, 
  MessageCircle, MessageSquare, Share2, Info, Send 
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function AgentReferral() {
  const navigate = useNavigate();
  const [refCode, setRefCode] = useState('AGT12345');
  const referralLink = `https://welile.com/signup?ref=${refCode}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink);
    toast.success('Referral link copied!');
  };

  const handleRegenerate = () => {
    const newCode = `AGT${Math.floor(10000 + Math.random() * 90000)}`;
    setRefCode(newCode);
    toast.success('Generated new tracking link');
  };

  const shareWhatsApp = () => {
    const text = `Join Welile and access rent support. Use my link: ${referralLink}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  const shareSMS = () => {
    const text = `Join Welile and access rent support. Use my link: ${referralLink}`;
    window.open(`sms:?body=${encodeURIComponent(text)}`, '_self');
  };

  const shareOther = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Join Welile',
          text: 'Join Welile and access rent support.',
          url: referralLink,
        });
      } catch (e) {
        console.error('Error sharing:', e);
      }
    } else {
      handleCopy();
    }
  };

  return (
    <div className="bg-[#f8fafc] dark:bg-[#1e1e1e] font-['Inter'] text-slate-900 dark:text-slate-100 min-h-screen pb-24">
      {/* Sticky Header */}
      <header className="sticky top-0 z-50 bg-[#f8fafc]/80 dark:bg-[#1e1e1e]/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-4 md:px-10 py-4">
        <div className="max-w-[960px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate('/dashboard')} className="flex items-center justify-center rounded-full w-10 h-10 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-[#6c11d4]/10 hover:text-[#6c11d4] transition-colors">
              <ChevronLeft size={24} />
            </button>
            <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">Refer & Earn</h1>
          </div>
          <div className="flex items-center gap-2">
            <Wallet size={20} className="text-[#6c11d4]" />
            <span className="font-semibold text-slate-900 dark:text-white">UGX 12,500</span>
          </div>
        </div>
      </header>

      <main className="max-w-[960px] mx-auto p-4 space-y-6">
        {/* Hero Section */}
        <section className="rounded-2xl p-6 bg-gradient-to-br from-[#6c11d4] via-[#8b5cf6] to-[#a78bfa] text-white shadow-xl shadow-[#6c11d4]/20">
          <div className="flex flex-col md:flex-row gap-6 items-center">
            <div className="flex-1 space-y-3">
              <h2 className="text-3xl font-bold leading-tight">Earn UGX 500 per signup</h2>
              <p className="text-purple-100 opacity-90 text-lg">Invite tenants, landlords, and supporters to Welile and grow your network.</p>
              <div className="pt-4">
                <span className="inline-flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full text-sm font-medium backdrop-blur-sm">
                  <BadgeCheck size={20} />
                  Verified Referral Program
                </span>
              </div>
            </div>
            <div className="hidden md:flex w-40 h-40 bg-white/10 rounded-full items-center justify-center backdrop-blur-md border border-white/20">
              <Users size={80} className="text-white/80" />
            </div>
          </div>
        </section>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex flex-col gap-1 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 shadow-sm">
            <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Total Referrals</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-white">24</p>
          </div>
          <div className="flex flex-col gap-1 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 shadow-sm">
            <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Active Users</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-white">18</p>
          </div>
          <div className="flex flex-col gap-1 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 shadow-sm">
            <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Total Earnings (UGX)</p>
            <p className="text-2xl font-bold text-[#6c11d4]">12,500</p>
          </div>
        </div>

        {/* Referral Link Section */}
        <section className="space-y-4">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">Your Referral Link</h3>
          <div className="flex flex-col md:flex-row items-stretch gap-3">
            <div className="flex flex-1 items-center bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3">
              <input 
                readOnly 
                value={referralLink}
                className="bg-transparent border-none focus:ring-0 w-full text-slate-700 dark:text-slate-300 font-medium overflow-hidden text-ellipsis"
              />
              <button onClick={handleCopy} className="text-[#6c11d4] hover:text-[#5a1bb9] ml-2 p-1">
                <Copy size={20} />
              </button>
            </div>
            <button onClick={handleRegenerate} className="flex items-center justify-center gap-2 px-6 py-3 bg-[#6c11d4] text-white font-bold rounded-xl hover:bg-[#5a1bb9] transition-all">
              <RefreshCcw size={20} />
              Regenerate
            </button>
          </div>
          <p className="text-slate-500 text-xs px-1">Anyone who signs up using this link is automatically linked to your account for lifetime rewards.</p>
        </section>

        {/* Share Actions */}
        <section className="space-y-4">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">Share your link</h3>
          <div className="flex gap-4">
            <button onClick={shareWhatsApp} className="flex-1 flex flex-col items-center gap-2">
              <div className="w-14 h-14 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 flex items-center justify-center hover:bg-green-200 dark:hover:bg-green-800/40 transition-colors">
                <MessageCircle size={28} />
              </div>
              <span className="text-xs font-medium text-slate-700 dark:text-slate-300">WhatsApp</span>
            </button>
            <button onClick={shareSMS} className="flex-1 flex flex-col items-center gap-2">
              <div className="w-14 h-14 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center hover:bg-blue-200 dark:hover:bg-blue-800/40 transition-colors">
                <MessageSquare size={28} />
              </div>
              <span className="text-xs font-medium text-slate-700 dark:text-slate-300">SMS</span>
            </button>
            <button onClick={shareOther} className="flex-1 flex flex-col items-center gap-2">
              <div className="w-14 h-14 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 flex items-center justify-center hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                <Share2 size={28} />
              </div>
              <span className="text-xs font-medium text-slate-700 dark:text-slate-300">Others</span>
            </button>
          </div>
        </section>

        {/* Commission Card */}
        <div className="bg-[#f5f3ff] dark:bg-[#6c11d4]/10 border border-[#6c11d4]/20 rounded-2xl p-5 flex gap-4">
          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[#6c11d4]/20 flex items-center justify-center text-[#6c11d4]">
            <Info size={20} />
          </div>
          <div className="space-y-1">
            <p className="font-bold text-sm text-slate-900 dark:text-white">How it works</p>
            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">Get UGX 500 instantly for every new user who completes registration. Unlock up to 5% commission on their first transaction through the Welile platform.</p>
          </div>
        </div>

        {/* Referral Performance List */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Your Referrals</h3>
            <button className="text-[#6c11d4] text-sm font-semibold hover:underline">View All</button>
          </div>
          
          <div className="border border-slate-200 dark:border-slate-800 rounded-2xl divide-y divide-slate-200 dark:divide-slate-800 overflow-hidden bg-white dark:bg-slate-900/50">
            {/* List Item 1 */}
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400 font-bold">KM</div>
                <div>
                  <p className="font-semibold text-sm text-slate-900 dark:text-white">Kato Mark</p>
                  <p className="text-slate-500 text-xs">+256 701 *** 890</p>
                </div>
              </div>
              <div className="text-right">
                <span className="inline-block px-2 py-1 rounded text-[10px] font-bold uppercase bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">Activated</span>
                <p className="text-sm font-bold mt-1 text-slate-900 dark:text-white">UGX 500</p>
              </div>
            </div>

            {/* List Item 2 */}
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400 font-bold">SN</div>
                <div>
                  <p className="font-semibold text-sm text-slate-900 dark:text-white">Sarah Nakato</p>
                  <p className="text-slate-500 text-xs">+256 772 *** 432</p>
                </div>
              </div>
              <div className="text-right">
                <span className="inline-block px-2 py-1 rounded text-[10px] font-bold uppercase bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">Signed Up</span>
                <p className="text-sm font-bold mt-1 text-slate-900 dark:text-white">UGX 500</p>
              </div>
            </div>

            {/* List Item 3 */}
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400 font-bold">AM</div>
                <div>
                  <p className="font-semibold text-sm text-slate-900 dark:text-white">Allan Mukasa</p>
                  <p className="text-slate-500 text-xs">+256 756 *** 112</p>
                </div>
              </div>
              <div className="text-right">
                <span className="inline-block px-2 py-1 rounded text-[10px] font-bold uppercase bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400">Invited</span>
                <p className="text-sm font-bold mt-1 text-slate-900 dark:text-white">UGX 0</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Fixed Action Button */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/95 dark:bg-[#1e1e1e]/95 backdrop-blur border-t border-slate-200 dark:border-slate-800 z-50 shadow-[0_-10px_15px_-3px_rgba(0,0,0,0.05)] md:relative md:bg-transparent md:border-none md:shadow-none md:mt-6">
        <div className="max-w-[960px] mx-auto">
          <button onClick={shareOther} className="w-full bg-[#6c11d4] hover:bg-[#5a1bb9] py-4 rounded-xl text-white font-bold text-lg shadow-lg shadow-[#6c11d4]/30 flex items-center justify-center gap-3 active:scale-[0.98] transition-all">
            <Send size={20} />
            Share Referral Link
          </button>
        </div>
      </div>
    </div>
  );
}
