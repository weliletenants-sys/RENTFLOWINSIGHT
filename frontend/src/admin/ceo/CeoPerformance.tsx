import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const ceoColors = `
  .bg-surface { background-color: #f7f9fb; }
  .text-on-surface { color: #191c1e; }
  .bg-surface-container-lowest { background-color: #ffffff; }
  .bg-surface-container-low { background-color: #f2f4f6; }
  .bg-surface-container { background-color: #eceef0; }
  .bg-surface-container-high { background-color: #e6e8ea; }
  .bg-surface-container-highest { background-color: #e0e3e5; }
  
  .text-on-surface-variant { color: #45464d; }
  
  .bg-primary { background-color: #000000; }
  .text-on-primary { color: #ffffff; }
  .bg-primary-fixed { background-color: #dae2fd; }
  .bg-primary-fixed-dim { background-color: #bec6e0; }
  .text-on-primary-fixed { color: #131b2e; }
  .text-on-primary-container { color: #7c839b; }
  
  .bg-secondary-fixed { background-color: #d5e3fc; }
  .text-on-secondary-fixed { color: #0d1c2e; }
  
  .bg-tertiary-fixed { background-color: #6ffbbe; }
  .bg-tertiary-fixed-dim { background-color: #4edea3; }
  .text-on-tertiary-fixed { color: #002113; }
  .bg-tertiary-container { background-color: #002113; }
  .text-on-tertiary-fixed-variant { color: #005236; }
  
  .bg-error-container { background-color: #ffdad6; }
  .text-on-error-container { color: #93000a; }
  .text-error { color: #ba1a1a; }
  .bg-error { background-color: #ba1a1a; }
  
  .bg-outline-variant { background-color: #c6c6cd; }
  .text-outline-variant { color: #c6c6cd; }
  .border-outline-variant { border-color: #c6c6cd; }
  
  /* Utilities */
  .divide-outline-variant\\/5 > :not([hidden]) ~ :not([hidden]) {
    border-color: rgba(198, 198, 205, 0.05);
  }
  .bg-tertiary-fixed-dim\\/10 { background-color: rgba(78, 222, 163, 0.1); }
  .bg-outline-variant\\/10 { background-color: rgba(198, 198, 205, 0.1); }
  .bg-surface-container-low\\/30 { background-color: rgba(242, 244, 246, 0.3); }
  .hover\\:bg-surface-container-low\\/30:hover { background-color: rgba(242, 244, 246, 0.3); }
  .border-outline-variant\\/10 { border-color: rgba(198, 198, 205, 0.1); }
  .border-outline-variant\\/15 { border-color: rgba(198, 198, 205, 0.15); }
  .border-outline-variant\\/30 { border-color: rgba(198, 198, 205, 0.3); }
  .text-primary\\/40 { color: rgba(0, 0, 0, 0.4); }
  .border-error\\/5 { border-color: rgba(186, 26, 26, 0.05); }

  .glass-nav {
      background: rgba(255, 255, 255, 0.8);
      backdrop-filter: blur(20px);
  }
  .custom-scrollbar::-webkit-scrollbar {
      width: 4px;
  }
  .custom-scrollbar::-webkit-scrollbar-track {
      background: transparent;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb {
      background: #e0e3e5;
      border-radius: 10px;
  }
`;

