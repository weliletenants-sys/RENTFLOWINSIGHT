import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
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
  Circle,
  Edit3,
  Trash2,
  Building2,
  Plus,
  X,
  Camera,
  User,
  Info
} from 'lucide-react';

import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getMyRoles, requestRole, switchRole, type RoleView } from '../services/rolesApi';
import FunderSidebar from './components/FunderSidebar';
import FunderBottomNav from './components/FunderBottomNav';
import FunderDashboardHeader from './components/FunderDashboardHeader';
import { useKycStatus } from './hooks/useKycStatus';
import { getFunderDashboardStats, updateFunderProfile, uploadFunderAvatar, changeFunderPassword, enableFunder2FA, verifyFunder2FA, type DashboardStatsResponse } from '../services/funderApi';

export default function FunderAccountSettings() {
  const navigate = useNavigate();
  const { updateSession, user: authUser, updateUserLocally } = useAuth();
  const { status: kycStatus } = useKycStatus();
  const [stats, setStats] = useState<DashboardStatsResponse | null>(null);

  useEffect(() => {
    getFunderDashboardStats().then(setStats).catch(console.error);
  }, []);
  const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'financial' | 'proxy' | 'reporting' | 'roles'>('profile');
  const [newPassword, setNewPassword] = useState('');
  
  // Real user data fallback
  const userFirst = authUser?.firstName || '';
  const userLast = authUser?.lastName || '';
  
  const [firstName, setFirstName] = useState(userFirst);
  const [lastName, setLastName] = useState(userLast);
  const [email, setEmail] = useState(authUser?.email || '');
  const [phone, setPhone] = useState(authUser?.phone || '');
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);

  // Security States
  const [currentPassword, setCurrentPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  // 2FA States
  const [is2FAEnabled, setIs2FAEnabled] = useState((authUser as any)?.is_2fa_enabled || false);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otpInput, setOtpInput] = useState('');
  const [isVerifying2FA, setIsVerifying2FA] = useState(false);
  const [isEnabling2FA, setIsEnabling2FA] = useState(false);

  // Avatar states - frontend AuthContext type does not currently type avatar_url so we use any casting safely or default string
  const [avatarPreview, setAvatarPreview] = useState<string>((authUser as any)?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${userFirst}&backgroundColor=059669`);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [rewardMode, setRewardMode] = useState<'compound' | 'payout'>('compound');
  const [platformRoles, setPlatformRoles] = useState<RoleView[]>([]);
  const [rolesLoading, setRolesLoading] = useState(false);
  const [activeRole, setActiveRole] = useState<string>('');

  const handleAvatarSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Optimistic preview
      const reader = new FileReader();
      reader.onload = (e) => setAvatarPreview(e.target?.result as string);
      reader.readAsDataURL(file);

      setIsUploadingAvatar(true);
      const toastId = toast.loading('Uploading profile picture to secure vault...');
      try {
        const formData = new FormData();
        formData.append('avatar', file);
        const res = await uploadFunderAvatar(formData);
        toast.success('Profile photo updated successfully!', { id: toastId });
        if (res?.data?.avatarUrl) {
          updateUserLocally({ avatar_url: res.data.avatarUrl });
        }
      } catch (error: any) {
        console.error('Avatar upload failed', error);
        toast.error('Failed to upload profile picture.', { id: toastId });
        setAvatarPreview((authUser as any)?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${userFirst}&backgroundColor=059669`);
      } finally {
        setIsUploadingAvatar(false);
      }
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdatingProfile(true);
    try {
      await updateFunderProfile(firstName, lastName, email, phone);
      updateUserLocally({ firstName, lastName, email, phone });
      toast.success('Personal profile saved securely!');
    } catch (error: any) {
      // Decode the RFC 7807 problem+json response specified by the API architecture
      const problem = error.response?.data;
      if (problem && problem.detail) {
        toast.error(problem.detail, { duration: 6000 });
      } else {
        toast.error('System rejected profile update. Ensure inputs are valid text.');
      }
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  type PayoutAccount = { id: string; type: 'momo' | 'bank'; network?: 'MTN' | 'Airtel' | 'Unknown'; name: string; number: string; isPrimary: boolean; };
  const [accounts, setAccounts] = useState<PayoutAccount[]>([
    { id: '1', type: 'momo', network: 'MTN', name: 'Grace N.', number: '0772000881', isPrimary: true },
    { id: '2', type: 'momo', network: 'Airtel', name: 'Grace N.', number: '0700000936', isPrimary: false }
  ]);
  const [isAddingAccount, setIsAddingAccount] = useState(false);
  const [editingAccountId, setEditingAccountId] = useState<string | null>(null);
  const [accountToDelete, setAccountToDelete] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ type: 'momo', name: '', number: '' });

  const getNetworkFromNumber = (num: string) => {
    if (/^0(77|78|76|39)/.test(num)) return 'MTN';
    if (/^0(70|75|74|20)/.test(num)) return 'Airtel';
    return 'Unknown';
  };

  const handleSaveAccount = () => {
    if (editForm.type === 'momo' && !/^0\d{9}$/.test(editForm.number)) {
      toast.error('Mobile money number must be exactly 10 digits starting with 0. Do not use +256.');
      return;
    }
    if (editingAccountId) {
      setAccounts(accounts.map(a => a.id === editingAccountId ? { 
        ...a, name: editForm.name, number: editForm.number, type: editForm.type as any, network: editForm.type === 'momo' ? getNetworkFromNumber(editForm.number) : undefined 
      } : a));
      setEditingAccountId(null); toast.success('Account details updated!');
    } else {
      setAccounts([...accounts, { 
        id: Date.now().toString(), name: editForm.name, number: editForm.number, type: editForm.type as any, network: editForm.type === 'momo' ? getNetworkFromNumber(editForm.number) : undefined, isPrimary: accounts.length === 0 
      }]);
      setIsAddingAccount(false); toast.success('New withdrawal account added!');
    }
  };

  const passwordCriteria = [
    { label: 'At least 8 characters', met: newPassword.length >= 8 },
    { label: 'Contains a number', met: /\d/.test(newPassword) },
    { label: 'Contains an uppercase letter', met: /[A-Z]/.test(newPassword) },
    { label: 'Contains a special character', met: /[^A-Za-z0-9]/.test(newPassword) },
  ];

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword) return toast.error('Please enter your current password.');
    if (newPassword !== confirmPassword) return toast.error('The new passwords do not match.');
    const allMet = passwordCriteria.every(c => c.met);
    if (!allMet) return toast.error('Please ensure your new password meets all the strength requirements.');
    
    setIsChangingPassword(true);
    const tId = toast.loading('Updating your password...');
    try {
      const res = await changeFunderPassword(currentPassword, newPassword);
      toast.success(res.message || 'Your password has been updated securely.', { id: tId });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      toast.error(err.response?.data?.detail || 'Failed to update password. Please try again.', { id: tId });
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleToggle2FA = async () => {
    if (is2FAEnabled) {
      toast.error('To disable 2FA, please contact support for assistance.');
      return;
    }
    setIsEnabling2FA(true);
    const tId = toast.loading('Sending verification code...');
    try {
      await enableFunder2FA();
      toast.success('Verification code sent! Please check your messages.', { id: tId });
      setShowOtpModal(true);
    } catch (err: any) {
      toast.error(err.response?.data?.detail || 'Failed to send the verification code.', { id: tId });
    } finally {
      setIsEnabling2FA(false);
    }
  };

  const handleVerify2FA = async () => {
    if (otpInput.length !== 6) return toast.error('Please enter the 6-digit verification code.');
    setIsVerifying2FA(true);
    const tId = toast.loading('Verifying your code...');
    try {
      await verifyFunder2FA(otpInput);
      toast.success('Two-Factor Authentication has been successfully enabled!', { id: tId });
      setIs2FAEnabled(true);
      updateUserLocally({ is_2fa_enabled: true } as any);
      setShowOtpModal(false);
      setOtpInput('');
    } catch (err: any) {
      toast.error(err.response?.data?.detail || "That code didn't work. Please try again.", { id: tId });
    } finally {
      setIsVerifying2FA(false);
    }
  };

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
              className="w-full h-[240px] sm:h-[280px] relative px-6 sm:px-12 pt-8 overflow-hidden"
              style={{
                background: 'linear-gradient(135deg, var(--color-primary-dark) 0%, var(--color-primary) 100%)',
                boxShadow: '0 4px 24px var(--color-primary-shadow)'
              }}
            >
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5 pointer-events-none mix-blend-overlay"></div>
              <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none"></div>

              <div className="relative z-10 max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 h-full">
                <div className="flex items-center gap-6">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-slate-100 border-4 border-white/20 shadow-2xl flex items-center justify-center overflow-hidden flex-shrink-0 relative group">
                     <img src={avatarPreview} alt="Avatar" className={`w-full h-full object-cover transition-all duration-300 ${isUploadingAvatar ? 'opacity-30 blur-[2px]' : 'group-hover:opacity-50'}`} />
                     
                     {isUploadingAvatar ? (
                       <div className="absolute inset-0 overflow-hidden flex flex-col items-center justify-center z-10 transition-all">
                         <div className="absolute inset-0 bg-slate-900/30" />
                         <div 
                           className="absolute left-1/2 w-[250%] aspect-square bg-white/20 backdrop-blur-md border border-white/30 -translate-x-1/2 animate-[spin_3s_linear_infinite]"
                           style={{ animation: 'spin 3s linear infinite, liquidFill 1.5s cubic-bezier(0.4, 0.0, 0.2, 1) forwards' }}
                         />
                         <span className="relative z-20 text-[9px] font-black tracking-widest text-white animate-pulse mt-1 drop-shadow-md">UPLOADING</span>
                         <style>{`
                           @keyframes liquidFill {
                             0% { top: 100%; border-radius: 40%; }
                             100% { top: -20%; border-radius: 46%; }
                           }
                         `}</style>
                       </div>
                     ) : (
                       <label htmlFor="avatar-upload" className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                         <Camera className="w-6 h-6 mb-1" />
                         <span className="text-[10px] font-bold tracking-widest uppercase">Upload</span>
                       </label>
                     )}
                     
                     <input type="file" id="avatar-upload" className="hidden" accept="image/*" onChange={handleAvatarSelect} disabled={isUploadingAvatar} />
                  </div>
                  <div className="text-center md:text-left">
                    <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight drop-shadow-sm mb-1">
                      {firstName} {lastName ? lastName.charAt(0) + '.' : ''}
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
                    <p className="text-2xl font-black">UGX {((stats?.totalInvested || 0) / 1_000_000).toFixed(1)}M</p>
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
              <div 
                className="bg-white rounded-2xl shadow-sm border border-slate-100 p-2 flex overflow-x-auto mb-8 gap-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
              >
                {[
                  { id: 'profile', label: 'Personal Info', icon: <User className="w-4 h-4" /> },
                  { id: 'security', label: 'Security & Auth', icon: <Lock className="w-4 h-4" /> },
                  { id: 'financial', label: 'Capital & Escrow', icon: <Landmark className="w-4 h-4" /> },
                  { id: 'proxy', label: 'Proxy Relations', icon: <Users className="w-4 h-4" /> },
                  { id: 'reporting', label: 'Reporting & Compliance', icon: <FileText className="w-4 h-4" /> },
                  { id: 'roles', label: 'Role Management', icon: <Building2 className="w-4 h-4" /> },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`cursor-pointer flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm whitespace-nowrap transition-all flex-1 justify-center ${
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

              <div className="cursor-pointer space-y-6">

                {/* TAB 0: PERSONAL INFO */}
                {activeTab === 'profile' && (
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="lg:col-span-2 space-y-6">
                      <div className="bg-white rounded-[24px] p-6 sm:p-8 shadow-sm border border-slate-100 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-bl-full -mr-8 -mt-8 pointer-events-none" />
                        <h3 className="text-xl font-black text-slate-800 tracking-tight mb-2 flex items-center gap-2">
                          Personal Information
                        </h3>
                        <p className="text-slate-500 text-sm font-medium mb-8 pr-12">
                          Update your contact details and basic real-world compliance information. Your email serves as your primary login identifier.
                        </p>
                        
                        <form onSubmit={handleUpdateProfile} className="space-y-4">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5 ml-1">First Name</label>
                              <input required value={firstName} onChange={e => setFirstName(e.target.value)} type="text" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium text-slate-800 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition-all placeholder:text-slate-400" />
                            </div>
                            <div>
                              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5 ml-1">Last Name</label>
                              <input required value={lastName} onChange={e => setLastName(e.target.value)} type="text" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium text-slate-800 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition-all placeholder:text-slate-400" />
                            </div>
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5 ml-1">Email Address</label>
                            <input value={email} onChange={e => setEmail(e.target.value)} type="email" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium text-slate-800 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition-all placeholder:text-slate-400" />
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5 ml-1">Phone Number</label>
                              <input value={phone} onChange={e => setPhone(e.target.value)} type="tel" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium text-slate-800 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition-all placeholder:text-slate-400" />
                            </div>
                            <div>
                              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5 ml-1">Date of Birth</label>
                              <input defaultValue="1985-04-12" type="date" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium text-slate-800 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition-all placeholder:text-slate-400" />
                            </div>
                          </div>
                          <button disabled={isUpdatingProfile} type="submit" className="w-full mt-4 cursor-pointer bg-slate-900 text-white font-bold py-3.5 rounded-xl hover:bg-slate-800 transition-colors shadow-md text-sm disabled:opacity-50">
                            {isUpdatingProfile ? 'Saving Protocol...' : 'Save Profile Changes'}
                          </button>
                        </form>
                      </div>
                    </div>

                    <div className="space-y-6">
                      {/* KYC STATUS CARD — 3 states */}
                      {(() => {
                        const isApproved = authUser?.isVerified || kycStatus === 'APPROVED';
                        const isUnderReview = !isApproved && kycStatus === 'UNDER_REVIEW';

                        if (isApproved) {
                          return (
                            <div className="bg-emerald-50 rounded-[24px] p-8 shadow-sm border border-emerald-100 relative overflow-hidden text-center hover:bg-emerald-100/50 transition-colors">
                              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm text-emerald-600">
                                <UserCheck className="w-8 h-8" />
                              </div>
                              <h3 className="text-xl font-black text-slate-800 tracking-tight mb-2">KYC Status</h3>
                              <p className="text-emerald-700 text-sm font-bold mb-4">Grade-A Verified</p>
                              <p className="text-slate-500 text-xs font-medium leading-relaxed mb-6">
                                Your identity documents and proof of address have been fully verified by our compliance team. You have no pending requests.
                              </p>
                              <button className="w-full bg-white text-emerald-700 border border-emerald-200 py-3 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-emerald-100 transition-colors shadow-sm">
                                View Documents
                              </button>
                            </div>
                          );
                        }

                        if (isUnderReview) {
                          return (
                            <div className="bg-blue-50 rounded-[24px] p-8 shadow-sm border border-blue-100 relative overflow-hidden text-center">
                              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm text-blue-600">
                                <ShieldCheck className="w-8 h-8" />
                              </div>
                              <h3 className="text-xl font-black text-slate-800 tracking-tight mb-2">KYC Status</h3>
                              <p className="text-blue-700 text-sm font-bold mb-4">Under Review</p>
                              <p className="text-slate-500 text-xs font-medium leading-relaxed mb-6">
                                Your identity documents have been received and are being reviewed by our compliance team. This usually takes 24–48 hours.
                              </p>
                              <div className="w-full bg-blue-100 text-blue-700 border border-blue-200 py-3 rounded-xl font-bold text-xs uppercase tracking-widest text-center">
                                Awaiting Approval
                              </div>
                            </div>
                          );
                        }

                        return (
                          <div className="bg-amber-50 rounded-[24px] p-8 shadow-sm border border-amber-100 relative overflow-hidden text-center hover:bg-amber-100/50 transition-colors">
                            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm text-amber-600">
                              <ShieldAlert className="w-8 h-8" />
                            </div>
                            <h3 className="text-xl font-black text-slate-800 tracking-tight mb-2">KYC Status</h3>
                            <p className="text-amber-700 text-sm font-bold mb-4">Verification Required</p>
                            <p className="text-slate-500 text-xs font-medium leading-relaxed mb-6">
                              Your identity has not been verified yet. Complete KYC onboarding to unlock funding and withdrawal capabilities.
                            </p>
                            <button
                              onClick={() => navigate('/funder/kyc')}
                              className="w-full bg-amber-600 text-white border border-amber-500 py-3 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-amber-700 transition-colors shadow-sm"
                            >
                              Complete KYC →
                            </button>
                          </div>
                        );
                      })()}
                    </div>
                  </div>
                )}

                {/* TAB 1: SECURITY & AUTH */}
                {activeTab === 'security' && (
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="lg:col-span-2 space-y-6">
                      <div className="bg-white rounded-[24px] p-6 sm:p-8 shadow-sm border border-slate-100 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-bl-full -mr-8 -mt-8 pointer-events-none" />
                        <h3 className="text-xl font-black text-slate-800 tracking-tight mb-2 flex items-center gap-2">
                          Two-Factor Authentication (2FA)
                        </h3>
                        <p className="text-slate-500 text-sm font-medium mb-8 pr-12">
                          Protect your capital pool from unauthorized withdrawals. Required for transactions exceeding UGX 1,000,000.
                        </p>
                        <div className="space-y-4">
                          <div onClick={isEnabling2FA ? undefined : handleToggle2FA} className={`flex items-center justify-between p-5 border-2 rounded-2xl transition-colors cursor-pointer group ${is2FAEnabled ? 'border-emerald-500 bg-emerald-50' : 'border-slate-100 bg-white hover:border-emerald-100'}`}>
                            <div className="flex items-center gap-4">
                              <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${is2FAEnabled ? 'bg-emerald-600 text-white' : 'bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white'}`}>
                                <Smartphone className="w-6 h-6" />
                              </div>
                              <div>
                                <h4 className="font-bold text-slate-800">SMS OTP</h4>
                                <p className="text-xs text-slate-500 font-medium">Text messages sent to {phone || 'your phone line'}</p>
                              </div>
                            </div>
                            <div className={`w-12 h-6 rounded-full flex items-center p-1 transition-colors shadow-inner ${is2FAEnabled ? 'bg-emerald-600' : 'bg-slate-300'}`}>
                              <div className={`w-4 h-4 bg-white rounded-full transition-transform shadow-sm ${is2FAEnabled ? 'translate-x-6' : 'translate-x-0'}`} />
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
                              value={currentPassword}
                              onChange={e => setCurrentPassword(e.target.value)}
                              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium text-slate-700 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition-all placeholder:text-slate-400" 
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
                                value={confirmPassword}
                                onChange={e => setConfirmPassword(e.target.value)}
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
                          <button 
                            disabled={isChangingPassword}
                            onClick={handleChangePassword}
                            className="cursor-pointer w-full mt-2 bg-slate-900 text-white font-bold py-3 rounded-xl hover:bg-slate-800 transition-colors shadow-md disabled:opacity-50"
                          >
                            {isChangingPassword ? 'Working on Vault...' : 'Update Password'}
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
                            <button className="cursor-pointer text-slate-400 hover:text-red-500 transition-colors p-2">
                              <LogOut className="w-5 h-5" />
                            </button>
                          </div>
                        </div>
                        <button className="cursor-pointer w-full mt-4 py-3 border-2 border-slate-100 rounded-xl text-slate-600 font-bold text-sm hover:bg-slate-50 hover:border-slate-300 transition-all">
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
                        <button className="cursor-pointer w-full bg-white text-red-600 py-4 rounded-xl font-black uppercase tracking-widest text-sm shadow-xl hover:bg-red-50 transition-colors pb-[14px]">
                          FREEZE WALLET NOW
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB 2: CAPITAL & ESCROW */}
                {activeTab === 'financial' && (
                  <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      
                      {/* LEFT COLUMN: PAYOUTS & TOGGLES */}
                      <div className="space-y-6">
                        <div className="bg-white rounded-[24px] p-6 sm:p-8 shadow-sm border border-slate-100">
                          <h3 className="text-xl font-black text-slate-800 tracking-tight mb-2">Verified Payout Methods</h3>
                          <p className="text-slate-500 text-sm font-medium mb-6">
                            Newly added withdrawal numbers undergo a mandatory 48-hour cooling period.
                          </p>
                          
                          <div className="space-y-3 mb-6">
                            {accounts.map(acc => (
                              <div key={acc.id} className={`cursor-pointer p-4 rounded-2xl border-2 flex items-center justify-between group transition-colors relative overflow-hidden ${acc.isPrimary ? 'border-emerald-500 bg-emerald-50/30' : 'border-slate-100 bg-white hover:border-slate-300'}`}>
                                {acc.isPrimary && <div className="absolute left-0 top-0 bottom-0 w-1 bg-emerald-500" />}
                                
                                <div className="flex items-center gap-4">
                                  <div className="w-10 h-10 rounded-full flex items-center justify-center shadow-inner overflow-hidden flex-shrink-0 bg-slate-100 border border-slate-200">
                                    {acc.type === 'momo' ? (
                                      acc.network === 'MTN' ? <img src="/mtn.png" alt="MTN" className="w-full h-full object-cover" /> :
                                      acc.network === 'Airtel' ? <img src="/airtel.png" alt="Airtel" className="w-full h-full object-cover" /> :
                                      <Smartphone className="w-5 h-5 text-slate-400" />
                                    ) : (
                                      <Building2 className="w-5 h-5 text-slate-600" />
                                    )}
                                  </div>
                                  
                                  <div>
                                    <div className="flex items-center gap-2">
                                      <p className="font-bold text-slate-800 text-sm">{acc.name}</p>
                                      {acc.isPrimary && <span className="bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-widest hidden sm:inline-block">Primary</span>}
                                    </div>
                                    <p className="font-mono text-slate-500 text-xs mt-0.5 tracking-tight">{acc.number}</p>
                                  </div>
                                </div>
                                
                                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <button onClick={() => { setEditingAccountId(acc.id); setEditForm({ type: acc.type, name: acc.name, number: acc.number }); }} className="cursor-pointer p-2 text-slate-400 hover:text-emerald-600 transition-colors bg-white rounded-lg hover:shadow-sm">
                                    <Edit3 className="w-4 h-4" />
                                  </button>
                                  {!acc.isPrimary && (
                                    <button onClick={() => { setAccountToDelete(acc.id); toast.success('Withdrawal method removed securely'); }} className="cursor-pointer p-2 text-slate-400 hover:text-red-500 transition-colors bg-white rounded-lg hover:shadow-sm">
                                      <Trash2 className="w-4 h-4" />
                                    </button>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>

                          {(isAddingAccount || editingAccountId) && (
                            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 mb-6 animate-in fade-in slide-in-from-top-2">
                              <div className="flex justify-between items-center mb-4">
                                <h4 className="font-bold text-slate-800 text-sm">{editingAccountId ? 'Edit Account' : 'Add New Account'}</h4>
                                <button onClick={() => { setIsAddingAccount(false); setEditingAccountId(null); }} className="cursor-pointer text-slate-400 hover:text-slate-600"><X className="w-4 h-4" /></button>
                              </div>
                              <div className="flex gap-2 mb-4">
                                <button onClick={() => setEditForm({...editForm, type: 'momo'})} className={`cursor-pointer flex-1 py-2 text-xs font-bold rounded-lg transition-all border ${editForm.type === 'momo' ? 'bg-white border-emerald-500 text-emerald-700 shadow-sm' : 'border-transparent text-slate-500 hover:bg-slate-100'}`}>Mobile Money</button>
                                <button onClick={() => setEditForm({...editForm, type: 'bank'})} className={`cursor-pointer flex-1 py-2 text-xs font-bold rounded-lg transition-all border ${editForm.type === 'bank' ? 'bg-white border-emerald-500 text-emerald-700 shadow-sm' : 'border-transparent text-slate-500 hover:bg-slate-100'}`}>Bank Account</button>
                              </div>
                              <div className="cursor-pointer space-y-3">
                                <div>
                                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1 ml-1">Account Name</label>
                                  <input value={editForm.name} onChange={e => setEditForm({...editForm, name: e.target.value})} type="text" className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium focus:outline-none focus:border-emerald-500" placeholder="e.g. Grace N." />
                                </div>
                                <div>
                                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1 ml-1">{editForm.type === 'momo' ? 'Mobile Number' : 'Account Number'}</label>
                                  <div className="relative">
                                    <input value={editForm.number} onChange={e => setEditForm({...editForm, number: e.target.value})} type="text" className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium focus:outline-none focus:border-emerald-500 font-mono" placeholder={editForm.type === 'momo' ? "077... (10 digits)" : "Bank Account No"} />
                                    {editForm.type === 'momo' && editForm.number.length >= 3 && (
                                      <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center">
                                        {getNetworkFromNumber(editForm.number) === 'MTN' && <span className="bg-yellow-400 text-slate-900 text-[9px] font-black uppercase px-2 py-0.5 rounded-md">MTN</span>}
                                        {getNetworkFromNumber(editForm.number) === 'Airtel' && <span className="bg-red-500 text-white text-[9px] font-black uppercase px-2 py-0.5 rounded-md">AIRTEL</span>}
                                      </div>
                                    )}
                                  </div>
                                </div>
                                <button onClick={handleSaveAccount} className="cursor-pointer w-full mt-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 rounded-xl transition-colors shadow-sm text-sm">
                                  Save Details
                                </button>
                              </div>
                            </div>
                          )}

                          {!isAddingAccount && !editingAccountId && (
                            <button onClick={() => { setIsAddingAccount(true); setEditForm({ type: 'momo', name: '', number: '' }); }} className="cursor-pointer w-full flex justify-center items-center py-4 rounded-xl font-bold text-sm bg-slate-900 text-white shadow-md hover:bg-slate-800 transition-colors">
                              <Plus className="w-4 h-4 mr-2" /> Add New Withdrawal Account
                            </button>
                          )}
                        </div>

                        {/* REWARD HANDLING TOGGLE */}
                        <div className="bg-white rounded-[24px] p-6 shadow-sm border border-slate-100">
                          <h3 className="text-xl font-black text-slate-800 tracking-tight mb-4 flex items-center gap-2">Reward Handling</h3>
                          <div className="flex flex-col sm:flex-row gap-2 p-1.5 bg-slate-100 rounded-xl border border-slate-200/60 mb-5">
                            <button onClick={() => { setRewardMode('compound'); toast.success('Rewards set to Auto-Compound'); }} className={`cursor-pointer flex-1 py-3 px-2 text-xs sm:text-sm font-bold rounded-lg transition-all ${rewardMode === 'compound' ? 'bg-white text-emerald-700 shadow-sm border border-emerald-100' : 'text-slate-500 hover:text-slate-800'}`}>
                              Auto-Compound (Reinvest)
                            </button>
                            <button onClick={() => { setRewardMode('payout'); toast.success('Rewards set to Auto-Payout'); }} className={`cursor-pointer flex-1 py-3 px-2 text-xs sm:text-sm font-bold rounded-lg transition-colors ${rewardMode === 'payout' ? 'bg-white text-emerald-700 shadow-sm border border-emerald-100' : 'text-slate-500 hover:text-slate-800'}`}>
                              Auto-Payout (To Wallet)
                            </button>
                          </div>
                          
                          <div className="flex items-start gap-3 bg-blue-50/50 p-4 rounded-xl border border-blue-100/50">
                            <Info className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                            <p className="text-sm text-slate-600 font-medium leading-relaxed">
                              {rewardMode === 'compound' 
                                ? "Yields are automatically reinvested back into your capital pool to accelerate compounding growth (90-day escrow withdrawal rules apply)."
                                : "Yields are credited directly to your liquid Wallet balance instantly every 30 days, available for immediate withdrawal to Money Money."
                              }
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* RIGHT COLUMN: 90-DAY ESCROW & LIQUIDITY */}
                      <div className="space-y-6">
                        <div className="bg-white rounded-[24px] p-6 sm:p-8 shadow-sm border border-slate-100 relative overflow-hidden h-auto flex flex-col">
                          <div className="absolute top-0 right-0 w-48 h-48 bg-orange-50 rounded-bl-full -mr-12 -mt-12 pointer-events-none" />
                          <div className="flex items-center gap-3 mb-6 relative z-10">
                            <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-2xl flex items-center justify-center shadow-inner">
                              <Clock className="w-6 h-6" />
                            </div>
                            <div>
                              <h3 className="text-xl font-black text-slate-800 tracking-tight">Active 90-Day Escrow</h3>
                              <p className="text-sm text-slate-500 font-medium">Pending withdrawal timeline</p>
                            </div>
                          </div>
                          
                          <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 relative mb-8">
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Locked Capital in Exit Queue</p>
                            <p className="text-3xl font-black text-slate-800 mb-6 font-mono tracking-tight">UGX <span className="text-orange-500">1,500,000</span></p>
                            <div className="mb-2 flex justify-between text-xs font-bold">
                              <span className="text-slate-500">Initiated: Mar 15</span>
                              <span className="text-orange-600">Release: Jun 13</span>
                            </div>
                            <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden shadow-inner">
                              <div className="h-full bg-gradient-to-r from-orange-400 to-orange-500 w-[15%] rounded-full shadow-[0_0_10px_rgba(249,115,22,0.5)]"></div>
                            </div>
                            <p className="text-center text-[10px] sm:text-xs text-slate-500 font-semibold mt-4">
                              14 days down • 76 days remaining
                            </p>
                          </div>

                          <div className="mt-auto">
                            <p className="text-xs text-slate-500 font-medium mb-3 text-center px-4">
                              Initiating a withdrawal instantly pauses monthly rewards on the requested amount.
                            </p>
                            <button onClick={() => toast.error('Withdrawal gateway is currently locked')} className="cursor-pointer w-full border-2 border-red-100 text-red-600 hover:bg-red-50 hover:border-red-200 py-3.5 sm:py-4 font-black text-xs uppercase tracking-widest rounded-xl transition-all shadow-sm">
                              Request Capital Withdrawal
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* FULL WIDTH: PORTFOLIO TRANCHES */}
                    <div className="bg-white rounded-[24px] p-6 sm:p-8 shadow-sm border border-slate-100 overflow-hidden">
                      <h3 className="text-xl font-black text-slate-800 tracking-tight mb-6">Active Portfolio Tranches</h3>
                      <div className="overflow-x-auto -mx-6 sm:mx-0 px-6 sm:px-0">
                        <table className="w-full text-left border-collapse min-w-[600px]">
                          <thead>
                            <tr className="border-b-2 border-slate-100 text-slate-400 text-[10px] uppercase tracking-widest">
                              <th className="pb-4 px-4 font-black">Portfolio ID</th>
                              <th className="pb-4 px-4 font-black">Date Funded</th>
                              <th className="pb-4 px-4 font-black text-right">Active Capital</th>
                              <th className="pb-4 px-4 font-black text-center">ROI Rate</th>
                              <th className="pb-4 px-4 font-black text-right">Earned Rewards</th>
                            </tr>
                          </thead>
                          <tbody className="text-sm font-medium text-slate-700 divide-y divide-slate-50">
                            <tr className="hover:bg-slate-50 transition-colors group cursor-pointer">
                              <td className="py-4 px-4 font-bold text-slate-900 flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> WPF-7291
                              </td>
                              <td className="py-4 px-4 text-slate-500">Mar 12, 2026</td>
                              <td className="py-4 px-4 font-mono text-right font-black text-slate-800">UGX <span className="text-emerald-600">5,000,000</span></td>
                              <td className="py-4 px-4 text-center">
                                <span className="bg-emerald-100 text-emerald-700 px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider">15% Standard</span>
                              </td>
                              <td className="py-4 px-4 font-mono text-right text-slate-600 font-bold">UGX 1,500,000</td>
                            </tr>
                            <tr className="hover:bg-slate-50 transition-colors group cursor-pointer">
                              <td className="py-4 px-4 font-bold text-slate-900 flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-emerald-500"></span> WPF-4827
                              </td>
                              <td className="py-4 px-4 text-slate-500">Feb 01, 2026</td>
                              <td className="py-4 px-4 font-mono text-right font-black text-slate-800">UGX <span className="text-emerald-600">2,500,000</span></td>
                              <td className="py-4 px-4 text-center">
                                <span className="bg-blue-100 text-blue-700 px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider">20% Premium</span>
                              </td>
                              <td className="py-4 px-4 font-mono text-right text-slate-600 font-bold">UGX 750,000</td>
                            </tr>
                          </tbody>
                        </table>
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
                        <button className="cursor-pointer whitespace-nowrap bg-emerald-50 text-emerald-700 px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-emerald-100 transition-colors">
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
                            <button className="cursor-pointer flex-1 sm:flex-none border border-slate-200 bg-white text-slate-600 px-4 py-2 rounded-xl text-xs font-bold hover:border-slate-300 hover:bg-slate-50 transition-colors shadow-sm">
                              Edit Limit
                            </button>
                            <button className="cursor-pointer flex-1 sm:flex-none bg-red-50 border border-red-100 text-red-600 px-4 py-2 rounded-xl text-xs font-bold hover:bg-red-100 transition-colors shadow-sm">
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
                            <button className="cursor-pointer w-full sm:w-auto border border-slate-200 bg-white text-slate-500 px-4 py-2 rounded-xl text-xs font-bold hover:border-slate-300 transition-colors shadow-sm">
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

                    <div className="bg-white rounded-[24px] p-6 sm:p-8 shadow-sm border border-slate-100 group hover:border-emerald-200 transition-colors cursor-pointer">
                      <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                        <ShieldCheck className="w-8 h-8" />
                      </div>
                      <h3 className="text-xl font-black text-slate-800 tracking-tight mb-2">Investment Certificate</h3>
                      <p className="text-slate-500 text-sm font-medium mb-8">
                        Generate a formalized, stamped PDF certificate proving your active capital pool balance and status as a secured Welile Supporter.
                      </p>
                      <div className="flex items-center gap-2 text-emerald-600 font-bold text-sm bg-emerald-50 px-4 py-3 rounded-xl w-max">
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
                        <button className="cursor-pointer w-full mt-4 bg-slate-700 text-white text-xs font-bold py-2 rounded-lg hover:bg-slate-600 transition-colors">
                          Update Mandate
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB 5: ROLE MANAGEMENT */}
                {activeTab === 'roles' && (
                  <RoleManagementTab
                    platformRoles={platformRoles}
                    rolesLoading={rolesLoading}
                    activeRole={activeRole}
                    onFetchRoles={async () => {
                      setRolesLoading(true);
                      try {
                        const data = await getMyRoles();
                        setPlatformRoles(data.roles);
                        setActiveRole(data.activeRole);
                      } catch { toast.error('Failed to load roles'); }
                      finally { setRolesLoading(false); }
                    }}
                    onRequestRole={async (role: string) => {
                      try {
                        const res = await requestRole(role);
                        toast.success(res.message);
                        // Refresh roles
                        const data = await getMyRoles();
                        setPlatformRoles(data.roles);
                      } catch (err: any) {
                        toast.error(err.response?.data?.message || 'Failed to request role');
                      }
                    }}
                    onSwitchRole={async (role: string) => {
                      try {
                        const res = await switchRole(role);
                        updateSession(res.access_token, { ...res.user, role: res.user.role as any });
                        toast.success(`Switched to ${role} dashboard!`);
                        const dashboardRoutes: Record<string, string> = {
                          FUNDER: '/funder', LANDLORD: '/landlord', TENANT: '/tenant', AGENT: '/agent'
                        };
                        navigate(dashboardRoutes[role] || '/');
                      } catch (err: any) {
                        toast.error(err.response?.data?.message || 'Failed to switch role');
                      }
                    }}
                  />
                )}

              </div>
            </div>
          </main>

          <FunderBottomNav activePage="Account" />

        </div>
      </div>

      {/* DELETE CONFIRMATION MODAL */}
      {accountToDelete && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/20 backdrop-blur-[2px] animate-in fade-in duration-150">
          <div className="bg-white rounded-[24px] p-6 sm:p-8 max-w-sm w-full shadow-xl animate-in fade-in zoom-in-95 duration-200">
            <div className="w-16 h-16 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Trash2 className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-black text-slate-800 text-center mb-2">Remove Account?</h3>
            <p className="text-slate-500 text-sm font-medium text-center mb-8 leading-relaxed">
              Are you sure you want to delete this verified withdrawal method? You will need to wait 48 hours to withdraw if you add it again.
            </p>
            <div className="flex gap-3">
              <button 
                onClick={() => setAccountToDelete(null)} 
                className="cursor-pointer flex-1 py-3 text-slate-500 font-bold bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors text-sm"
              >
                Cancel
              </button>
              <button 
                onClick={() => {
                  setAccounts(accounts.filter(a => a.id !== accountToDelete));
                  setAccountToDelete(null); toast.success('Withdrawal method removed securely!');
                }} 
                className="cursor-pointer flex-1 py-3 text-white font-bold bg-red-600 hover:bg-red-700 shadow flex justify-center items-center rounded-xl transition-colors text-sm"
              >
                Yes, Remove
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SMS OTP VOLATILE MODAL */}
      {showOtpModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white rounded-[24px] w-full max-w-sm p-8 shadow-2xl animate-in zoom-in-95 duration-300 relative border border-slate-100/50">
            <div className="mx-auto w-16 h-16 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mb-6 shadow-sm border border-emerald-100/50">
              <Smartphone className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-black text-slate-900 text-center tracking-tight mb-2">Verify Ownership</h3>
            <p className="text-sm font-medium text-slate-500 text-center mb-8 leading-relaxed px-2">
              Enter the 6-digit confirmation code transmitted securely via Africa's Talking to your registered line.
            </p>
            <div className="space-y-4">
              <input
                type="text"
                autoFocus
                maxLength={6}
                value={otpInput}
                onChange={e => setOtpInput(e.target.value.replace(/[^0-9]/g, ''))}
                className="w-full text-center tracking-[0.5em] text-2xl font-black bg-slate-50 border-2 border-slate-200 rounded-xl px-4 py-4 text-slate-800 focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 transition-all placeholder:text-slate-300 placeholder:font-medium placeholder:tracking-normal"
                placeholder="000000"
              />
              <div className="flex gap-3 pt-4">
                <button onClick={() => setShowOtpModal(false)} className="flex-1 cursor-pointer bg-white text-slate-600 border border-slate-200 font-bold py-3.5 rounded-xl hover:bg-slate-50 transition-colors shadow-sm text-sm">Cancel</button>
                <button disabled={isVerifying2FA || otpInput.length !== 6} onClick={handleVerify2FA} className="cursor-pointer flex-1 bg-emerald-600 text-white font-bold py-3.5 rounded-xl hover:bg-emerald-700 transition-colors shadow-md text-sm disabled:opacity-50">
                  {isVerifying2FA ? 'Verifying...' : 'Confirm PIN'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

// ─────────── ROLE MANAGEMENT TAB SUB-COMPONENT ───────────
const ROLE_META: Record<string, { icon: JSX.Element; label: string; description: string }> = {
  FUNDER: { icon: <ShieldCheck className="w-6 h-6" />, label: 'Supporter / Funder', description: 'Fund the rent pool and earn monthly ROI rewards.' },
  LANDLORD: { icon: <Building2 className="w-6 h-6" />, label: 'Landlord', description: 'Register and manage rental properties.' },
  TENANT: { icon: <User className="w-6 h-6" />, label: 'Tenant', description: 'Find and rent verified properties seamlessly.' },
  AGENT: { icon: <Users className="w-6 h-6" />, label: 'Agent', description: 'Refer tenants or manage properties on commission.' },
};

function RoleManagementTab({ platformRoles, rolesLoading, activeRole, onFetchRoles, onRequestRole, onSwitchRole }: {
  platformRoles: RoleView[];
  rolesLoading: boolean;
  activeRole: string;
  onFetchRoles: () => void;
  onRequestRole: (role: string) => void;
  onSwitchRole: (role: string) => void;
}) {
  useEffect(() => { onFetchRoles(); }, []);

  const rolesToRender = platformRoles.length > 0 ? platformRoles : AVAILABLE_FALLBACK;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="lg:col-span-2 space-y-6">
        <div className="bg-white rounded-[24px] p-6 sm:p-8 shadow-sm border border-slate-100 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--color-primary-faint)] rounded-bl-full -mr-8 -mt-8 pointer-events-none" />
          <h3 className="text-xl font-black text-slate-800 tracking-tight mb-2 flex items-center gap-2">
            Platform Roles
          </h3>
          <p className="text-slate-500 text-sm font-medium mb-8 pr-12">
            Your Welile profile can hold multiple roles simultaneously. Request additional privileges to manage properties, refer clients, or rent spaces.
          </p>

          {rolesLoading ? (
            <div className="flex justify-center py-12">
              <div className="w-10 h-10 rounded-full border-4 border-slate-200 border-t-[var(--color-primary)] animate-spin" />
            </div>
          ) : (
            <div className="space-y-4">
              {rolesToRender.map((r) => {
                const meta = ROLE_META[r.role] || { icon: <User className="w-6 h-6" />, label: r.role, description: '' };
                const isCurrentActive = r.role === activeRole;

                return (
                  <div key={r.role} className={`p-5 border-2 rounded-2xl relative overflow-hidden group transition-colors ${
                    r.status === 'ACTIVE' 
                      ? (isCurrentActive ? 'border-emerald-500 bg-emerald-50/30' : 'border-emerald-200 bg-emerald-50/10')
                      : r.status === 'PENDING' 
                        ? 'border-orange-200 bg-orange-50/20'
                        : 'border-slate-100 bg-slate-50 hover:border-[var(--color-primary-light)]'
                  }`}>
                    <div className="flex items-center gap-4 mb-3">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-sm ${
                        r.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-600' : 'bg-white text-[var(--color-primary)]'
                      }`}>
                        {meta.icon}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-slate-900">{meta.label}</h4>
                          {r.status === 'ACTIVE' && (
                            <span className="bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-widest">
                              {isCurrentActive ? 'Current' : 'Active'}
                            </span>
                          )}
                          {r.status === 'PENDING' && (
                            <span className="bg-orange-100 text-orange-700 px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-widest">
                              Pending Approval
                            </span>
                          )}
                        </div>
                        <p className="text-xs font-medium text-slate-500">{meta.description}</p>
                      </div>
                    </div>

                    {r.status === 'ACTIVE' && !isCurrentActive && (
                      <button 
                        onClick={() => onSwitchRole(r.role)} 
                        className="cursor-pointer w-full bg-emerald-600 text-white font-bold py-3 rounded-xl hover:bg-emerald-700 transition-colors shadow-sm text-sm"
                      >
                        Switch to {meta.label} Dashboard
                      </button>
                    )}
                    {r.status === 'ACTIVE' && isCurrentActive && (
                      <div className="w-full text-center text-emerald-600 font-bold py-3 text-sm">
                        ✓ You are currently using this role
                      </div>
                    )}
                    {r.status === 'PENDING' && (
                      <div className="w-full text-center text-orange-600 font-bold py-3 text-sm flex items-center justify-center gap-2">
                        <Clock className="w-4 h-4" /> Awaiting admin approval...
                      </div>
                    )}
                    {r.status === 'AVAILABLE' && (
                      <button 
                        onClick={() => onRequestRole(r.role)} 
                        className="cursor-pointer w-full bg-slate-900 text-white font-bold py-3 rounded-xl hover:bg-slate-800 transition-colors shadow-sm text-sm"
                      >
                        Request {meta.label} Access
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Side info panel */}
      <div className="space-y-6">
        <div className="bg-white rounded-[24px] p-6 shadow-sm border border-slate-100">
          <div className="flex items-start gap-3 mb-4">
            <Info className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-slate-800 text-sm mb-1">How Role Switching Works</h4>
              <p className="text-xs text-slate-500 font-medium leading-relaxed">
                When you switch roles, a new security token is issued automatically. You'll be redirected to the corresponding dashboard without needing to log in again.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <ShieldAlert className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-slate-800 text-sm mb-1">Role Approval</h4>
              <p className="text-xs text-slate-500 font-medium leading-relaxed">
                Requested roles require admin verification before activation. You'll be notified once approved.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const AVAILABLE_FALLBACK: RoleView[] = [
  { role: 'FUNDER', status: 'ACTIVE', assignedAt: null },
  { role: 'LANDLORD', status: 'AVAILABLE', assignedAt: null },
  { role: 'TENANT', status: 'AVAILABLE', assignedAt: null },
  { role: 'AGENT', status: 'AVAILABLE', assignedAt: null },
];
