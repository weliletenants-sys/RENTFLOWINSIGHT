import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { 
  PieChart, TrendingUp, Wallet, Users, Landmark, Target, FileText,
  ShieldCheck, RefreshCw, BookOpen, Gift, ArrowDownCircle,
  ArrowUpCircle, Activity, Globe, ClipboardList, DollarSign,
  Truck, HelpCircle, Layers, Star, Building2, Anchor, LogOut
} from 'lucide-react';
import { ExecutiveDashboardLayout } from '../components/layout/ExecutiveDashboardLayout';

const SIDEBAR_FINANCE = [
  { name: 'Overview', to: 'dashboard', icon: <PieChart size={18} /> },
  { name: 'ROI Requests', to: '#', icon: <TrendingUp size={18} /> },
  { name: 'Rent Payouts', to: '#', icon: <Wallet size={18} /> },
  { name: 'Financial Agents', to: '#', icon: <DollarSign size={18} /> },
  { name: 'Cash-Out Agents', to: '#', icon: <Landmark size={18} /> },
  { name: 'Float Management', to: '#', icon: <Target size={18} /> },
  { name: 'Financial Statements', to: 'statements', icon: <FileText size={18} /> },
  { name: 'Solvency & Buffer', to: 'solvency', icon: <ShieldCheck size={18} /> },
  { name: 'Reconciliation', to: 'reconciliation', icon: <RefreshCw size={18} /> },
  { name: 'General Ledger', to: 'ledger', icon: <BookOpen size={18} /> },
  { name: 'Commission Payouts', to: 'commissions', icon: <Gift size={18} /> },
  { name: 'Withdrawals', to: 'withdrawals', icon: <ArrowDownCircle size={18} /> },
  { name: 'Partner Top-ups', to: '#', icon: <ArrowUpCircle size={18} /> },
  { name: 'Wallet Retractions', to: '#', icon: <Activity size={18} /> },
  { name: 'Rent Collections', to: '#', icon: <FileText size={18} /> },
  { name: 'Agent Rankings', to: '#', icon: <Star size={18} /> },
  { name: 'Approval Audit', to: '#', icon: <ClipboardList size={18} /> },
];

const SIDEBAR_DISBURSEMENTS = [
  { name: 'Agent Activity', to: '#', icon: <Activity size={18} /> },
  { name: 'Proxy Agents', to: '#', icon: <Users size={18} /> },
  { name: 'Agent Requisitions', to: '#', icon: <ClipboardList size={18} /> },
  { name: 'Payroll & Advances', to: '#', icon: <Users size={18} /> },
  { name: 'Delivery Pipeline', to: '#', icon: <Truck size={18} /> },
  { name: 'Cash Reconciliation', to: '#', icon: <HelpCircle size={18} /> },
  { name: 'Landlord Payouts', to: '#', icon: <Building2 size={18} /> },
  { name: 'Advanced Ledgers', to: '#', icon: <Layers size={18} /> },
  { name: 'Angel Pool', to: '#', icon: <Anchor size={18} /> },
];

const SIDEBAR_ADVANCES = [
  { name: 'Manage Advances', to: '#', icon: <Wallet size={18} /> },
];

export default function CFODashboard() {
  const navigate = useNavigate();

  return (
    <ExecutiveDashboardLayout title="Finance Workspace">
      <div className="flex h-[calc(100vh-4rem)] overflow-hidden bg-slate-50">
        
        {/* Massive 30+ Tab Sidebar from Mockup */}
        <div className="w-[280px] flex-shrink-0 bg-white border-r overflow-y-auto hidden md:block">
          <div className="py-6 px-4">
            
            <h3 className="text-xs font-bold text-slate-400 tracking-wider mb-3 uppercase">Finance</h3>
            <nav className="space-y-1 mb-8">
              {SIDEBAR_FINANCE.map((item) => (
                item.to === '#' ? (
                  <div key={item.name} className="flex items-center px-3 py-2 text-sm font-medium text-slate-500 rounded-lg cursor-not-allowed opacity-60">
                    <span className="mr-3">{item.icon}</span>
                    {item.name}
                  </div>
                ) : (
                  <NavLink
                    key={item.name}
                    to={item.to}
                    className={({ isActive }) =>
                      `flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                        isActive
                          ? 'bg-purple-100 text-purple-700'
                          : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                      }`
                    }
                  >
                    <span className="mr-3">{item.icon}</span>
                    {item.name}
                  </NavLink>
                )
              ))}
            </nav>

            <h3 className="text-xs font-bold text-slate-400 tracking-wider mb-3 uppercase">Disbursements</h3>
            <nav className="space-y-1 mb-8">
              {SIDEBAR_DISBURSEMENTS.map((item) => (
                <div key={item.name} className="flex items-center px-3 py-2 text-sm font-medium text-slate-500 rounded-lg cursor-not-allowed opacity-60">
                  <span className="mr-3">{item.icon}</span>
                  {item.name}
                </div>
              ))}
            </nav>

            <h3 className="text-xs font-bold text-slate-400 tracking-wider mb-3 uppercase">Advances</h3>
            <nav className="space-y-1 mb-8">
              {SIDEBAR_ADVANCES.map((item) => (
                <div key={item.name} className="flex items-center px-3 py-2 text-sm font-medium text-slate-500 rounded-lg cursor-not-allowed opacity-60">
                  <span className="mr-3">{item.icon}</span>
                  {item.name}
                </div>
              ))}
            </nav>

            <button 
              onClick={() => navigate('/admin/dashboard')}
              className="flex items-center px-3 py-2 text-sm font-medium text-slate-600 hover:text-red-600 w-full transition-colors mt-4 border-t pt-4"
            >
              <LogOut size={18} className="mr-3" />
              Exit Dashboard
            </button>
            
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto">
           <Outlet />
        </div>
      </div>
    </ExecutiveDashboardLayout>
  );
}