export default function CeoPerformance() {
  const { profile } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="bg-surface font-body text-on-surface antialiased min-h-screen relative">
      <style>{ceoColors}</style>
      
      {/* SideNavBar */}
      <aside className="bg-slate-100 dark:bg-slate-900 h-screen w-64 fixed left-0 top-0 overflow-y-auto flex flex-col py-8 px-6 z-50">
        <div className="mb-10">
          <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-50 font-headline uppercase">Sovereign</h1>
          <p className="text-[0.6875rem] font-bold tracking-widest text-on-surface-variant uppercase mt-1">CEO Terminal</p>
        </div>
        
        <nav className="flex-1 space-y-1">
          <a onClick={() => navigate('/ceo/dashboard')} className="flex items-center gap-3 px-3 py-2 text-slate-500 dark:text-slate-400 hover:bg-slate-200/50 dark:hover:bg-slate-800/50 transition-colors duration-200 rounded cursor-pointer">
            <span className="material-symbols-outlined text-xl" data-icon="dashboard">dashboard</span>
            <span className="text-sm font-medium">Overview</span>
          </a>
          <a className="flex items-center gap-3 px-3 py-2 text-slate-500 dark:text-slate-400 hover:bg-slate-200/50 dark:hover:bg-slate-800/50 transition-colors duration-200 rounded cursor-pointer">
            <span className="material-symbols-outlined text-xl" data-icon="payments">payments</span>
            <span className="text-sm font-medium">Revenue</span>
          </a>
          <a className="flex items-center gap-3 px-3 py-2 text-slate-500 dark:text-slate-400 hover:bg-slate-200/50 dark:hover:bg-slate-800/50 transition-colors duration-200 rounded cursor-pointer">
            <span className="material-symbols-outlined text-xl" data-icon="group">group</span>
            <span className="text-sm font-medium">Users</span>
          </a>
          <a className="flex items-center gap-3 px-3 py-2 text-slate-500 dark:text-slate-400 hover:bg-slate-200/50 dark:hover:bg-slate-800/50 transition-colors duration-200 rounded cursor-pointer">
            <span className="material-symbols-outlined text-xl" data-icon="account_balance">account_balance</span>
            <span className="text-sm font-medium">Financials</span>
          </a>
          {/* Active Tab: Performance */}
          <a className="flex items-center gap-3 px-3 py-2 text-slate-950 dark:text-white font-semibold border-r-2 border-slate-950 dark:border-slate-50 bg-slate-200/50 dark:bg-slate-800/50 transition-colors duration-200 cursor-default">
            <span className="material-symbols-outlined text-xl" data-icon="monitoring">monitoring</span>
            <span className="text-sm">Performance</span>
          </a>
        </nav>
        
        <div className="mt-auto space-y-1">
          <button className="w-full text-left flex items-center gap-3 px-3 py-2 text-slate-500 hover:text-slate-700 transition-colors mb-6 cursor-pointer">
            <span className="material-symbols-outlined text-xl" data-icon="add_circle">add_circle</span>
            <span className="text-sm font-medium">Quick Action</span>
          </button>
          <a className="flex items-center gap-3 px-3 py-2 text-slate-500 dark:text-slate-400 hover:text-slate-700 transition-colors cursor-pointer">
            <span className="material-symbols-outlined text-xl" data-icon="settings">settings</span>
            <span className="text-sm font-medium">Settings</span>
          </a>
          <a className="flex items-center gap-3 px-3 py-2 text-slate-500 dark:text-slate-400 hover:text-slate-700 transition-colors cursor-pointer">
            <span className="material-symbols-outlined text-xl" data-icon="help_outline">help_outline</span>
            <span className="text-sm font-medium">Support</span>
          </a>
          
          <div className="flex items-center gap-3 px-3 py-4 mt-4 border-t border-slate-200/50">
            <img alt="Executive Portrait" className="w-8 h-8 rounded-full bg-slate-200" src={profile?.avatar_url || "https://lh3.googleusercontent.com/aida-public/AB6AXuBPQzZ9gTuxRA6Yo5Ei03L-TDCBBHpy6gOjnhpUZEWUM4PCnBFhixPI_eNVR0nIlBb8w5MELdWfVwY2QIAYybxjPi7gJ-briiYeBRWeWNCxJZ6Vwx6kEKOYiRAlmR_SWfZM-ZEvK153nONu26cz4KaE4FyyOJjXfsG6QcLDIVVd19uVzt6XL_yQOLWDBlx5H6ubNgH7ey3K0vkkp_OjiyXoXw2yN67_SVgFk9Z0KJw0R74tOW5kx1HP3p9d_DbbM0AYpUGQAFoiAu31"} />
            <div className="overflow-hidden">
              <p className="text-xs font-bold text-slate-900 truncate">{profile?.full_name || 'Julian Sterling'}</p>
              <p className="text-[10px] text-slate-500 uppercase tracking-tighter">Managing Director</p>
            </div>
          </div>
        </div>
      </aside>

      {/* TopNavBar */}
      <header className="fixed top-0 right-0 w-[calc(100%-16rem)] h-16 z-40 bg-white/80 backdrop-blur-xl flex justify-between items-center px-10 border-b border-slate-200/15">
        <div className="flex items-center gap-4 flex-1">
          <div className="relative w-full max-w-md">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg" data-icon="search">search</span>
            <input className="w-full bg-surface-container-low border-none rounded-md py-2 pl-10 pr-4 text-sm focus:ring-1 focus:ring-primary" placeholder="Search operational intelligence..." type="text" />
          </div>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="flex gap-4 items-center">
            <button className="relative p-1 text-slate-500 hover:text-slate-950 transition-all cursor-pointer">
              <span className="material-symbols-outlined" data-icon="notifications">notifications</span>
              <span className="absolute top-1 right-1 w-2 h-2 bg-error rounded-full"></span>
            </button>
            <button className="p-1 text-slate-500 hover:text-slate-950 transition-all cursor-pointer">
              <span className="material-symbols-outlined" data-icon="settings">settings</span>
            </button>
          </div>
          <div className="h-8 w-[1px] bg-slate-200/50"></div>
          <div className="flex items-center gap-3">
            <span className="text-[0.6875rem] font-bold tracking-tighter text-slate-950 uppercase">Sovereign Intelligence</span>
            <img alt="CEO Profile" className="w-8 h-8 rounded-full bg-primary-container" src={profile?.avatar_url || "https://lh3.googleusercontent.com/aida-public/AB6AXuCAjeSE9-hMff7zcrPuhRXV7JctX-Lgg8m64ImyOTwG2fWm1Cflb_ypn8bb92EHAcVIKKpAm9rtiOb2ohTzWRAjKCj4F6AKEMNqo0fhxEy6tceQgZt1LSZ0otn3IXb_of2uMSwtkaaNGra7IkgKgr1HR0xohf5khuOeVMenihcqCbinYdlkIVYZh4Bdt8iWwmrsenBhrUodAXOJ1CxnFZ41hAI1WY0hw7gnN8guY33EtOM1adlZX-uL3eaYDrksbJr9nRQy3RM6XzbX"} />
          </div>
        </div>
      </header>

      {/* Main Content Canvas */}
      <main className="ml-64 mt-16 p-10 min-h-screen">
        {/* Dashboard Header */}
        <div className="flex justify-between items-end mb-10 cursor-default">
          <div>
            <p className="text-[0.6875rem] font-bold tracking-[0.15em] text-on-surface-variant uppercase mb-2">Operational Oversight</p>
            <h2 className="text-3xl font-extrabold font-headline tracking-tight text-on-surface">Staff Performance</h2>
            <div className="flex items-center gap-3 mt-2">
              <div className="flex items-center gap-1.5 text-tertiary-fixed-dim bg-tertiary-container px-2 py-0.5 rounded-full">
                <span className="w-1.5 h-1.5 bg-tertiary-fixed-dim rounded-full animate-pulse"></span>
                <span className="text-[10px] font-bold uppercase tracking-wider">Real-time Monitoring Active</span>
              </div>
              <span className="text-outline-variant text-xs font-medium">Intelligence Report — v4.12</span>
            </div>
          </div>
          <div className="flex gap-3">
            <button className="bg-surface-container-low text-on-surface-variant text-xs font-bold py-2.5 px-6 rounded-md uppercase tracking-wider hover:bg-surface-container-high transition-colors cursor-pointer">Export Log</button>
            <button className="bg-primary text-on-primary text-xs font-bold py-2.5 px-6 rounded-md uppercase tracking-wider hover:opacity-90 transition-opacity cursor-pointer">Adjust Thresholds</button>
          </div>
        </div>

        {/* Bento Layout Grid */}
        <div className="grid grid-cols-12 gap-6 items-start cursor-default">
          {/* Left Column: Performance Leaderboard */}
          <section className="col-span-8 space-y-6">
            <div className="bg-surface-container-lowest rounded-md p-8 shadow-sm">
              <div className="flex justify-between items-center mb-8">
                <h3 className="font-headline text-lg font-bold">Executive Performance Leaderboard</h3>
                <div className="flex gap-2 items-center">
                  <span className="text-[10px] font-bold uppercase bg-surface-container-low px-2 py-1 rounded text-on-surface-variant">Last 24 Hours</span>
                  <span className="material-symbols-outlined text-outline-variant cursor-pointer hover:text-primary transition-colors" data-icon="filter_list">filter_list</span>
                </div>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="text-left border-b border-outline-variant/10">
                      <th className="pb-4 text-[0.6875rem] font-bold uppercase tracking-widest text-on-surface-variant">Rank</th>
                      <th className="pb-4 text-[0.6875rem] font-bold uppercase tracking-widest text-on-surface-variant">Staff Member</th>
                      <th className="pb-4 text-[0.6875rem] font-bold uppercase tracking-widest text-on-surface-variant">Tasks</th>
                      <th className="pb-4 text-[0.6875rem] font-bold uppercase tracking-widest text-on-surface-variant">Accuracy</th>
                      <th className="pb-4 text-[0.6875rem] font-bold uppercase tracking-widest text-on-surface-variant text-center">Response</th>
                      <th className="pb-4 text-[0.6875rem] font-bold uppercase tracking-widest text-on-surface-variant text-right">Approvals</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-outline-variant/5">
                    {/* Row 1 */}
                    <tr className="group hover:bg-surface-container-low/30 transition-colors">
                      <td className="py-5 font-headline font-bold text-lg text-primary/40">01</td>
                      <td className="py-5">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded bg-primary-fixed flex items-center justify-center text-[10px] font-bold text-on-primary-fixed">EM</div>
                          <div>
                            <p className="text-sm font-bold text-on-surface leading-tight">Elena Moretti</p>
                            <p className="text-[10px] text-on-surface-variant uppercase">Senior Analyst</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-5 text-sm font-medium">142</td>
                      <td className="py-5">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-tertiary-fixed-dim">99.4%</span>
                          <div className="w-12 h-1 bg-surface-container-high rounded-full overflow-hidden">
                            <div className="h-full bg-tertiary-fixed-dim" style={{ width: '99%' }}></div>
                          </div>
                        </div>
                      </td>
                      <td className="py-5 text-sm font-medium text-center">4.2m</td>
                      <td className="py-5 text-right">
                        <span className="text-xs font-bold px-2 py-1 rounded-full bg-tertiary-fixed-dim/10 text-on-tertiary-fixed-variant">88% Auto</span>
                      </td>
                    </tr>
                    {/* Row 2 */}
                    <tr className="group hover:bg-surface-container-low/30 transition-colors">
                      <td className="py-5 font-headline font-bold text-lg text-primary/40">02</td>
                      <td className="py-5">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded bg-secondary-fixed flex items-center justify-center text-[10px] font-bold text-on-secondary-fixed">AK</div>
                          <div>
                            <p className="text-sm font-bold text-on-surface leading-tight">Arjun Kapoor</p>
                            <p className="text-[10px] text-on-surface-variant uppercase">Verification Lead</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-5 text-sm font-medium">128</td>
                      <td className="py-5">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-tertiary-fixed-dim">98.2%</span>
                          <div className="w-12 h-1 bg-surface-container-high rounded-full overflow-hidden">
                            <div className="h-full bg-tertiary-fixed-dim" style={{ width: '98%' }}></div>
                          </div>
                        </div>
                      </td>
                      <td className="py-5 text-sm font-medium text-center">5.8m</td>
                      <td className="py-5 text-right">
                        <span className="text-xs font-bold px-2 py-1 rounded-full bg-tertiary-fixed-dim/10 text-on-tertiary-fixed-variant">72% Auto</span>
                      </td>
                    </tr>
                    {/* Row 3 */}
                    <tr className="group hover:bg-surface-container-low/30 transition-colors">
                      <td className="py-5 font-headline font-bold text-lg text-primary/40">03</td>
                      <td className="py-5">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded bg-surface-container-highest flex items-center justify-center text-[10px] font-bold">SW</div>
                          <div>
                            <p className="text-sm font-bold text-on-surface leading-tight">Sarah Williams</p>
                            <p className="text-[10px] text-on-surface-variant uppercase">Risk Assessor</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-5 text-sm font-medium">115</td>
                      <td className="py-5">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-on-surface-variant">94.1%</span>
                          <div className="w-12 h-1 bg-surface-container-high rounded-full overflow-hidden">
                            <div className="h-full bg-outline-variant" style={{ width: '94%' }}></div>
                          </div>
                        </div>
                      </td>
                      <td className="py-5 text-sm font-medium text-center">6.1m</td>
                      <td className="py-5 text-right">
                        <span className="text-xs font-bold px-2 py-1 rounded-full bg-outline-variant/10 text-on-surface-variant">64% Auto</span>
                      </td>
                    </tr>
                    {/* Row 4 */}
                    <tr className="group hover:bg-surface-container-low/30 transition-colors">
                      <td className="py-5 font-headline font-bold text-lg text-primary/40">04</td>
                      <td className="py-5">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded bg-surface-container-highest flex items-center justify-center text-[10px] font-bold">TC</div>
                          <div>
                            <p className="text-sm font-bold text-on-surface leading-tight">Tom Chen</p>
                            <p className="text-[10px] text-on-surface-variant uppercase">Ops Associate</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-5 text-sm font-medium">102</td>
                      <td className="py-5">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-on-surface-variant">92.8%</span>
                          <div className="w-12 h-1 bg-surface-container-high rounded-full overflow-hidden">
                            <div className="h-full bg-outline-variant" style={{ width: '92%' }}></div>
                          </div>
                        </div>
                      </td>
                      <td className="py-5 text-sm font-medium text-center">8.4m</td>
                      <td className="py-5 text-right">
                        <span className="text-xs font-bold px-2 py-1 rounded-full bg-outline-variant/10 text-on-surface-variant">51% Auto</span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* SLA Compliance Tracker */}
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-surface-container-low rounded-md p-6 shadow-sm">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <p className="text-[0.6875rem] font-bold uppercase tracking-widest text-on-surface-variant">Response SLA</p>
                    <h4 className="text-2xl font-black font-headline mt-1 text-on-surface">94.2%</h4>
                  </div>
                  <span className="material-symbols-outlined text-tertiary-fixed-dim" data-icon="timer">timer</span>
                </div>
                <div className="h-2 w-full bg-surface-container-high rounded-full overflow-hidden">
                  <div className="h-full bg-primary" style={{ width: '94.2%' }}></div>
                </div>
                <div className="flex justify-between mt-3 text-[10px] font-bold uppercase text-on-surface-variant">
                  <span>Target: 90%</span>
                  <span className="text-tertiary-fixed-dim">+4.2% Above</span>
                </div>
              </div>

              <div className="bg-surface-container-low rounded-md p-6 shadow-sm">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <p className="text-[0.6875rem] font-bold uppercase tracking-widest text-on-surface-variant">Accuracy SLA</p>
                    <h4 className="text-2xl font-black font-headline mt-1 text-on-surface">97.8%</h4>
                  </div>
                  <span className="material-symbols-outlined text-tertiary-fixed-dim" data-icon="verified_user">verified_user</span>
                </div>
                <div className="h-2 w-full bg-surface-container-high rounded-full overflow-hidden">
                  <div className="h-full bg-primary" style={{ width: '97.8%' }}></div>
                </div>
                <div className="flex justify-between mt-3 text-[10px] font-bold uppercase text-on-surface-variant">
                  <span>Target: 98%</span>
                  <span className="text-error">-0.2% Under</span>
                </div>
              </div>
            </div>
          </section>

          {/* Right Column: Monitoring & Alerts */}
          <section className="col-span-4 space-y-6">
            {/* Idle Alerts */}
            <div className="bg-error-container rounded-md p-6 border border-error/5 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <span className="material-symbols-outlined text-error" data-icon="warning">warning</span>
                <h3 className="text-xs font-bold uppercase tracking-widest text-on-error-container">Critical Idle Alerts</h3>
              </div>
              <div className="space-y-3">
                <div className="bg-white/40 p-3 rounded flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-error flex items-center justify-center text-white cursor-default">
                      <span className="material-symbols-outlined text-sm" data-icon="person_off">person_off</span>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-on-error-container">Marcus V.</p>
                      <p className="text-[10px] text-error">Idle &gt; 45 mins</p>
                    </div>
                  </div>
                  <button className="bg-error text-white text-[10px] font-bold px-3 py-1.5 rounded uppercase cursor-pointer hover:opacity-90">Ping</button>
                </div>
                
                <div className="bg-white/40 p-3 rounded flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-error flex items-center justify-center text-white cursor-default">
                      <span className="material-symbols-outlined text-sm" data-icon="schedule">schedule</span>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-on-error-container">Batch #902</p>
                      <p className="text-[10px] text-error">SLA Violation Imminent</p>
                    </div>
                  </div>
                  <button className="bg-error text-white text-[10px] font-bold px-3 py-1.5 rounded uppercase cursor-pointer hover:opacity-90">Reassign</button>
                </div>
              </div>
            </div>

            {/* Audit Log Stream */}
            <div className="bg-surface-container-lowest shadow-sm rounded-md flex flex-col h-[500px]">
              <div className="p-6 border-b border-outline-variant/10">
                <h3 className="font-headline text-sm font-bold uppercase tracking-widest">Real-time Audit Stream</h3>
              </div>
              
              <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-6">
                {/* Log Item */}
                <div className="relative pl-6 border-l border-outline-variant/30 pb-2">
                  <div className="absolute -left-[5px] top-0 w-2 h-2 rounded-full bg-primary"></div>
                  <div className="flex justify-between items-start mb-1">
                    <p className="text-[10px] font-black uppercase tracking-tighter text-on-surface">Compliance Override</p>
                    <span className="text-[10px] text-on-surface-variant">14:22:01</span>
                  </div>
                  <p className="text-xs text-on-surface-variant leading-relaxed">User <span className="text-primary font-bold">EMORETTI</span> executed high-level override on Module ID: <span className="font-mono">AUTH_9921</span></p>
                  <div className="mt-2 flex gap-2">
                    <span className="text-[9px] font-bold px-2 py-0.5 bg-surface-container-low text-on-surface-variant rounded">SYS_AUTH</span>
                    <span className="text-[9px] font-bold px-2 py-0.5 bg-surface-container-low text-on-surface-variant rounded">LVL_4</span>
                  </div>
                </div>

                {/* Log Item */}
                <div className="relative pl-6 border-l border-outline-variant/30 pb-2">
                  <div className="absolute -left-[5px] top-0 w-2 h-2 rounded-full bg-tertiary-fixed-dim"></div>
                  <div className="flex justify-between items-start mb-1">
                    <p className="text-[10px] font-black uppercase tracking-tighter text-on-surface">Batch Approval</p>
                    <span className="text-[10px] text-on-surface-variant">14:21:44</span>
                  </div>
                  <p className="text-xs text-on-surface-variant leading-relaxed">User <span className="text-primary font-bold">AKAPOOR</span> approved bulk verification request (24 entries) in Module: <span className="font-mono">KYC_GLOBAL</span></p>
                </div>

                {/* Log Item */}
                <div className="relative pl-6 border-l border-outline-variant/30 pb-2">
                  <div className="absolute -left-[5px] top-0 w-2 h-2 rounded-full bg-outline-variant"></div>
                  <div className="flex justify-between items-start mb-1">
                    <p className="text-[10px] font-black uppercase tracking-tighter text-on-surface">Standard Session</p>
                    <span className="text-[10px] text-on-surface-variant">14:19:30</span>
                  </div>
                  <p className="text-xs text-on-surface-variant leading-relaxed">User <span className="text-primary font-bold">SWILLIAMS</span> initiated secure session tunnel. Module: <span className="font-mono">LEDGER_MGT</span></p>
                </div>

                {/* Log Item */}
                <div className="relative pl-6 border-l border-outline-variant/30 pb-2">
                  <div className="absolute -left-[5px] top-0 w-2 h-2 rounded-full bg-error"></div>
                  <div className="flex justify-between items-start mb-1">
                    <p className="text-[10px] font-black uppercase tracking-tighter text-on-surface">Security Alert</p>
                    <span className="text-[10px] text-on-surface-variant">14:18:12</span>
                  </div>
                  <p className="text-xs text-on-surface-variant leading-relaxed">Multiple failed access attempts detected for User ID: <span className="font-mono">MVANCE_9</span>. Geographic mismatch.</p>
                  <div className="mt-2">
                    <span className="text-[9px] font-bold px-2 py-0.5 bg-error-container text-on-error-container rounded">CRITICAL_BLOCKED</span>
                  </div>
                </div>

                {/* Log Item */}
                <div className="relative pl-6 border-l border-outline-variant/30 pb-2">
                  <div className="absolute -left-[5px] top-0 w-2 h-2 rounded-full bg-primary"></div>
                  <div className="flex justify-between items-start mb-1">
                    <p className="text-[10px] font-black uppercase tracking-tighter text-on-surface">Data Export</p>
                    <span className="text-[10px] text-on-surface-variant">14:15:05</span>
                  </div>
                  <p className="text-xs text-on-surface-variant leading-relaxed">User <span className="text-primary font-bold">EMORETTI</span> exported 'Q3_Performance_Raw.csv' to secure vault.</p>
                </div>
              </div>
              
              <div className="p-4 bg-surface-container-low text-center border-t border-outline-variant/10">
                <button className="text-[10px] font-bold uppercase text-primary tracking-widest hover:underline cursor-pointer">View Full Historical Audit</button>
              </div>
            </div>
          </section>
        </div>

        {/* Footer / Global Stats */}
        <footer className="mt-12 flex justify-between items-center text-[10px] font-bold uppercase tracking-[0.2em] text-outline-variant border-t border-outline-variant/10 pt-6 cursor-default">
          <div className="flex gap-8">
            <div className="flex gap-2 items-center">
              <span className="w-2 h-2 rounded-full bg-tertiary-fixed-dim"></span>
              <span>System Latency: 12ms</span>
            </div>
            <div className="flex gap-2 items-center">
              <span className="w-2 h-2 rounded-full bg-tertiary-fixed-dim"></span>
              <span>Load Balancing: Optimal</span>
            </div>
          </div>
          <div>
              Sovereign Executive Dashboards — Precise Operational Analytics
          </div>
        </footer>
      </main>
    </div>
  );
}
