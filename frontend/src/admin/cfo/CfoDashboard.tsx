import { useState, useEffect } from 'react';
import axios from 'axios';

// Import Layout Components
import CFOSidebar from './components/CFOSidebar';
import CFOHeader from './components/CFOHeader';

// Import Tab Components
import OverviewTab from './components/OverviewTab';
import FinancialStatementsTab from './components/FinancialStatementsTab';
import SolvencyBufferTab from './components/SolvencyBufferTab';
import ReconciliationTab from './components/ReconciliationTab';
import GeneralLedgerTab from './components/GeneralLedgerTab';
import CommissionPayoutsTab from './components/CommissionPayoutsTab';
import WithdrawalsTab from './components/WithdrawalsTab';

type TabType = 'overview' | 'statements' | 'solvency' | 'reconciliation' | 'ledger' | 'commissions' | 'withdrawals';

export default function CfoDashboard() {
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [dateFilter, setDateFilter] = useState('30d');

  // Data States
  const [overviewMetrics, setOverviewMetrics] = useState<any>(null);
  const [reconciliation, setReconciliation] = useState<any>(null);
  const [withdrawals, setWithdrawals] = useState<any[]>([]);
  const [statements, setStatements] = useState<any>(null);
  const [commissions, setCommissions] = useState<any[]>([]);

  const fetchOverview = async () => {
    try {
      const { data } = await axios.get(`/api/cfo/statistics/overview?range=${dateFilter}`);
      setOverviewMetrics(data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchReconciliation = async () => {
    try {
      const { data } = await axios.get(`/api/cfo/reconciliations?range=${dateFilter}`);
      setReconciliation(data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchWithdrawals = async () => {
    // Current pending requests shouldn't really be filtered by range, but we pass it anyway.
    try {
      const { data } = await axios.get(`/api/cfo/withdrawals/pending?range=${dateFilter}`);
      setWithdrawals(data.withdrawals || []);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchStatements = async () => {
    try {
      const { data } = await axios.get(`/api/cfo/statements?range=${dateFilter}`);
      setStatements(data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchCommissions = async () => {
    try {
      const { data } = await axios.get(`/api/cfo/commissions/pending?range=${dateFilter}`);
      setCommissions(data.commissions || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (activeTab === 'overview') fetchOverview();
    if (activeTab === 'reconciliation') fetchReconciliation();
    if (activeTab === 'withdrawals') fetchWithdrawals();
    if (activeTab === 'statements' || activeTab === 'solvency') fetchStatements();
    if (activeTab === 'commissions') fetchCommissions();
  }, [activeTab, dateFilter]);

  // Map tabs to Page Titles for the Header
  const getPageInfo = () => {
    switch (activeTab) {
      case 'overview': return { title: 'Overview', subtitle: 'Detailed overview of your operations' };
      case 'statements': return { title: 'Financial Statements', subtitle: 'Income statement and balance sheet tracking' };
      case 'solvency': return { title: 'Solvency & Buffer', subtitle: 'Platform liquidity and coverage ratios' };
      case 'reconciliation': return { title: 'Reconciliation', subtitle: 'Automated gap detection engine' };
      case 'ledger': return { title: 'General Ledger', subtitle: 'Full transactional double-entry ledger' };
      case 'commissions': return { title: 'Commission Payouts', subtitle: 'Pending agent commissions requiring sign-off' };
      case 'withdrawals': return { title: 'Withdrawals Engine', subtitle: 'Pending withdrawal clearances' };
      default: return { title: 'Overview', subtitle: 'Detailed overview of your operations' };
    }
  };

  const pageInfo = getPageInfo();

  return (
    <div className="flex h-screen bg-[#F9F9FB] text-slate-900 font-inter">
      {/* Desktop Sidebar */}
      <CFOSidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <CFOHeader pageTitle={pageInfo.title} pageSubtitle={pageInfo.subtitle} dateFilter={dateFilter} setDateFilter={setDateFilter} />

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto w-full max-w-7xl mx-auto p-4 md:p-6 lg:p-8 pb-20 md:pb-8">
           {activeTab === 'overview' && <OverviewTab overviewMetrics={overviewMetrics} />}
           {activeTab === 'statements' && <FinancialStatementsTab statementsData={statements} />}
           {activeTab === 'solvency' && <SolvencyBufferTab solvencyData={statements?.solvency} />}
           {activeTab === 'reconciliation' && <ReconciliationTab reconciliationData={reconciliation} />}
           {activeTab === 'ledger' && <GeneralLedgerTab />}
           {activeTab === 'commissions' && <CommissionPayoutsTab commissionsData={commissions} fetchCommissions={fetchCommissions} />}
           {activeTab === 'withdrawals' && <WithdrawalsTab withdrawals={withdrawals} fetchWithdrawals={fetchWithdrawals} />}
        </main>
      </div>
    </div>
  );
}
