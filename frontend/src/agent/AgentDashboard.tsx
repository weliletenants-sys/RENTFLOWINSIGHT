import { useAuth } from '../contexts/AuthContext';
import { useEffect } from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { MapPin, Home, UserCheck, FileText, UserPlus, Store, Wallet, PlusCircle, ArrowRightLeft, BadgeCheck, LineChart, CreditCard, ClipboardCheck, Download, Upload, Users, Settings } from 'lucide-react';
import AgentRegisterDialog from './components/dialogs/AgentRegisterDialog';


export default function AgentDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isRegisterDialogOpen, setIsRegisterDialogOpen] = useState(false);
  const [summary, setSummary] = useState<any>({
    visits_today: 0,
    collections_count: 0,
    collections_amount: 0,
    float_limit: 0,
    collected_today: 0,
    wallet_balance: 0
  });

  useEffect(() => {
    const fetchSummary = async () => {
      try {
         const { data } = await axios.get('/api/agent/dashboard/summary');
         setSummary(data);
      } catch (err) {
         console.error('Failed to fetch summary:', err);
      }
    };
    fetchSummary();
  }, []);

  // Load Material Symbols
  useEffect(() => {
    const link1 = document.createElement('link');
    link1.rel = 'stylesheet';
    link1.href = 'https://fonts.googleapis.com/css2?family=Public+Sans:wght@300;400;500;600;700&display=swap';
    document.head.appendChild(link1);

    return () => {
      document.head.removeChild(link1);
    };
  }, []);

  const userName = user?.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : "John Kamau";

  return (
    <div className="bg-[#f8f6f6] dark:bg-[#221610] text-slate-900 dark:text-slate-100 antialiased min-h-screen font-['Public_Sans']">
      <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden">
        <header className="fixed top-0 left-0 right-0 z-50 w-full border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-[#221610]/80 backdrop-blur-md px-4 lg:px-10 py-3">
          <div className="max-w-5xl mx-auto flex items-center justify-center">
              <div className="flex items-center gap-4">
                <div 
                  className="size-12 rounded-2xl bg-cover bg-center border-2 border-white dark:border-slate-800 shadow-sm" 
                  style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBQTaHq2htnni0azJBOc28l79u6IOxJfpmoafjut_SSogJqisHgVAvHMF2lXYmd31AZLDrS2v4ITMNTAMujrRfGT_u-VjsAvofRZeQ_c8aI4bXr8uU0lLpOZbw_o_xR1ak6lH1S13PweioqgsRs-Ds4AfOnULfSoPpAtXcjFirtj_F30ETs0v-29_UMOC_yEm2c_bkhAJQ_oBlyBej6r5FOa_fD-CMkCR1DgeLIMZ-YbfFQw1UVEa8In31RilbPnMSCBMzpqrr-OX2X")' }}
                ></div>
                <div>
                    <h1 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                      {userName}
                      <BadgeCheck size={20} className="text-[#1d9bf0]" fill="#1d9bf0" stroke="white" strokeWidth={1.5} />
                    </h1>
                  <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Senior Agent • Nairobi Central</p>
                </div>
              </div>
          </div>
        </header>

        <main className="flex-1 w-full max-w-5xl mx-auto px-4 pt-24 pb-24 space-y-6">


          <section className="relative overflow-hidden rounded-2xl bg-[#6d28d9] p-6 text-white shadow-xl shadow-[#6d28d9]/20">

            <div className="relative z-10 space-y-6">
              <div>
                <p className="text-white/80 text-sm font-medium opacity-80 uppercase tracking-widest">Wallet Balance</p>
                <h2 className="text-4xl font-extrabold tracking-tight mt-1">UGX {(summary.wallet_balance || 0).toLocaleString()}</h2>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <button onClick={() => navigate('/agent-withdraw')} className="flex flex-col items-center justify-center gap-2 py-3 rounded-xl bg-white/10 hover:bg-white/20 transition-colors backdrop-blur-sm border border-white/10">
                  <Wallet size={24} />
                  <span className="text-xs font-bold uppercase">Withdraw</span>
                </button>
                <button onClick={() => navigate('/agent-deposit')} className="flex flex-col items-center justify-center gap-2 py-3 rounded-xl bg-white/10 hover:bg-white/20 transition-colors backdrop-blur-sm border border-white/10">
                  <PlusCircle size={24} />
                  <span className="text-xs font-bold uppercase">Deposit</span>
                </button>
                <button onClick={() => navigate('/agent-transfer')} className="flex flex-col items-center justify-center gap-2 py-3 rounded-xl bg-white/10 hover:bg-white/20 transition-colors backdrop-blur-sm border border-white/10">
                  <ArrowRightLeft size={24} />
                  <span className="text-xs font-bold uppercase">Transfer</span>
                </button>
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <h3 className="text-lg font-bold text-slate-800 dark:text-white">Quick Actions</h3>
            <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
              <div onClick={() => navigate('/agent-visit')} className="group cursor-pointer flex flex-col items-center gap-2 p-4 rounded-2xl bg-white dark:bg-slate-800 shadow-sm border border-slate-100 dark:border-slate-700 hover:border-[#6d28d9]/50 transition-all">
                <div className="size-12 flex items-center justify-center rounded-xl bg-[#6d28d9]/10 text-[#6d28d9] group-hover:bg-[#6d28d9] group-hover:text-white transition-colors">
                  <MapPin size={24} />
                </div>
                <span className="text-xs font-bold text-slate-600 dark:text-slate-400">Visit</span>
              </div>
              <div onClick={() => navigate('/agent-list-house')} className="group cursor-pointer flex flex-col items-center gap-2 p-4 rounded-2xl bg-white dark:bg-slate-800 shadow-sm border border-slate-100 dark:border-slate-700 hover:border-[#6d28d9]/50 transition-all">
                <div className="size-12 flex items-center justify-center rounded-xl bg-[#6d28d9]/10 text-[#6d28d9] group-hover:bg-[#6d28d9] group-hover:text-white transition-colors">
                  <Home size={24} />
                </div>
                <span className="text-xs font-bold text-slate-600 dark:text-slate-400">List House</span>
              </div>
              <div onClick={() => setIsRegisterDialogOpen(true)} className="group cursor-pointer flex flex-col items-center gap-2 p-4 rounded-2xl bg-white dark:bg-slate-800 shadow-sm border border-slate-100 dark:border-slate-700 hover:border-[#6d28d9]/50 transition-all">
                <div className="size-12 flex items-center justify-center rounded-xl bg-[#6d28d9]/10 text-[#6d28d9] group-hover:bg-[#6d28d9] group-hover:text-white transition-colors">
                  <UserCheck size={24} />
                </div>
                <span className="text-xs font-bold text-slate-600 dark:text-slate-400">Register</span>
              </div>
              <div onClick={() => navigate('/agent-receipt')} className="group cursor-pointer flex flex-col items-center gap-2 p-4 rounded-2xl bg-white dark:bg-slate-800 shadow-sm border border-slate-100 dark:border-slate-700 hover:border-[#6d28d9]/50 transition-all">
                <div className="size-12 flex items-center justify-center rounded-xl bg-[#6d28d9]/10 text-[#6d28d9] group-hover:bg-[#6d28d9] group-hover:text-white transition-colors">
                  <FileText size={24} />
                </div>
                <span className="text-xs font-bold text-slate-600 dark:text-slate-400">Receipt</span>
              </div>
              <div onClick={() => navigate('/agent-referral')} className="group cursor-pointer flex flex-col items-center gap-2 p-4 rounded-2xl bg-white dark:bg-slate-800 shadow-sm border border-slate-100 dark:border-slate-700 hover:border-[#6d28d9]/50 transition-all">
                <div className="size-12 flex items-center justify-center rounded-xl bg-[#6d28d9]/10 text-[#6d28d9] group-hover:bg-[#6d28d9] group-hover:text-white transition-colors">
                  <UserPlus size={24} />
                </div>
                <span className="text-xs font-bold text-slate-600 dark:text-slate-400">Refer</span>
              </div>
              <div onClick={() => navigate('/agent-shop')} className="group cursor-pointer flex flex-col items-center gap-2 p-4 rounded-2xl bg-white dark:bg-slate-800 shadow-sm border border-slate-100 dark:border-slate-700 hover:border-[#6d28d9]/50 transition-all">
                <div className="size-12 flex items-center justify-center rounded-xl bg-[#6d28d9]/10 text-[#6d28d9] group-hover:bg-[#6d28d9] group-hover:text-white transition-colors">
                  <Store size={24} />
                </div>
                <span className="text-xs font-bold text-slate-600 dark:text-slate-400">Shop</span>
              </div>
            </div>
          </section>

          <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div onClick={() => navigate('/agent-daily-ops')} className="p-5 rounded-2xl bg-white dark:bg-slate-800 shadow-sm border border-slate-100 dark:border-slate-700 flex flex-col justify-between h-full cursor-pointer hover:border-[#6d28d9]/50 transition-all group">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider group-hover:text-[#6d28d9] transition-colors">Daily Operations</h4>
                <LineChart className="text-[#6d28d9]" size={24} />
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-slate-700 dark:text-slate-300 font-medium">Visits Today</span>
                  <span className="text-xl font-bold text-slate-900 dark:text-white">{summary.visits_today || 0}</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-1.5">
                  <div className="bg-[#6d28d9] h-1.5 rounded-full" style={{ width: `${Math.min(((summary.visits_today || 0) / 20) * 100, 100)}%` }}></div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-700 dark:text-slate-300 font-medium">Collections</span>
                  <span className="text-xl font-bold text-slate-900 dark:text-white">{summary.collections_count || 0}</span>
                </div>
              </div>
            </div>
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-800 shadow-sm border border-slate-100 dark:border-slate-700 flex flex-col justify-between h-full">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Credit Access</h4>
                <CreditCard className="text-[#6d28d9]" size={24} />
              </div>
              <div className="space-y-4">
                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Available Limit</p>
                  <p className="text-xl font-bold text-slate-900 dark:text-white mt-0.5">UGX {Math.max(0, (summary.float_limit || 0) - (summary.collected_today || 0)).toLocaleString()}</p>
                </div>
                <button 
                  onClick={() => navigate('/agent-advance-request')}
                  className="w-full py-2.5 rounded-xl bg-[#6d28d9]/10 text-[#6d28d9] text-sm font-bold hover:bg-[#6d28d9]/20 transition-colors"
                >
                  Request for Advance
                </button>
              </div>
            </div>
            <div 
              onClick={() => navigate('/agent-rent-requests')} 
              className="p-5 rounded-2xl bg-white dark:bg-slate-800 shadow-sm border border-slate-100 dark:border-slate-700 flex flex-col justify-between h-full cursor-pointer hover:border-[#6d28d9]/50 transition-all group"
            >
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider group-hover:text-[#6d28d9] transition-colors">Rent Requests</h4>
                <ClipboardCheck className="text-[#6d28d9]" size={24} />
              </div>
              <div className="flex items-center gap-4">
                <div className="size-14 rounded-full border-4 border-[#6d28d9]/20 flex items-center justify-center text-[#6d28d9] font-bold text-xl">
                  14
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900 dark:text-white">Approved Requests</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Past 30 days</p>
                </div>
              </div>
              <div className="mt-4 flex -space-x-2">
                <div className="size-8 rounded-full border-2 border-white dark:border-slate-800 bg-cover bg-center" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDd9fIr1AdxcgnuB-H5-daGvGGH-JRnwFkGnlPvEvlZJWzxibwW2ZGaC19mZevaQKsBI_cI93eyHjlz9hSik9XZ77lxPeDAN-fKkVVX984ArmLwRVRmdlt0gnCVEfjdAEfN6tGgLWp2RP0G4crGouMO50VO4iBwdfqVvpO9Tnc0k8ecw3XgPoI9IuFDc4vQtXEivONj5venxaqK6hMLO-uMpqm5QO-6ROSadfk1zf4VMhF3E8u9uangKjQAcFsRwdnw8Ivz_YQohryd")' }}></div>
                <div className="size-8 rounded-full border-2 border-white dark:border-slate-800 bg-cover bg-center" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBQ75Yrmw14sukSUDItwqynyBUp9fZeKLjjmkKOiaTAgER1Yknws-D2ZAUCZwdRVHjgdzkf0InjK1vOM9K5gyAHOCSZCbDC4rkhhHBlG_tSZEPANjNV2ZDH3gPFHFfKyW6gi5wNXdkveDvksoQScq-dQcXgV7w22l9Os3FUWePRss2iHdqJVV11_atT0rP8bi0o5tY8aSZ4bNmXc6y_eU0_xLypNMp8tZiD0t6K4O9bKS5K3aB1thQTgsa4sGvCn0oMHkF6JAMXggtf")' }}></div>
                <div className="size-8 rounded-full border-2 border-white dark:border-slate-800 bg-cover bg-center" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBpFm0yPE3l6GOJbGuAHqNL1BmTnKXUNt2ZFbLr8H8yA1N8lNTBU9kowwi5oKazAPyAvs6N3wywxKdqecLbgqnSw68f0WKEk-6-BLxntaoJWVr0sUyIjs52k3-KZj9BpZviohgjzOsIDJTuwiDo7JddCrHKWyeqpvgfM20KlAr6Wavl16_ApCqBeineC51z7VNbyLwLZvlifNHMSz6aZCCh_ySVEOMiUe2EzM1UYI4Qektyl5zV31MAxxDuUEL0yneWHrCjSn3Tq5Pn")' }}></div>
                <div className="size-8 rounded-full bg-slate-100 dark:bg-slate-700 border-2 border-white dark:border-slate-800 flex items-center justify-center text-[10px] font-bold">+11</div>
              </div>
            </div>
          </section>

          <section className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-700 pb-20 md:pb-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Recent Transactions</h3>
              <button className="text-sm font-bold text-[#6d28d9]">View All</button>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="size-10 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 flex items-center justify-center">
                    <Download size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900 dark:text-white">Collection - House #104</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Oct 24, 2023 • 10:30 AM</p>
                  </div>
                </div>
                <p className="text-sm font-bold text-green-600">+ UGX 45,000</p>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="size-10 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 flex items-center justify-center">
                    <Upload size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900 dark:text-white">Withdrawal to Bank</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Oct 23, 2023 • 04:15 PM</p>
                  </div>
                </div>
                <p className="text-sm font-bold text-slate-900 dark:text-white">- UGX 200,000</p>
              </div>
            </div>
          </section>
        </main>

        <nav className="md:hidden fixed bottom-0 left-0 right-0 w-full bg-white dark:bg-[#221610] border-t border-slate-200 dark:border-slate-800 px-6 py-3 flex items-center justify-between z-50">
          <button onClick={() => navigate('/dashboard')} className="flex flex-col items-center gap-1 text-[#6d28d9]">
            <Home size={24} />
            <span className="text-[10px] font-bold">Home</span>
          </button>
          <button onClick={() => navigate('/agent-wallet')} className="flex flex-col items-center gap-1 text-slate-400 hover:text-[#6d28d9] transition-colors">
            <Wallet size={24} />
            <span className="text-[10px] font-bold">Wallet</span>
          </button>
          <button onClick={() => navigate('/dashboard/agent/clients')} className="flex flex-col items-center gap-1 text-slate-400 hover:text-[#6d28d9] transition-colors">
            <Users size={24} />
            <span className="text-[10px] font-bold">Clients</span>
          </button>
          <button onClick={() => navigate('/dashboard/agent/settings')} className="flex flex-col items-center gap-1 text-slate-400 hover:text-[#6d28d9] transition-colors">
            <Settings size={24} />
            <span className="text-[10px] font-bold">Settings</span>
          </button>
        </nav>

        {/* Dialogs */}
        <AgentRegisterDialog 
          isOpen={isRegisterDialogOpen} 
          onClose={() => setIsRegisterDialogOpen(false)} 
        />
      </div>
    </div>
  );
}
