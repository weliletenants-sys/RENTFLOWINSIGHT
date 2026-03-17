import { useAuth } from '../contexts/AuthContext';
import { useEffect } from 'react';

export default function AgentDashboard() {
  const { user } = useAuth();
  
  // Load Material Symbols
  useEffect(() => {
    const link1 = document.createElement('link');
    link1.rel = 'stylesheet';
    link1.href = 'https://fonts.googleapis.com/css2?family=Public+Sans:wght@300;400;500;600;700&display=swap';
    document.head.appendChild(link1);

    const link2 = document.createElement('link');
    link2.rel = 'stylesheet';
    link2.href = 'https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght@100..700,0..1&display=swap';
    document.head.appendChild(link2);

    return () => {
      document.head.removeChild(link1);
      document.head.removeChild(link2);
    };
  }, []);

  const userName = user?.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : "John Kamau";

  return (
    <div className="bg-[#f8f6f6] dark:bg-[#221610] text-slate-900 dark:text-slate-100 antialiased min-h-screen font-['Public_Sans']">
      <style>{`
        .material-symbols-outlined {
          font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
        }
      `}</style>
      
      <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden">
        <header className="sticky top-0 z-50 w-full border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-[#221610]/80 backdrop-blur-md px-4 lg:px-10 py-3">
          <div className="max-w-5xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img src="/welile-logo.png" alt="Welile Logo" className="h-16 w-auto object-contain" />
            </div>

          </div>
        </header>

        <main className="flex-1 w-full max-w-5xl mx-auto px-4 py-6 space-y-6">
          <section className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div 
                className="size-20 rounded-2xl bg-cover bg-center border-4 border-white dark:border-slate-800 shadow-sm" 
                style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBQTaHq2htnni0azJBOc28l79u6IOxJfpmoafjut_SSogJqisHgVAvHMF2lXYmd31AZLDrS2v4ITMNTAMujrRfGT_u-VjsAvofRZeQ_c8aI4bXr8uU0lLpOZbw_o_xR1ak6lH1S13PweioqgsRs-Ds4AfOnULfSoPpAtXcjFirtj_F30ETs0v-29_UMOC_yEm2c_bkhAJQ_oBlyBej6r5FOa_fD-CMkCR1DgeLIMZ-YbfFQw1UVEa8In31RilbPnMSCBMzpqrr-OX2X")' }}
              ></div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{userName}</h1>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs font-bold uppercase tracking-wider">
                    <span className="material-symbols-outlined text-xs">verified</span>
                    Verified
                  </span>
                </div>
                <p className="text-slate-500 dark:text-slate-400 font-medium">Senior Agent • Nairobi Central</p>
              </div>
            </div>
            <div className="flex gap-2">
              <div className="flex flex-col items-end">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Active Since</span>
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">Jan 2022</span>
              </div>
            </div>
          </section>

          <section className="relative overflow-hidden rounded-2xl bg-[#6d28d9] p-6 text-white shadow-xl shadow-[#6d28d9]/20">
            <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
              <span className="material-symbols-outlined text-[120px]">payments</span>
            </div>
            <div className="relative z-10 space-y-6">
              <div>
                <p className="text-white/80 text-sm font-medium opacity-80 uppercase tracking-widest">Wallet Balance</p>
                <h2 className="text-4xl font-extrabold tracking-tight mt-1">UGX 1,450,000</h2>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <button className="flex flex-col items-center justify-center gap-2 py-3 rounded-xl bg-white/10 hover:bg-white/20 transition-colors backdrop-blur-sm border border-white/10">
                  <span className="material-symbols-outlined">account_balance_wallet</span>
                  <span className="text-xs font-bold uppercase">Withdraw</span>
                </button>
                <button className="flex flex-col items-center justify-center gap-2 py-3 rounded-xl bg-white/10 hover:bg-white/20 transition-colors backdrop-blur-sm border border-white/10">
                  <span className="material-symbols-outlined">add_circle</span>
                  <span className="text-xs font-bold uppercase">Deposit</span>
                </button>
                <button className="flex flex-col items-center justify-center gap-2 py-3 rounded-xl bg-white/10 hover:bg-white/20 transition-colors backdrop-blur-sm border border-white/10">
                  <span className="material-symbols-outlined">sync_alt</span>
                  <span className="text-xs font-bold uppercase">Transfer</span>
                </button>
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <h3 className="text-lg font-bold text-slate-800 dark:text-white">Quick Actions</h3>
            <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
              <div className="group cursor-pointer flex flex-col items-center gap-2 p-4 rounded-2xl bg-white dark:bg-slate-800 shadow-sm border border-slate-100 dark:border-slate-700 hover:border-[#6d28d9]/50 transition-all">
                <div className="size-12 flex items-center justify-center rounded-xl bg-[#6d28d9]/10 text-[#6d28d9] group-hover:bg-[#6d28d9] group-hover:text-white transition-colors">
                  <span className="material-symbols-outlined">distance</span>
                </div>
                <span className="text-xs font-bold text-slate-600 dark:text-slate-400">Visit</span>
              </div>
              <div className="group cursor-pointer flex flex-col items-center gap-2 p-4 rounded-2xl bg-white dark:bg-slate-800 shadow-sm border border-slate-100 dark:border-slate-700 hover:border-[#6d28d9]/50 transition-all">
                <div className="size-12 flex items-center justify-center rounded-xl bg-[#6d28d9]/10 text-[#6d28d9] group-hover:bg-[#6d28d9] group-hover:text-white transition-colors">
                  <span className="material-symbols-outlined">home</span>
                </div>
                <span className="text-xs font-bold text-slate-600 dark:text-slate-400">List House</span>
              </div>
              <div className="group cursor-pointer flex flex-col items-center gap-2 p-4 rounded-2xl bg-white dark:bg-slate-800 shadow-sm border border-slate-100 dark:border-slate-700 hover:border-[#6d28d9]/50 transition-all">
                <div className="size-12 flex items-center justify-center rounded-xl bg-[#6d28d9]/10 text-[#6d28d9] group-hover:bg-[#6d28d9] group-hover:text-white transition-colors">
                  <span className="material-symbols-outlined">how_to_reg</span>
                </div>
                <span className="text-xs font-bold text-slate-600 dark:text-slate-400">Register</span>
              </div>
              <div className="group cursor-pointer flex flex-col items-center gap-2 p-4 rounded-2xl bg-white dark:bg-slate-800 shadow-sm border border-slate-100 dark:border-slate-700 hover:border-[#6d28d9]/50 transition-all">
                <div className="size-12 flex items-center justify-center rounded-xl bg-[#6d28d9]/10 text-[#6d28d9] group-hover:bg-[#6d28d9] group-hover:text-white transition-colors">
                  <span className="material-symbols-outlined">receipt_long</span>
                </div>
                <span className="text-xs font-bold text-slate-600 dark:text-slate-400">Receipt</span>
              </div>
              <div className="group cursor-pointer flex flex-col items-center gap-2 p-4 rounded-2xl bg-white dark:bg-slate-800 shadow-sm border border-slate-100 dark:border-slate-700 hover:border-[#6d28d9]/50 transition-all">
                <div className="size-12 flex items-center justify-center rounded-xl bg-[#6d28d9]/10 text-[#6d28d9] group-hover:bg-[#6d28d9] group-hover:text-white transition-colors">
                  <span className="material-symbols-outlined">person_add</span>
                </div>
                <span className="text-xs font-bold text-slate-600 dark:text-slate-400">Refer</span>
              </div>
              <div className="group cursor-pointer flex flex-col items-center gap-2 p-4 rounded-2xl bg-white dark:bg-slate-800 shadow-sm border border-slate-100 dark:border-slate-700 hover:border-[#6d28d9]/50 transition-all">
                <div className="size-12 flex items-center justify-center rounded-xl bg-[#6d28d9]/10 text-[#6d28d9] group-hover:bg-[#6d28d9] group-hover:text-white transition-colors">
                  <span className="material-symbols-outlined">grid_view</span>
                </div>
                <span className="text-xs font-bold text-slate-600 dark:text-slate-400">More</span>
              </div>
            </div>
          </section>

          <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-800 shadow-sm border border-slate-100 dark:border-slate-700 flex flex-col justify-between h-full">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Daily Operations</h4>
                <span className="material-symbols-outlined text-[#6d28d9]">analytics</span>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-slate-700 dark:text-slate-300 font-medium">Visits Today</span>
                  <span className="text-xl font-bold text-slate-900 dark:text-white">12</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-1.5">
                  <div className="bg-[#6d28d9] h-1.5 rounded-full" style={{ width: '75%' }}></div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-700 dark:text-slate-300 font-medium">Collections</span>
                  <span className="text-xl font-bold text-slate-900 dark:text-white">8</span>
                </div>
              </div>
            </div>
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-800 shadow-sm border border-slate-100 dark:border-slate-700 flex flex-col justify-between h-full">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Credit Access</h4>
                <span className="material-symbols-outlined text-[#6d28d9]">credit_card</span>
              </div>
              <div className="space-y-4">
                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Available Limit</p>
                  <p className="text-xl font-bold text-slate-900 dark:text-white mt-0.5">UGX 500,000</p>
                </div>
                <button className="w-full py-2.5 rounded-xl bg-[#6d28d9]/10 text-[#6d28d9] text-sm font-bold hover:bg-[#6d28d9]/20 transition-colors">
                  Request Increase
                </button>
              </div>
            </div>
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-800 shadow-sm border border-slate-100 dark:border-slate-700 flex flex-col justify-between h-full">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Rent Requests</h4>
                <span className="material-symbols-outlined text-[#6d28d9]">assignment_turned_in</span>
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
                    <span className="material-symbols-outlined">download</span>
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
                    <span className="material-symbols-outlined">upload</span>
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

        <nav className="md:hidden sticky bottom-0 w-full bg-white dark:bg-[#221610] border-t border-slate-200 dark:border-slate-800 px-6 py-3 flex items-center justify-between z-50">
          <button className="flex flex-col items-center gap-1 text-[#6d28d9]">
            <span className="material-symbols-outlined">grid_view</span>
            <span className="text-[10px] font-bold">Home</span>
          </button>
          <button className="flex flex-col items-center gap-1 text-slate-400 hover:text-[#6d28d9]">
            <span className="material-symbols-outlined">wallet</span>
            <span className="text-[10px] font-bold">Wallet</span>
          </button>
          <button className="flex flex-col items-center gap-1 text-slate-400 hover:text-[#6d28d9]">
            <span className="material-symbols-outlined">group</span>
            <span className="text-[10px] font-bold">Clients</span>
          </button>
          <button className="flex flex-col items-center gap-1 text-slate-400 hover:text-[#6d28d9]">
            <span className="material-symbols-outlined">settings</span>
            <span className="text-[10px] font-bold">Settings</span>
          </button>
        </nav>
      </div>
    </div>
  );
}
