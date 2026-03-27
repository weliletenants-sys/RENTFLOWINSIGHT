import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  X, Banknote, UserPlus, ArrowDownCircle, FileText, Receipt, 
  Wallet, HandCoins, Share2, Home, ClipboardList, Building2, 
  Search, MapPin, Users, ScrollText, Calendar, History, Handshake, 
  Trophy, TrendingUp, Target, BarChart3, PiggyBank, Store, Download, 
  Settings, HelpCircle, ChevronRight 
} from 'lucide-react';

interface AgentMenuDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenRegister?: () => void;
}

const CATEGORIES = ['Actions', 'Property', 'People', 'Earnings', 'Tools', 'More'];

export default function AgentMenuDrawer({ isOpen, onClose, onOpenRegister }: AgentMenuDrawerProps) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Actions');

  const handleItemClick = (item: any) => {
    onClose();
    if (item.action === 'register' && onOpenRegister) {
      // Delay slightly to let the drawer sliding animation finish smoothly before mounting the dialog
      setTimeout(() => onOpenRegister(), 300);
    } else if (item.path) {
      navigate(item.path);
    }
  };

  const menuData: Record<string, { label: string, icon: React.ReactNode, path?: string, action?: string, badge?: string, colorClass?: string }[]> = {
    'Actions': [
      { label: 'Pay Rent', icon: <Banknote size={24} />, path: '/agent-topup-tenant', badge: '★', colorClass: 'text-purple-500 bg-purple-50 dark:bg-purple-900/20' },
      { label: 'Register User', icon: <UserPlus size={24} />, action: 'register', colorClass: 'text-blue-500 bg-blue-50 dark:bg-blue-900/20' },
      { label: 'Deposit', icon: <ArrowDownCircle size={24} />, path: '/agent-deposit', colorClass: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-900/20' },
      { label: 'Post Rent', icon: <FileText size={24} />, path: '/agent-rent-requests', colorClass: 'text-orange-500 bg-orange-50 dark:bg-orange-900/20' },
      { label: 'Issue Receipt', icon: <Receipt size={24} />, path: '/agent-receipt', badge: 'New', colorClass: 'text-indigo-500 bg-indigo-50 dark:bg-indigo-900/20' },
      { label: 'Top Up Wallet', icon: <Wallet size={24} />, path: '/agent-wallet', colorClass: 'text-teal-500 bg-teal-50 dark:bg-teal-900/20' },
      { label: 'Invest for Partner', icon: <HandCoins size={24} />, path: '/agent-invest-partner', badge: 'Proxy', colorClass: 'text-amber-500 bg-amber-50 dark:bg-amber-900/20' },
      { label: 'Cash Payouts', icon: <Banknote size={24} />, path: '/agent/cash-payouts', badge: '💵', colorClass: 'text-green-500 bg-green-50 dark:bg-green-900/20' },
      { label: 'Invite & Refer', icon: <Share2 size={24} />, path: '/referrals', colorClass: 'text-pink-500 bg-pink-50 dark:bg-pink-900/20' },
    ],
    'Property': [
      { label: 'List House', icon: <Home size={24} />, path: '/agent-list-house', badge: '5K', colorClass: 'text-orange-500 bg-orange-50 dark:bg-orange-900/20' },
      { label: 'My Listings', icon: <ClipboardList size={24} />, path: '/agent-listings', colorClass: 'text-slate-500 bg-slate-50 dark:bg-slate-800' },
      { label: 'Manage Property', icon: <Building2 size={24} />, path: '/agent-managed-property', badge: '2%', colorClass: 'text-blue-500 bg-blue-50 dark:bg-blue-900/20' },
      { label: 'Managed Props', icon: <Home size={24} />, path: '/agent-managed-properties', colorClass: 'text-indigo-500 bg-indigo-50 dark:bg-indigo-900/20' },
      { label: 'Find Rentals', icon: <Search size={24} />, path: '/find-rentals', colorClass: 'text-purple-500 bg-purple-50 dark:bg-purple-900/20' },
      { label: 'Landlord Map', icon: <MapPin size={24} />, path: '/agent-landlord-map', badge: 'GPS', colorClass: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-900/20' },
    ],
    'People': [
      { label: 'My Tenants', icon: <Users size={24} />, path: '/dashboard/agent/clients', colorClass: 'text-blue-500 bg-blue-50 dark:bg-blue-900/20' },
      { label: 'Registrations', icon: <ClipboardList size={24} />, path: '/agent-registrations', colorClass: 'text-slate-500 bg-slate-50 dark:bg-slate-800' },
      { label: 'Rent Requests', icon: <ScrollText size={24} />, path: '/agent-rent-requests', colorClass: 'text-orange-500 bg-orange-50 dark:bg-orange-900/20' },
      { label: 'Schedules', icon: <Calendar size={24} />, path: '/schedules', badge: 'PDF', colorClass: 'text-red-500 bg-red-50 dark:bg-red-900/20' },
      { label: 'Proxy History', icon: <History size={24} />, path: '/proxy-history', colorClass: 'text-slate-500 bg-slate-50 dark:bg-slate-800' },
      { label: 'My Funders', icon: <HandCoins size={24} />, path: '/my-funders', badge: '📱', colorClass: 'text-amber-500 bg-amber-50 dark:bg-amber-900/20' },
      { label: 'Register Sub-Agent', icon: <Handshake size={24} />, path: '/register-sub-agent', badge: '500', colorClass: 'text-purple-500 bg-purple-50 dark:bg-purple-900/20' },
      { label: 'My Sub-Agents', icon: <Users size={24} />, path: '/dashboard/agent/sub-agents', colorClass: 'text-indigo-500 bg-indigo-50 dark:bg-indigo-900/20' },
      { label: 'Share Link', icon: <Share2 size={24} />, path: '/share-link', badge: '🔗', colorClass: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-900/20' },
    ],
    'Earnings': [
      { label: 'Rank System', icon: <Trophy size={24} />, path: '/rank-system', colorClass: 'text-amber-500 bg-amber-50 dark:bg-amber-900/20' },
      { label: 'My Earnings', icon: <TrendingUp size={24} />, path: '/dashboard/agent/earnings', colorClass: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-900/20' },
      { label: 'Goals', icon: <Target size={24} />, path: '/goals', colorClass: 'text-red-500 bg-red-50 dark:bg-red-900/20' },
      { label: 'Analytics', icon: <BarChart3 size={24} />, path: '/agent-analytics', colorClass: 'text-blue-500 bg-blue-50 dark:bg-blue-900/20' },
      { label: 'Withdrawals', icon: <PiggyBank size={24} />, path: '/withdrawals', colorClass: 'text-purple-500 bg-purple-50 dark:bg-purple-900/20' },
      { label: 'Referrals', icon: <Users size={24} />, path: '/referrals', colorClass: 'text-indigo-500 bg-indigo-50 dark:bg-indigo-900/20' },
    ],
    'Tools': [
      { label: 'Shop', icon: <Store size={24} />, path: '/shop', colorClass: 'text-orange-500 bg-orange-50 dark:bg-orange-900/20' },
      { label: 'Receipts', icon: <Receipt size={24} />, path: '/my-receipts', colorClass: 'text-slate-500 bg-slate-50 dark:bg-slate-800' },
      { label: 'My Loans', icon: <Banknote size={24} />, path: '/my-loans', colorClass: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-900/20' },
      { label: 'Transactions', icon: <History size={24} />, path: '/transactions', colorClass: 'text-blue-500 bg-blue-50 dark:bg-blue-900/20' },
    ],
    'More': [
      { label: 'Share App', icon: <Download size={24} />, path: '/install', colorClass: 'text-purple-500 bg-purple-50 dark:bg-purple-900/20' },
      { label: 'Agreement', icon: <ScrollText size={24} />, path: '/agent-agreement', colorClass: 'text-slate-500 bg-slate-50 dark:bg-slate-800' },
      { label: 'Settings', icon: <Settings size={24} />, path: '/dashboard/agent/settings', colorClass: 'text-slate-700 bg-slate-100 dark:bg-slate-700 dark:text-slate-300' },
      { label: 'Help', icon: <HelpCircle size={24} />, path: '/help', colorClass: 'text-blue-500 bg-blue-50 dark:bg-blue-900/20' },
    ]
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 bg-black/60 dark:bg-black/80 z-[100] transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />
      
      {/* Bottom Sheet Drawer */}
      <div 
        className={`fixed bottom-0 left-0 right-0 h-[88vh] bg-white dark:bg-[#121212] rounded-t-3xl z-[100] flex flex-col shadow-2xl transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] ${isOpen ? 'translate-y-0' : 'translate-y-full'}`}
      >
        {/* Drag Handle & Header */}
        <div className="flex flex-col items-center pt-3 pb-2 border-b border-gray-100 dark:border-slate-800 shrink-0 relative">
          <div className="w-12 h-1.5 bg-gray-200 dark:bg-slate-700 rounded-full mb-3"></div>
          <h2 className="font-bold text-gray-900 dark:text-white text-lg">Agent Hub</h2>
          <button 
            onClick={onClose} 
            className="absolute right-4 top-4 p-2 bg-gray-50 dark:bg-slate-800 rounded-full text-gray-500 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-700 transition"
          >
            <X size={18} />
          </button>
        </div>

        {/* Banner CTA for People tab */}
        {activeTab === 'People' && (
          <div className="mx-4 mt-4 p-4 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 text-white shrink-0 flex items-center justify-between shadow-sm">
             <div>
                <h3 className="font-bold text-sm">Build Your Team 🚀</h3>
                <p className="text-[11px] text-purple-100 mt-0.5 max-w-[200px]">Earn UGX 500 per signup + 1% of sub-agent collections.</p>
             </div>
             <ChevronRight size={20} className="text-white/80" />
          </div>
        )}

        {/* Scrollable Category Tabs */}
        <div className="flex overflow-x-auto hide-scrollbar px-4 py-3 shrink-0 gap-2 border-b border-gray-100 dark:border-slate-800">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveTab(cat)}
              className={`whitespace-nowrap px-4 py-2 text-sm font-semibold rounded-full transition-colors ${
                activeTab === cat 
                  ? 'bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300' 
                  : 'bg-transparent text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Grid Content */}
        <div className="overflow-y-auto flex-1 p-4 pb-12">
           <div className="grid grid-cols-3 gap-y-6 gap-x-2">
              {menuData[activeTab]?.map((item, idx) => (
                 <div 
                   key={idx} 
                   onClick={() => handleItemClick(item)}
                   className="flex flex-col items-center gap-2 cursor-pointer group relative active:scale-95 transition-transform"
                 >
                    <div className={`size-14 rounded-2xl flex items-center justify-center ${item.colorClass} group-hover:opacity-80 transition-opacity`}>
                       {item.icon}
                    </div>
                    {item.badge && (
                       <div className="absolute -top-1 right-2 bg-red-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full border-2 border-white dark:border-[#121212] shadow-sm whitespace-nowrap">
                          {item.badge}
                       </div>
                    )}
                    <span className="text-[11px] font-medium text-slate-700 dark:text-slate-300 text-center leading-tight max-w-[70px]">
                       {item.label}
                    </span>
                 </div>
              ))}
           </div>
        </div>
        
      </div>
    </>
  );
}
