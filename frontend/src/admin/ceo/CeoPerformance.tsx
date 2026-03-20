import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { 
  PieChart, Wallet, Users, Activity, TrendingUp, 
  Settings, HelpCircle, Search, Bell, PlusCircle, 
  Filter, Timer, ShieldCheck, AlertTriangle, UserX,
  RefreshCw, LockKeyhole, Download, Unlock, CheckCircle2
} from 'lucide-react';

export default function CeoPerformance() {
  const { profile } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const NavLink = ({ to, icon: Icon, label }: { to: string, icon: any, label: string }) => (
    <Link 
      to={to} 
      className={`flex items-center gap-3 py-2.5 px-3 rounded-xl transition-all duration-300 ${isActive(to) ? 'bg-[var(--color-primary-light)] text-[var(--color-primary)] font-bold' : 'text-slate-500 hover:bg-[var(--color-primary-light)] hover:text-[var(--color-primary)] font-medium'}`}
    >
      <Icon size={18} />
      <span className="text-sm">{label}</span>
    </Link>
  );

  return (
    <div className="bg-[var(--color-primary-faint)] font-inter text-slate-900 min-h-screen pb-12">
      
      {/* SideNavBar */}
      <aside className="bg-white border-r border-[var(--color-primary-light)] h-screen w-64 fixed left-0 top-0 overflow-y-auto flex flex-col py-8 px-6 z-50">
        <div className="mb-10">
          <img src="/welile-colored.png" alt="Welile Logo" className="h-[40px] w-auto mb-1" />
        </div>
        
        <nav className="flex-1 space-y-2">
          <NavLink to="/ceo/dashboard" icon={PieChart} label="Overview" />
          <NavLink to="/ceo/revenue" icon={Wallet} label="Revenue" />
          <NavLink to="/ceo/users" icon={Users} label="Users" />
          <NavLink to="/ceo/financials" icon={Activity} label="Financials" />
          <NavLink to="/ceo/performance" icon={TrendingUp} label="Performance" />
        </nav>
        
        <div className="mt-auto space-y-2">
          <select 
            className="w-full bg-[var(--color-primary)] text-[var(--color-on-primary)] py-3 px-4 rounded-xl text-sm font-bold hover:bg-[var(--color-primary-dark)] active:bg-[var(--color-primary-darker)] transition-all mb-6 appearance-none cursor-pointer text-center outline-none shadow-sm"
            onChange={(e) => {
              if (e.target.value) navigate(e.target.value);
            }}
            defaultValue=""
          >
            <option value="" disabled>Switch Dashboard</option>
            <option value="/ceo/dashboard">CEO Dashboard</option>
            <option value="/coo/dashboard">COO Dashboard (View Only)</option>
            <option value="/cfo/dashboard">CFO Dashboard (View Only)</option>
          </select>
          <a className="flex items-center gap-3 px-3 py-2 rounded-xl text-slate-500 hover:bg-slate-50 hover:text-slate-900 transition-colors cursor-pointer">
            <Settings size={18} />
            <span className="text-sm font-medium">Settings</span>
          </a>
          <a className="flex items-center gap-3 px-3 py-2 rounded-xl text-slate-500 hover:bg-slate-50 hover:text-slate-900 transition-colors cursor-pointer">
            <HelpCircle size={18} />
            <span className="text-sm font-medium">Support</span>
          </a>
          
          <div className="flex items-center gap-3 px-3 pt-6 pb-2 mt-4 border-t border-[var(--color-primary-light)]">
            <img alt="Executive Portrait" className="w-10 h-10 rounded-full border-2 border-[var(--color-primary-light)] object-cover" src={profile?.avatar_url || "https://lh3.googleusercontent.com/aida-public/AB6AXuBPQzZ9gTuxRA6Yo5Ei03L-TDCBBHpy6gOjnhpUZEWUM4PCnBFhixPI_eNVR0nIlBb8w5MELdWfVwY2QIAYybxjPi7gJ-briiYeBRWeWNCxJZ6Vwx6kEKOYiRAlmR_SWfZM-ZEvK153nONu26cz4KaE4FyyOJjXfsG6QcLDIVVd19uVzt6XL_yQOLWDBlx5H6ubNgH7ey3K0vkkp_OjiyXoXw2yN67_SVgFk9Z0KJw0R74tOW5kx1HP3p9d_DbbM0AYpUGQAFoiAu31"} />
            <div className="overflow-hidden">
              <p className="text-xs font-bold text-[var(--color-primary-darker)] truncate uppercase mt-0.5">{profile?.full_name || 'Julian Sterling'}</p>
              <p className="text-[10px] text-[var(--color-primary)] font-bold uppercase tracking-widest mt-0.5">Managing Director</p>
            </div>
          </div>
        </div>
      </aside>

      {/* TopNavBar */}
      <header className="fixed top-0 right-0 w-[calc(100%-16rem)] h-20 z-40 bg-white/80 backdrop-blur-xl flex justify-between items-center px-10 border-b border-[var(--color-primary-light)]">
        <div className="flex items-center w-full max-w-md">
          <div className="relative w-full">
            <Search size={18} className="text-[var(--color-primary)] absolute left-4 top-1/2 -translate-y-1/2" />
            <input className="w-full bg-[var(--color-primary-faint)] border border-[var(--color-primary-light)] rounded-full py-2.5 pl-11 pr-4 text-sm focus:ring-2 focus:ring-[var(--color-primary-light)] focus:bg-white transition-all outline-none" placeholder="Search operational intelligence..." type="text" />
          </div>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="flex gap-4 items-center">
            <button className="relative p-2 text-[var(--color-primary)] hover:text-[var(--color-primary-darker)] bg-[var(--color-primary-faint)] hover:bg-[var(--color-primary-light)] rounded-full transition-all cursor-pointer">
              <Bell size={20} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <button className="p-2 text-[var(--color-primary)] hover:text-[var(--color-primary-darker)] bg-[var(--color-primary-faint)] hover:bg-[var(--color-primary-light)] rounded-full transition-all cursor-pointer">
              <Settings size={20} />
            </button>
          </div>
          <div className="h-8 w-px bg-[var(--color-primary-light)] mx-2"></div>
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold tracking-tighter text-[var(--color-primary-darker)] uppercase"></span>
          </div>
        </div>
      </header>

      {/* Main Content Canvas */}
      <main className="ml-64 pt-28 px-10 max-w-screen-2xl mx-auto">
        {/* Dashboard Header */}
        <div className="flex justify-between items-end mb-8 cursor-default">
          <div>
            <p className="text-[0.6875rem] font-bold tracking-[0.15em] text-[var(--color-primary)] uppercase mb-2">Operational Oversight</p>
            <h2 className="text-4xl font-bold font-outfit tracking-tight text-slate-900">Staff Performance</h2>
            <div className="flex items-center gap-3 mt-3">
              <div className="flex items-center gap-2 text-[#0284c7] bg-[#e0f2fe] px-3 py-1 rounded-full font-bold">
                <span className="w-2 h-2 bg-[#0284c7] rounded-full animate-pulse"></span>
                <span className="text-[10px] uppercase tracking-wider">Real-time Monitoring Active</span>
              </div>
              <span className="text-slate-400 text-xs font-bold uppercase tracking-widest">Intelligence Report — v4.12</span>
            </div>
          </div>
          <div className="flex gap-3">
            <button className="bg-white border border-[var(--color-primary-light)] text-[var(--color-primary)] text-xs font-bold py-2.5 px-6 rounded-full uppercase tracking-widest hover:bg-[var(--color-primary-faint)] transition-colors shadow-sm cursor-pointer flex items-center gap-2">
              <Download size={16} />
              Export Log
            </button>
            <button className="bg-[var(--color-primary)] text-[var(--color-on-primary)] text-xs font-bold py-2.5 px-6 rounded-full uppercase tracking-widest hover:bg-[var(--color-primary-dark)] transition-colors shadow-sm cursor-pointer flex items-center gap-2">
              <Settings size={16} />
              Adjust Thresholds
            </button>
          </div>
        </div>

        {/* Bento Layout Grid */}
        <div className="grid grid-cols-12 gap-6 items-start cursor-default">
          {/* Left Column: Performance Leaderboard */}
          <section className="col-span-12 lg:col-span-8 space-y-6">
            <div className="bg-white rounded-3xl p-8 border border-[var(--color-primary-light)] shadow-sm">
              <div className="flex justify-between items-center mb-8">
                <h3 className="font-outfit text-xl font-bold text-[var(--color-primary-darker)]">Executive Leaderboard</h3>
                <div className="flex gap-3 items-center">
                  <span className="text-[10px] font-bold uppercase bg-[var(--color-primary-faint)] border border-[var(--color-primary-light)] px-3 py-1.5 rounded-lg text-[var(--color-primary)]">Last 24 Hours</span>
                  <button className="p-2 text-slate-400 hover:text-[var(--color-primary)] hover:bg-[var(--color-primary-faint)] rounded-lg transition-colors cursor-pointer border border-transparent hover:border-[var(--color-primary-light)] flex items-center justify-center">
                    <Filter size={18} />
                  </button>
                </div>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-[var(--color-primary-light)]">
                      <th className="pb-4 text-xs font-bold uppercase tracking-widest text-[var(--color-primary)]">Rank</th>
                      <th className="pb-4 text-xs font-bold uppercase tracking-widest text-[var(--color-primary)]">Staff Member</th>
                      <th className="pb-4 text-xs font-bold uppercase tracking-widest text-[var(--color-primary)]">Tasks</th>
                      <th className="pb-4 text-xs font-bold uppercase tracking-widest text-[var(--color-primary)]">Accuracy</th>
                      <th className="pb-4 text-xs font-bold uppercase tracking-widest text-[var(--color-primary)] text-center">Response</th>
                      <th className="pb-4 text-xs font-bold uppercase tracking-widest text-[var(--color-primary)] text-right">Approvals</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--color-primary-faint)]">
                    {/* Row 1 */}
                    <tr className="group hover:bg-[var(--color-primary-faint)] transition-colors">
                      <td className="py-5 font-outfit font-bold text-lg text-slate-400">01</td>
                      <td className="py-5">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-[var(--color-primary-light)] flex items-center justify-center text-xs font-bold text-[var(--color-primary)]">EM</div>
                          <div>
                            <p className="text-sm font-bold text-slate-900 leading-tight">Elena Moretti</p>
                            <p className="text-[10px] text-slate-500 font-bold uppercase mt-1">Senior Analyst</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-5 text-sm font-bold text-slate-700">142</td>
                      <td className="py-5">
                        <div className="flex flex-col gap-1.5">
                          <span className="text-sm font-bold text-[var(--color-success)]">99.4%</span>
                          <div className="w-16 h-1.5 bg-[#dcfce7] rounded-full overflow-hidden border border-[#bbf7d0]">
                            <div className="h-full bg-[var(--color-success)]" style={{ width: '99%' }}></div>
                          </div>
                        </div>
                      </td>
                      <td className="py-5 text-sm font-bold text-slate-700 text-center">4.2m</td>
                      <td className="py-5 text-right">
                        <span className="text-xs font-bold px-3 py-1.5 rounded-lg bg-[var(--color-primary-light)] text-[var(--color-primary)]">88% Auto</span>
                      </td>
                    </tr>
                    {/* Row 2 */}
                    <tr className="group hover:bg-[var(--color-primary-faint)] transition-colors">
                      <td className="py-5 font-outfit font-bold text-lg text-slate-400">02</td>
                      <td className="py-5">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-[#e0f2fe] flex items-center justify-center text-xs font-bold text-[#0284c7]">AK</div>
                          <div>
                            <p className="text-sm font-bold text-slate-900 leading-tight">Arjun Kapoor</p>
                            <p className="text-[10px] text-slate-500 font-bold uppercase mt-1">Verification Lead</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-5 text-sm font-bold text-slate-700">128</td>
                      <td className="py-5">
                        <div className="flex flex-col gap-1.5">
                          <span className="text-sm font-bold text-[var(--color-success)]">98.2%</span>
                          <div className="w-16 h-1.5 bg-[#dcfce7] rounded-full overflow-hidden border border-[#bbf7d0]">
                            <div className="h-full bg-[var(--color-success)]" style={{ width: '98%' }}></div>
                          </div>
                        </div>
                      </td>
                      <td className="py-5 text-sm font-bold text-slate-700 text-center">5.8m</td>
                      <td className="py-5 text-right">
                        <span className="text-xs font-bold px-3 py-1.5 rounded-lg bg-[var(--color-primary-light)] text-[var(--color-primary)]">72% Auto</span>
                      </td>
                    </tr>
                    {/* Row 3 */}
                    <tr className="group hover:bg-[var(--color-primary-faint)] transition-colors">
                      <td className="py-5 font-outfit font-bold text-lg text-slate-400">03</td>
                      <td className="py-5">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-600">SW</div>
                          <div>
                            <p className="text-sm font-bold text-slate-900 leading-tight">Sarah Williams</p>
                            <p className="text-[10px] text-slate-500 font-bold uppercase mt-1">Risk Assessor</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-5 text-sm font-bold text-slate-700">115</td>
                      <td className="py-5">
                        <div className="flex flex-col gap-1.5">
                          <span className="text-sm font-bold text-[#f59e0b]">94.1%</span>
                          <div className="w-16 h-1.5 bg-[#fef3c7] rounded-full overflow-hidden border border-[#fde68a]">
                            <div className="h-full bg-[#f59e0b]" style={{ width: '94%' }}></div>
                          </div>
                        </div>
                      </td>
                      <td className="py-5 text-sm font-bold text-slate-700 text-center">6.1m</td>
                      <td className="py-5 text-right">
                        <span className="text-xs font-bold px-3 py-1.5 rounded-lg bg-slate-100 text-slate-600">64% Auto</span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* SLA Compliance Tracker */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white border border-[var(--color-primary-light)] rounded-3xl p-6 shadow-sm">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-[var(--color-primary)]">Response SLA</p>
                    <h4 className="text-3xl font-bold font-outfit mt-2 text-slate-900">94.2%</h4>
                  </div>
                  <div className="p-2 bg-[#e0f2fe] text-[#0284c7] rounded-full">
                    <Timer size={20} />
                  </div>
                </div>
                <div className="h-2 w-full bg-[var(--color-primary-faint)] border border-[var(--color-primary-light)] rounded-full overflow-hidden">
                  <div className="h-full bg-[#0284c7]" style={{ width: '94.2%' }}></div>
                </div>
                <div className="flex justify-between mt-4 text-[10px] font-bold uppercase text-slate-500">
                  <span>Target: 90%</span>
                  <span className="text-[#0284c7] bg-[#e0f2fe] px-2 py-0.5 rounded-md">+4.2% Above</span>
                </div>
              </div>

              <div className="bg-white border border-[var(--color-primary-light)] rounded-3xl p-6 shadow-sm">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-[var(--color-primary)]">Accuracy SLA</p>
                    <h4 className="text-3xl font-bold font-outfit mt-2 text-[var(--color-primary-darker)]">97.8%</h4>
                  </div>
                  <div className="p-2 bg-[var(--color-primary-light)] text-[var(--color-primary)] rounded-full">
                    <ShieldCheck size={20} />
                  </div>
                </div>
                <div className="h-2 w-full bg-[var(--color-primary-faint)] border border-[var(--color-primary-light)] rounded-full overflow-hidden">
                  <div className="h-full bg-[var(--color-primary)]" style={{ width: '97.8%' }}></div>
                </div>
                <div className="flex justify-between mt-4 text-[10px] font-bold uppercase text-[var(--color-primary)]">
                  <span>Target: 98%</span>
                  <span className="text-[var(--color-warning)] bg-[var(--color-warning-bg)] px-2 py-0.5 rounded-md">-0.2% Under</span>
                </div>
              </div>
            </div>
          </section>

          {/* Right Column: Monitoring & Alerts */}
          <section className="col-span-12 lg:col-span-4 space-y-6">
            {/* Idle Alerts */}
            <div className="bg-white rounded-3xl p-6 border-2 border-[var(--color-warning-border)] shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-[var(--color-warning-bg)] rounded-bl-full -mr-4 -mt-4"></div>
              <div className="flex items-center gap-3 mb-6 relative z-10">
                <div className="p-2 bg-[var(--color-warning-bg)] text-[var(--color-warning)] rounded-full">
                  <AlertTriangle size={18} />
                </div>
                <h3 className="text-sm font-bold uppercase tracking-widest text-[var(--color-warning)]">Critical Alerts</h3>
              </div>
              <div className="space-y-3 relative z-10">
                <div className="bg-slate-50 border border-red-100 p-4 rounded-2xl flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-red-600 cursor-default">
                      <UserX size={18} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-800">Marcus V.</p>
                      <p className="text-[10px] font-bold text-red-500 uppercase tracking-wider mt-0.5">Idle &gt; 45 mins</p>
                    </div>
                  </div>
                  <button className="bg-red-50 text-red-600 border border-red-100 text-[10px] font-bold px-4 py-2 rounded-lg uppercase cursor-pointer hover:bg-red-100 transition-colors">Ping</button>
                </div>
                
                <div className="bg-[var(--color-warning-bg)] border border-[var(--color-warning-border)] p-4 rounded-2xl flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#fef3c7] flex items-center justify-center text-[var(--color-warning)] cursor-default">
                      <Timer size={18} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-800">Batch #902</p>
                      <p className="text-[10px] font-bold text-[var(--color-warning)] uppercase tracking-wider mt-0.5">SLA Risk</p>
                    </div>
                  </div>
                  <button className="bg-white text-[var(--color-warning)] border border-[var(--color-warning-border)] text-[10px] font-bold px-4 py-2 rounded-lg uppercase cursor-pointer hover:bg-[#fef3c7] transition-colors">Reassign</button>
                </div>
              </div>
            </div>

            {/* Audit Log Stream */}
            <div className="bg-white border border-[var(--color-primary-light)] shadow-sm rounded-3xl flex flex-col h-[500px]">
              <div className="p-6 border-b border-[var(--color-primary-light)] flex justify-between items-center bg-[var(--color-primary-faint)] rounded-t-3xl">
                <h3 className="font-outfit text-lg font-bold text-[var(--color-primary-darker)]">Real-time Stream</h3>
                <RefreshCw size={16} className="text-[var(--color-primary)] cursor-pointer" />
              </div>
              
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {/* Log Item */}
                <div className="relative pl-6 border-l-2 border-[var(--color-primary-light)] pb-2">
                  <div className="absolute -left-[5px] top-0.5 w-2 h-2 rounded-full bg-[#1a1a1a]"></div>
                  <div className="flex justify-between items-start mb-1">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-800 flex items-center gap-1">
                      <Unlock size={10} /> Compliance Override
                    </p>
                    <span className="text-[10px] font-bold text-[var(--color-primary)]">14:22</span>
                  </div>
                  <p className="text-sm text-slate-500 leading-relaxed mt-2">User <span className="text-slate-900 font-bold">EMORETTI</span> executed override on Module: <span className="font-mono bg-[var(--color-primary-faint)] border border-[var(--color-primary-light)] px-1 py-0.5 rounded text-xs text-[var(--color-primary-darker)] font-bold">AUTH_91</span></p>
                </div>

                {/* Log Item */}
                <div className="relative pl-6 border-l-2 border-[var(--color-primary-light)] pb-2">
                  <div className="absolute -left-[5px] top-0.5 w-2 h-2 rounded-full bg-[var(--color-success)]"></div>
                  <div className="flex justify-between items-start mb-1">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--color-success)] flex items-center gap-1">
                      <CheckCircle2 size={10} /> Batch Approval
                    </p>
                    <span className="text-[10px] font-bold text-[var(--color-primary)]">14:21</span>
                  </div>
                  <p className="text-sm text-slate-500 leading-relaxed mt-2">User <span className="text-slate-900 font-bold">AKAPOOR</span> approved bulk verification request.</p>
                </div>

                {/* Log Item */}
                <div className="relative pl-6 border-l-2 border-[var(--color-primary-light)] pb-2">
                  <div className="absolute -left-[5px] top-0.5 w-2 h-2 rounded-full bg-slate-300"></div>
                  <div className="flex justify-between items-start mb-1">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 flex items-center gap-1">
                      <LockKeyhole size={10} /> Standard Session
                    </p>
                    <span className="text-[10px] font-bold text-[var(--color-primary)]">14:19</span>
                  </div>
                  <p className="text-sm text-slate-500 leading-relaxed mt-2">User <span className="text-slate-900 font-bold">SWILLIAMS</span> initiated secure tunnel.</p>
                </div>

                {/* Log Item */}
                <div className="relative pl-6 border-l-2 border-[var(--color-primary-light)] pb-2">
                  <div className="absolute -left-[5px] top-0.5 w-2 h-2 rounded-full bg-[var(--color-warning)]"></div>
                  <div className="flex justify-between items-start mb-1">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--color-warning)] flex items-center gap-1">
                      <AlertTriangle size={10} /> Security Alert
                    </p>
                    <span className="text-[10px] font-bold text-[var(--color-primary)]">14:18</span>
                  </div>
                  <p className="text-sm text-slate-500 leading-relaxed mt-2">Multiple failed access attempts. Geo-mismatch.</p>
                </div>
              </div>
              
              <div className="p-4 bg-[var(--color-primary-faint)] text-center border-t border-[var(--color-primary-light)] rounded-b-3xl">
                <button className="text-[10px] font-bold uppercase text-[var(--color-primary)] tracking-widest hover:underline cursor-pointer">View Historical Audit</button>
              </div>
            </div>
          </section>
        </div>

        {/* Footer / Global Stats */}
        <footer className="mt-12 flex justify-between items-center text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--color-primary)] border-t border-[var(--color-primary-light)] pt-8 pb-4 cursor-default">
          <div className="flex gap-8">
            <div className="flex gap-2 items-center">
              <span className="w-2 h-2 rounded-full bg-[var(--color-success)]"></span>
              <span>Latency: 12ms</span>
            </div>
            <div className="flex gap-2 items-center">
              <span className="w-2 h-2 rounded-full bg-[var(--color-success)]"></span>
              <span>Nodes Optimal</span>
            </div>
          </div>
          <div className="text-[var(--color-primary-darker)]">
              Sovereign Executive Dashboards
          </div>
        </footer>
      </main>
    </div>
  );
}
