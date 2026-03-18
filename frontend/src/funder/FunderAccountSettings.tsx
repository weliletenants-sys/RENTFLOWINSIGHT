import { useState } from 'react';
import { 
  ShieldCheck, 
  Smartphone, 
  Lock, 
  Landmark, 
  Clock, 
  Users, 
  FileText, 
  Download,
  Fingerprint,
  Activity,
  LogOut,
  ShieldAlert,
  UserCheck,
  CheckCircle2,
  Circle
} from 'lucide-react';

import FunderSidebar from './components/FunderSidebar';
import FunderBottomNav from './components/FunderBottomNav';
import FunderDashboardHeader from './components/FunderDashboardHeader';

export default function FunderAccountSettings() {
  const [activeTab, setActiveTab] = useState<'security' | 'financial' | 'proxy' | 'reporting'>('security');
  const [newPassword, setNewPassword] = useState('');

  const passwordCriteria = [
    { label: 'At least 8 characters', met: newPassword.length >= 8 },
    { label: 'Contains a number', met: /\d/.test(newPassword) },
    { label: 'Contains an uppercase letter', met: /[A-Z]/.test(newPassword) },
    { label: 'Contains a special character', met: /[^A-Za-z0-9]/.test(newPassword) },
  ];

  return (
    <div className="min-h-screen font-sans" style={{ background: 'var(--color-primary-faint)' }}>
      <div className="flex h-screen overflow-hidden">
        
        {/* SIDEBAR */}
        <FunderSidebar activePage="Settings" />

        {/* MAIN CONTENT AREA */}
        <div className="flex-1 flex flex-col min-h-screen overflow-y-auto relative">
          
          <FunderDashboardHeader
            user={{ fullName: 'Grace N.', role: 'supporter', avatarUrl: '' }}
            pageTitle="Account Settings"
            onAvatarClick={() => {}}
          />

          <main className="flex-1 pb-32 lg:pb-12">
            
            {/* ──────────────── HEADER ──────────────── */}
            <div 
              className="w-full h-[240px] sm:h-[280px] relative px-6 sm:px-12 pt-8"
              style={{
                background: 'linear-gradient(135deg, var(--color-primary-dark) 0%, var(--color-primary) 100%)',
                boxShadow: '0 4px 24px var(--color-primary-shadow)'
              }}
            >
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5 pointer-events-none mix-blend-overlay"></div>
              <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none"></div>

              <div className="relative z-10 max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 h-full">
                <div className="flex items-center gap-6">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-white border-4 border-white/20 shadow-2xl flex items-center justify-center overflow-hidden flex-shrink-0">
                     <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Grace&backgroundColor=059669" alt="Avatar" className="w-full h-full object-cover" />
                  </div>
                  <div className="text-center md:text-left">
                    <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight drop-shadow-sm mb-1">
                      Grace N.
                    </h1>
                    <div className="flex items-center justify-center md:justify-start gap-3">
                      <span className="bg-white/20 text-white border border-white/30 px-3 py-1 rounded-full text-xs font-bold tracking-widest uppercase backdrop-blur-md">
                        SUPPORTER
                      </span>
                      <span className="flex items-center gap-1.5 text-emerald-100 text-sm font-semibold">
                        <ShieldCheck className="w-4 h-4 text-emerald-300" />
                        Grade-A Verified
                      </span>
                    </div>
                  </div>
                </div>

                {/* Quick Metrics */}
                <div className="hidden md:flex gap-4">
                  <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl px-6 py-4 text-white text-center shadow-lg">
                    <p className="text-white/60 text-xs font-bold tracking-widest uppercase mb-1">Active Capital</p>
                    <p className="text-2xl font-black">UGX 5.0M</p>
                  </div>
                  <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl px-6 py-4 text-white text-center shadow-lg">
                    <p className="text-white/60 text-xs font-bold tracking-widest uppercase mb-1">Status</p>
                    <p className="text-2xl font-black text-emerald-300 flex items-center justify-center gap-2">
                      <ShieldCheck className="w-5 h-5" /> Secured
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* ──────────────── CONTENT ──────────────── */}
            <div className="max-w-5xl mx-auto px-4 sm:px-6 -mt-8 relative z-20">
              
              {/* Navigation Tabs */}
              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-2 flex overflow-x-auto hide-scrollbar mb-8 gap-2">
                {[
                  { id: 'security', label: 'Security & Auth', icon: <Lock className="w-4 h-4" /> },
                  { id: 'financial', label: 'Capital & Escrow', icon: <Landmark className="w-4 h-4" /> },
                  { id: 'proxy', label: 'Proxy Relations', icon: <Users className="w-4 h-4" /> },
                  { id: 'reporting', label: 'Reporting & Compliance', icon: <FileText className="w-4 h-4" /> },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm whitespace-nowrap transition-all flex-1 justify-center ${
                      activeTab === tab.id 
                        ? 'bg-slate-900 text-white shadow-md' 
                        : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                  >
                    {tab.icon}
                    {tab.label}
                  </button>
                ))}
              </div>

              <div className="space-y-6">

                {/* TAB 1: SECURITY & AUTH */}
                {activeTab === 'security' && (
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="lg:col-span-2 space-y-6">
                      <div className="bg-white rounded-[24px] p-6 sm:p-8 shadow-sm border border-slate-100 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-bl-full -mr-8 -mt-8 pointer-events-none" />
                        <h3 className="text-xl font-black text-slate-800 tracking-tight mb-2 flex items-center gap-2">
                          Two-Factor Authentication (2FA)
                        </h3>
                        <p className="text-slate-500 text-sm font-medium mb-8 pr-12">
                          Protect your capital pool from unauthorized withdrawals. Required for transactions exceeding UGX 1,000,000.
                        </p>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between p-5 border-2 border-slate-100 rounded-2xl bg-white hover:border-indigo-100 transition-colors cursor-pointer group">
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                                <Smartphone className="w-6 h-6" />
                              </div>
                              <div>
                                <h4 className="font-bold text-slate-800">SMS OTP</h4>
                                <p className="text-xs text-slate-500 font-medium">Text messages sent to +256 700 *** 936</p>
                              </div>
                            </div>
                            <div className="w-12 h-6 bg-indigo-600 rounded-full flex items-center p-1 cursor-pointer transition-colors shadow-inner">
                              <div className="w-4 h-4 bg-white rounded-full translate-x-6 transition-transform shadow-sm" />
                            </div>
                          </div>
                          <div className="flex items-center justify-between p-5 border-2 border-slate-100 rounded-2xl bg-slate-50 cursor-not-allowed opacity-70">
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 rounded-xl bg-slate-200 text-slate-500 flex items-center justify-center">
                                <Fingerprint className="w-6 h-6" />
                              </div>
                              <div>
                                <h4 className="font-bold text-slate-800">Biometric Passkey</h4>
                                <p className="text-xs text-slate-500 font-medium">Coming soon for mobile app users</p>
                              </div>
                            </div>
                            <div className="w-12 h-6 bg-slate-200 rounded-full flex items-center p-1 shadow-inner">
                              <div className="w-4 h-4 bg-white rounded-full shadow-sm" />
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="bg-white rounded-[24px] p-6 sm:p-8 shadow-sm border border-slate-100 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 rounded-bl-full -mr-8 -mt-8 pointer-events-none" />
                        <h3 className="text-xl font-black text-slate-800 tracking-tight mb-2 flex items-center gap-2">
                          Change Password
                        </h3>
                        <p className="text-slate-500 text-sm font-medium mb-6">
                          Ensure your account uses a strong, unique password. If you utilized a default password during agent onboarding, change it immediately.
                        </p>
                        
                        <div className="space-y-4">
                          <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5 ml-1">Current Password</label>
                            <input 
                              type="password" 
                              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium text-slate-700 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all placeholder:text-slate-400" 
                              placeholder="••••••••"
                            />
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5 ml-1">New Password</label>
                              <input 
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium text-slate-700 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition-all placeholder:text-slate-400" 
                                placeholder="Min 8 characters"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5 ml-1">Confirm Password</label>
                              <input 
                                type="password" 
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium text-slate-700 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition-all placeholder:text-slate-400" 
                                placeholder="Repeat new password"
                              />
                            </div>
                          </div>
                          <div className="pt-2 pb-1 grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {passwordCriteria.map((c, idx) => (
                              <div key={idx} className={`flex items-center gap-2 text-xs font-bold transition-colors duration-300 ${c.met ? 'text-emerald-600' : 'text-slate-400'}`}>
                                {c.met ? <CheckCircle2 className="w-4 h-4" /> : <Circle className="w-4 h-4" />}
                                {c.label}
                              </div>
                            ))}
                          </div>
                          <button className="w-full mt-2 bg-slate-900 text-white font-bold py-3 rounded-xl hover:bg-slate-800 transition-colors shadow-md">
                            Update Password
                          </button>
                        </div>
                      </div>

                      <div className="bg-white rounded-[24px] p-6 sm:p-8 shadow-sm border border-slate-100">
                        <h3 className="text-xl font-black text-slate-800 tracking-tight mb-6 flex items-center gap-2">
                          <Activity className="w-5 h-5 text-slate-400" /> Session History
                        </h3>
                        <div className="space-y-0">
                          <div className="flex items-center justify-between py-4 border-b border-slate-100">
                            <div>
                              <p className="font-bold text-slate-800 flex items-center gap-2">
                                Windows PC — Chrome <span className="text-[10px] bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded uppercase tracking-wider font-extrabold">Current</span>
                              </p>
                              <p className="text-xs text-slate-500 mt-1 font-medium">Kampala, Uganda • 192.168.1.4</p>
                            </div>
                          </div>
                          <div className="flex items-center justify-between py-4">
                            <div>
                              <p className="font-bold text-slate-800">iPhone 14 Pro — Safari App</p>
                              <p className="text-xs text-slate-500 mt-1 font-medium">Entebbe, Uganda • Yesterday at 14:32</p>
                            </div>
                            <button className="text-slate-400 hover:text-red-500 transition-colors p-2">
                              <LogOut className="w-5 h-5" />
                            </button>
                          </div>
                        </div>
                        <button className="w-full mt-4 py-3 border-2 border-slate-100 rounded-xl text-slate-600 font-bold text-sm hover:bg-slate-50 hover:border-slate-300 transition-all">
                          Log out of all other devices
                        </button>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div className="bg-gradient-to-b from-red-500 to-red-600 rounded-[24px] p-8 shadow-[0_8px_30px_rgba(239,68,68,0.3)] relative overflow-hidden text-center text-white">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-16 -mt-16 pointer-events-none" />
                        <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6 backdrop-blur-md border border-white/20">
                          <ShieldAlert className="w-10 h-10 text-white" />
                        </div>
                        <h3 className="text-2xl font-black tracking-tight mb-3">Emergency Lock</h3>
                        <p className="text-red-100 text-sm font-medium mb-8 leading-relaxed">
                          Suspect unauthorized access? Instantly freeze your wallet. This halts all pending withdrawals and blocks any agent from investing via your proxy mandate.
                        </p>
                        <button className="w-full bg-white text-red-600 py-4 rounded-xl font-black uppercase tracking-widest text-sm shadow-xl hover:bg-red-50 transition-colors pb-[14px]">
                          FREEZE WALLET NOW
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB 2: CAPITAL & ESCROW */}
                {activeTab === 'financial' && (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="bg-white rounded-[24px] p-6 sm:p-8 shadow-sm border border-slate-100">
                      <h3 className="text-xl font-black text-slate-800 tracking-tight mb-2">Verified Payout Methods</h3>
                      <p className="text-slate-500 text-sm font-medium mb-6">
                        Newly added withdrawal numbers undergo a mandatory 48-hour cooling period to protect your capital.
                      </p>
                      <div className="space-y-3 mb-6">
                        <div className="p-4 rounded-2xl border-2 border-emerald-500 bg-emerald-50/30 flex items-center justify-between relative overflow-hidden">
                          <div className="absolute left-0 top-0 bottom-0 w-1 bg-emerald-500" />
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-yellow-400 flex items-center justify-center shadow-inner">
                              <span className="font-black text-slate-900 text-xs">MTN</span>
                            </div>
                            <div>
                              <p className="font-bold text-slate-800 text-sm">Grace N.</p>
                              <p className="font-mono text-slate-500 text-xs mt-0.5">+256 772 *** 881</p>
                            </div>
                          </div>
                          <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest hidden sm:inline-block">
                            Primary
                          </span>
                        </div>
                        <div className="p-4 rounded-2xl border-2 border-slate-100 bg-white flex items-center justify-between group hover:border-slate-300 transition-colors">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-red-500 flex items-center justify-center shadow-inner">
                              <span className="font-black text-white text-xs">AIR</span>
                            </div>
                            <div>
                              <p className="font-bold text-slate-600 text-sm">Grace N.</p>
                              <p className="font-mono text-slate-400 text-xs mt-0.5">+256 700 *** 936</p>
                            </div>
                          </div>
                          <button className="text-slate-400 hover:text-red-500 px-2 transition-colors">
                            Block
                          </button>
                        </div>
                      </div>
                      <button className="w-full flex justify-center items-center py-4 rounded-xl font-bold text-sm bg-slate-900 text-white shadow-md hover:bg-slate-800 transition-colors">
                        + Add New Withdrawal Account
                      </button>
                    </div>

                    <div className="bg-white rounded-[24px] p-6 sm:p-8 shadow-sm border border-slate-100 relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-50 rounded-bl-full -mr-12 -mt-12 pointer-events-none" />
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-2xl flex items-center justify-center shadow-inner">
                          <Clock className="w-6 h-6" />
                        </div>
                        <div>
                          <h3 className="text-xl font-black text-slate-800 tracking-tight">Active 90-Day Escrow</h3>
                          <p className="text-sm text-slate-500 font-medium">Pending withdrawal timeline tracker</p>
                        </div>
                      </div>
                      <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 relative">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Locked Capital in Exit Queue</p>
                        <p className="text-3xl font-black text-slate-800 mb-6 font-mono tracking-tight">UGX <span className="text-orange-500">1,500,000</span></p>
                        <div className="mb-2 flex justify-between text-xs font-bold">
                          <span className="text-slate-500">Initiated: Mar 15</span>
                          <span className="text-orange-600">Release: Jun 13</span>
                        </div>
                        <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden shadow-inner">
                          <div className="h-full bg-gradient-to-r from-orange-400 to-orange-500 w-[15%] rounded-full shadow-[0_0_10px_rgba(249,115,22,0.5)]"></div>
                        </div>
                        <p className="text-center text-xs text-slate-500 font-semibold mt-4">
                          14 days down • 76 days remaining
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB 3: PROXY RELATIONS */}
                {activeTab === 'proxy' && (
                  <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="bg-white rounded-[24px] p-6 sm:p-8 shadow-sm border border-slate-100">
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                        <div>
                          <h3 className="text-xl font-black text-slate-800 tracking-tight">Authorized Agents (Mandates)</h3>
                          <p className="text-slate-500 text-sm font-medium mt-1">
                            Manage which operations agents are legally allowed to initiate proxy investments from your wallet.
                          </p>
                        </div>
                        <button className="whitespace-nowrap bg-indigo-50 text-indigo-700 px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-indigo-100 transition-colors">
                          Add Agent ID
                        </button>
                      </div>
                      <div className="rounded-2xl border border-slate-200 overflow-hidden divide-y divide-slate-100">
                        <div className="p-5 sm:p-6 bg-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 hover:bg-slate-50 transition-colors">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center border border-slate-200 shadow-inner">
                              <UserCheck className="w-6 h-6 text-slate-500" />
                            </div>
                            <div>
                              <h4 className="font-bold text-slate-800 flex items-center gap-2">
                                John Kato <span className="text-[10px] font-mono bg-slate-100 text-slate-500 px-2 py-0.5 rounded-md border border-slate-200">AG-4299</span>
                              </h4>
                              <p className="text-sm text-slate-500 font-medium">Assigned by Operations</p>
                            </div>
                          </div>
                          <div className="flex-1 sm:px-8 w-full">
                            <p className="text-[10px] uppercase tracking-widest font-bold text-slate-400 mb-1">Transaction Limit</p>
                            <p className="text-sm font-bold text-slate-700 font-mono bg-slate-100 p-2 rounded-lg border border-slate-200 inline-block">
                              UGX 5,000,000 / day
                            </p>
                          </div>
                          <div className="flex items-center gap-3 w-full sm:w-auto mt-4 sm:mt-0">
                            <button className="flex-1 sm:flex-none border border-slate-200 bg-white text-slate-600 px-4 py-2 rounded-xl text-xs font-bold hover:border-slate-300 hover:bg-slate-50 transition-colors shadow-sm">
                              Edit Limit
                            </button>
                            <button className="flex-1 sm:flex-none bg-red-50 border border-red-100 text-red-600 px-4 py-2 rounded-xl text-xs font-bold hover:bg-red-100 transition-colors shadow-sm">
                              Revoke Access
                            </button>
                          </div>
                        </div>
                        <div className="p-5 sm:p-6 bg-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 hover:bg-slate-50 transition-colors opacity-60">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center border border-slate-200 blur-[1px]">
                              <UserCheck className="w-6 h-6 text-slate-400" />
                            </div>
                            <div>
                              <h4 className="font-bold text-slate-800 line-through">
                                Sarah N. <span className="text-[10px] font-mono bg-slate-100 text-slate-500 px-2 py-0.5 rounded-md border border-slate-200 no-underline">AG-1033</span>
                              </h4>
                              <p className="text-sm text-red-500 font-bold mt-1">Revoked on Jan 14, 2026</p>
                            </div>
                          </div>
                          <div className="flex-1 sm:px-8 w-full hidden sm:block">
                            <p className="text-[10px] uppercase tracking-widest font-bold text-slate-400 mb-1">Transaction Limit</p>
                            <p className="text-sm font-bold text-slate-400 font-mono">
                              UGX 0 / day
                            </p>
                          </div>
                          <div className="w-full sm:w-auto mt-4 sm:mt-0">
                            <button className="w-full sm:w-auto border border-slate-200 bg-white text-slate-500 px-4 py-2 rounded-xl text-xs font-bold hover:border-slate-300 transition-colors shadow-sm">
                              Restore Access
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB 4: REPORTING & COMPLIANCE */}
                {activeTab === 'reporting' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="bg-white rounded-[24px] p-6 sm:p-8 shadow-sm border border-slate-100 group hover:border-emerald-200 transition-colors cursor-pointer">
                      <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                        <FileText className="w-8 h-8" />
                      </div>
                      <h3 className="text-xl font-black text-slate-800 tracking-tight mb-2">Automated Ledger Export</h3>
                      <p className="text-slate-500 text-sm font-medium mb-8">
                        Download a cryptographically verifiable CSV of all historical cash inflows, ROI payments, and principal deployments for your accountants.
                      </p>
                      <div className="flex items-center gap-2 text-emerald-600 font-bold text-sm bg-emerald-50 px-4 py-3 rounded-xl w-max">
                        <Download className="w-4 h-4" /> Download 2025 Statement.csv
                      </div>
                    </div>

                    <div className="bg-white rounded-[24px] p-6 sm:p-8 shadow-sm border border-slate-100 group hover:border-indigo-200 transition-colors cursor-pointer">
                      <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                        <ShieldCheck className="w-8 h-8" />
                      </div>
                      <h3 className="text-xl font-black text-slate-800 tracking-tight mb-2">Investment Certificate</h3>
                      <p className="text-slate-500 text-sm font-medium mb-8">
                        Generate a formalized, stamped PDF certificate proving your active capital pool balance and status as a secured Welile Supporter.
                      </p>
                      <div className="flex items-center gap-2 text-indigo-600 font-bold text-sm bg-indigo-50 px-4 py-3 rounded-xl w-max">
                        <Download className="w-4 h-4" /> Download Certificate.pdf
                      </div>
                    </div>
                    
                    <div className="md:col-span-2 bg-slate-900 rounded-[24px] p-6 sm:p-8 shadow-xl border border-slate-800 relative overflow-hidden flex flex-col sm:flex-row items-center justify-between gap-8">
                      <div className="absolute top-0 right-0 w-64 h-64 bg-slate-800 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none" />
                      <div className="relative z-10 flex-1">
                        <h3 className="text-xl font-black text-white tracking-tight mb-2 flex items-center gap-2">
                          <Users className="w-5 h-5 text-slate-400" /> Beneficiary & Succession (Next of Kin)
                        </h3>
                        <p className="text-slate-400 text-sm font-medium">
                          Ensure your primary capital and accumulating rewards are legally protected. Only verified platform administrators can authorize a transfer to a registered Next of Kin upon validated claims.
                        </p>
                      </div>
                      <div className="relative z-10 bg-slate-800 border border-slate-700 rounded-2xl p-5 w-full sm:w-auto">
                        <p className="text-[10px] uppercase font-black tracking-widest text-slate-500 mb-1">Registered Beneficiary</p>
                        <p className="text-white font-bold mb-1">Emmanuel N.</p>
                        <p className="text-emerald-400 font-mono text-xs font-bold">+256 701 *** 223</p>
                        <button className="w-full mt-4 bg-slate-700 text-white text-xs font-bold py-2 rounded-lg hover:bg-slate-600 transition-colors">
                          Update Mandate
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </main>

          {/* BOTTOM NA V */}
          <FunderBottomNav activePage="Account" />

        </div>
      </div>
    </div>
  );
}
