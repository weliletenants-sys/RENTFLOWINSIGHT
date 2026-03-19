import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  Bell, Settings, Search, SlidersHorizontal, Plus, 
  MoreVertical, UserSearch, ArrowLeft 
} from 'lucide-react';

export default function AgentRentRequests() {
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState<'approved' | 'pending' | 'archive'>('approved');
  
  const [requests, setRequests] = useState<any[]>([]);
  
  // New Request Form State
  const [tenantName, setTenantName] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [duration, setDuration] = useState('30');
  const [formLoading, setFormLoading] = useState(false);

  useEffect(() => {
    fetchRentRequests();
  }, []);

  const fetchRentRequests = async () => {
    try {
      const { data } = await axios.get('/api/agent/rent-requests');
      setRequests(data.requests || []);
    } catch (error) {
      console.error('Failed to fetch requests', error);
    }
  };

  const handleCreateRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || Number(amount) <= 0) return alert("Please enter a valid amount");
    
    setFormLoading(true);
    const payload = {
      tenant_name: tenantName || 'Unknown Tenant',
      amount: Number(amount),
      duration_days: Number(duration),
    };

    if (!navigator.onLine) {
      const offlineQueue = JSON.parse(localStorage.getItem('pending_rent_requests') || '[]');
      offlineQueue.push({ ...payload, timestamp: Date.now() });
      localStorage.setItem('pending_rent_requests', JSON.stringify(offlineQueue));
      alert("Saved Offline. Will sync when connection returns.");
      setFormLoading(false);
      setTenantName('');
      setAmount('');
      return;
    }

    try {
      await axios.post('/api/agent/rent-requests', payload);
      alert("Request Successfully Created");
      setTenantName('');
      setAmount('');
      fetchRentRequests();
      setActiveTab('pending');
    } catch (error: any) {
      alert(error.response?.data?.message || 'Error creating request');
    } finally {
      setFormLoading(false);
    }
  };

  const handleProcess = async (id: string) => {
    if (!confirm("Are you sure you want to mark this request as processed and initiate disbursement?")) return;
    try {
      await axios.put(`/api/agent/rent-requests/${id}/process`);
      fetchRentRequests();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to process request');
    }
  };

  const pendingRequests = requests.filter(r => r.status === 'Pending');
  const approvedRequests = requests.filter(r => r.status === 'Approved' || r.status === 'Processed');
  
  const numAmount = Number(amount) || 0;
  const processingFee = numAmount * 0.02;
  const totalRepayment = numAmount + processingFee;
  const dailyRepayment = totalRepayment / Number(duration);

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans">
      {/* Top Bar */}
      <header className="sticky top-0 z-40 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 h-20 flex items-center justify-between px-8">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/dashboard/agent')} className="p-2 text-slate-600 hover:bg-slate-100 rounded-xl transition-colors">
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Rent Requests</h1>
        </div>
        <div className="flex items-center gap-6">
          {!navigator.onLine && (
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-900/30 rounded-full">
              <span className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></span>
              <span className="text-xs font-bold text-amber-700 dark:text-amber-400">Syncing Paused</span>
              <button className="text-[10px] bg-amber-500 text-white px-2 py-0.5 rounded-full ml-1 hover:bg-amber-600">RETRY</button>
            </div>
          )}
          <div className="flex items-center gap-2">
            <button className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 relative">
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-[#6d28d9] rounded-full ring-2 ring-white dark:ring-slate-900"></span>
            </button>
            <button className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400">
              <Settings size={20} />
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 p-8 space-y-8 max-w-[1440px] mx-auto w-full">
        {/* Controls Bar */}
        <div className="flex flex-col xl:flex-row items-start xl:items-center justify-between gap-6 bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800">
          <nav className="flex p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
            <button 
              onClick={() => setActiveTab('approved')}
              className={`px-6 py-2.5 text-sm font-bold rounded-lg transition-colors ${activeTab === 'approved' ? 'bg-white dark:bg-slate-700 text-[#6d28d9] shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
            >
              Approved ({approvedRequests.length})
            </button>
            <button 
              onClick={() => setActiveTab('pending')}
              className={`px-6 py-2.5 text-sm font-bold rounded-lg transition-colors ${activeTab === 'pending' ? 'bg-white dark:bg-slate-700 text-[#6d28d9] shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
            >
              Pending ({pendingRequests.length})
            </button>
            <button 
              onClick={() => setActiveTab('archive')}
              className={`px-6 py-2.5 text-sm font-bold rounded-lg transition-colors ${activeTab === 'archive' ? 'bg-white dark:bg-slate-700 text-[#6d28d9] shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
            >
              Archive
            </button>
          </nav>

          <div className="flex flex-1 items-center gap-3 w-full xl:w-auto xl:max-w-xl">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border-none rounded-xl focus:ring-2 focus:ring-[#6d28d9]/50 text-sm outline-none" 
                placeholder="Search tenants, properties, or amounts..." 
                type="text" 
              />
            </div>
            <button className="flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 transition-colors">
              <SlidersHorizontal size={18} />
              <span>Filters</span>
            </button>
            <button className="flex items-center gap-2 px-6 py-2.5 bg-[#6d28d9] text-white rounded-xl text-sm font-bold shadow-lg shadow-[#6d28d9]/20 hover:bg-[#6d28d9]/90 transition-all hover:-translate-y-0.5">
              <Plus size={18} />
              <span>New Request</span>
            </button>
          </div>
        </div>

        {/* Content Split */}
        <div className="grid grid-cols-1 2xl:grid-cols-3 gap-8">
          <div className="2xl:col-span-2 space-y-6">
            
            {activeTab === 'approved' && (
              <>
                <div className="flex items-center justify-between px-2">
                  <h2 className="text-lg font-bold">Approved Requests</h2>
                  <span className="text-xs font-bold text-slate-500 uppercase">Showing {approvedRequests.length} results</span>
                </div>
                
                <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50/50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800">
                        <th className="px-6 py-4 text-[10px] font-bold uppercase text-slate-500 tracking-wider">Tenant & Property</th>
                        <th className="px-6 py-4 text-[10px] font-bold uppercase text-slate-500 tracking-wider">Approved Amount</th>
                        <th className="px-6 py-4 text-[10px] font-bold uppercase text-slate-500 tracking-wider">Repayment Plan</th>
                        <th className="px-6 py-4 text-[10px] font-bold uppercase text-slate-500 tracking-wider">Status</th>
                        <th className="px-6 py-4 text-[10px] font-bold uppercase text-slate-500 tracking-wider text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {approvedRequests.length === 0 && (
                        <tr>
                          <td colSpan={5} className="py-12 text-center text-slate-500 font-medium">No approved requests available</td>
                        </tr>
                      )}
                      
                      {approvedRequests.map(req => (
                        <tr key={req.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                          <td className="px-6 py-5">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-xl bg-[#6d28d9]/10 flex items-center justify-center text-[#6d28d9] font-bold uppercase">
                                {(req.tenant_name || 'U').substring(0, 2)}
                              </div>
                              <div>
                                <p className="text-sm font-bold text-slate-900 dark:text-white">{req.tenant_name || 'Unknown Tenant'}</p>
                                <p className="text-xs text-slate-500">Unlinked Property</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-5">
                            <p className="text-sm font-bold">UGX {req.amount.toLocaleString()}</p>
                            <p className="text-[10px] text-slate-400">{new Date(req.created_at).toLocaleDateString()}</p>
                          </td>
                          <td className="px-6 py-5">
                            <div className="inline-flex flex-col">
                              <span className="text-sm font-bold text-[#6d28d9]">UGX {Math.round(req.payback_plan_daily || (req.amount * 1.02)/30).toLocaleString()}/day</span>
                              <span className="text-[10px] text-slate-400">30 Days Duration</span>
                            </div>
                          </td>
                          <td className="px-6 py-5">
                            <span className={`px-3 py-1 text-[10px] font-bold uppercase rounded-full ${
                                req.status === 'Processed' 
                                ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' 
                                : 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                            }`}>
                              {req.status}
                            </span>
                          </td>
                          <td className="px-6 py-5 text-right">
                            <div className="flex items-center justify-end gap-2">
                              {req.status === 'Approved' && (
                                <button onClick={() => handleProcess(req.id)} className="px-4 py-2 bg-[#6d28d9] text-white text-xs font-bold rounded-lg hover:bg-[#6d28d9]/90">
                                  Process
                                </button>
                              )}
                              <button className="w-9 h-9 flex items-center justify-center border border-slate-200 dark:border-slate-700 rounded-lg text-slate-400 hover:text-[#6d28d9] transition-colors">
                                <MoreVertical size={18} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}

            {activeTab === 'pending' && (
              <div className="space-y-4 pt-4">
                <div className="flex items-center justify-between px-2">
                  <h2 className="text-lg font-bold">Pending Review</h2>
                  <span className="text-xs font-bold text-slate-500 uppercase">Showing {pendingRequests.length} results</span>
                </div>
                {pendingRequests.length === 0 && (
                  <div className="py-12 text-center text-slate-500 font-medium">No pending requests available</div>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {pendingRequests.map(req => {
                    const hoursWaiting = Math.floor((Date.now() - new Date(req.created_at).getTime()) / (1000 * 60 * 60));
                    const isDelayed = hoursWaiting > 24;

                    return (
                      <div key={req.id} className={`bg-white dark:bg-slate-900 rounded-2xl p-5 shadow-sm border ${isDelayed ? 'border-amber-400/50' : 'border-slate-100 dark:border-slate-800'} transition-colors`}>
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center text-amber-600 font-bold text-lg uppercase">
                              {(req.tenant_name || 'U').substring(0, 2)}
                            </div>
                            <div>
                              <h3 className="font-bold text-slate-900 dark:text-white">{req.tenant_name || 'Unknown Tenant'}</h3>
                              <p className={`text-xs ${isDelayed ? 'text-amber-600 font-bold' : 'text-slate-500'}`}>Submitted {hoursWaiting} hours ago</p>
                            </div>
                          </div>
                          <span className="px-2.5 py-1 bg-amber-100 text-amber-700 text-[9px] font-bold uppercase rounded-lg">Pending</span>
                        </div>
                        <div className="flex items-end justify-between">
                          <div>
                            <p className="text-[10px] uppercase text-slate-400 font-bold mb-1">Requested Amount</p>
                            <p className="text-lg font-bold text-slate-900 dark:text-white">UGX {req.amount.toLocaleString()}</p>
                          </div>
                          <div className="flex gap-2">
                            <button className="px-4 py-2 bg-slate-900 dark:bg-slate-700 text-white text-xs font-bold rounded-lg hover:bg-black transition-colors">Review</button>
                            <button className="px-4 py-2 bg-red-50 text-red-600 text-xs font-bold rounded-lg hover:bg-red-100 transition-colors">Deny</button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Right Sidebar: New Request */}
          <div className="2xl:col-span-1">
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 sticky top-28">
              <div className="p-6 border-b border-slate-100 dark:border-slate-800">
                <h2 className="text-xl font-bold">New Rent Request</h2>
                <p className="text-sm text-slate-500 mt-1">Create a new disbursement request</p>
              </div>
              <div className="p-6 space-y-6">
                <form onSubmit={handleCreateRequest} className="space-y-6">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-2 tracking-widest">Select Tenant</label>
                    <div className="relative">
                      <UserSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                      <input 
                        value={tenantName}
                        onChange={(e) => setTenantName(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-xl focus:ring-2 focus:ring-[#6d28d9]/50 text-sm outline-none" 
                        placeholder="Search or specify tenant name..." 
                        type="text" 
                        required 
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2">
                      <label className="block text-[10px] font-bold text-slate-500 uppercase mb-2 tracking-widest">Rent Amount (UGX)</label>
                      <input 
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-xl focus:ring-2 focus:ring-[#6d28d9]/50 text-sm font-bold outline-none" 
                        placeholder="e.g. 1,000,000" 
                        type="number" 
                        required 
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase mb-2 tracking-widest">Repayment Starts</label>
                      <input 
                         type="date" 
                         value={date}
                         onChange={(e) => setDate(e.target.value)}
                         className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-xl focus:ring-2 focus:ring-[#6d28d9]/50 text-xs outline-none" 
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase mb-2 tracking-widest">Duration</label>
                      <select 
                         value={duration}
                         onChange={(e) => setDuration(e.target.value)}
                         className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-xl focus:ring-2 focus:ring-[#6d28d9]/50 text-sm outline-none appearance-none"
                      >
                        <option value="30">30 Days</option>
                        <option value="60">60 Days</option>
                        <option value="90">90 Days</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-[#6d28d9]/5 dark:bg-[#6d28d9]/10 rounded-2xl border border-[#6d28d9]/10 space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-medium text-slate-600 dark:text-slate-400">Daily Repayment</span>
                      <span className="text-sm font-bold text-[#6d28d9]">UGX {Math.round(dailyRepayment).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-medium text-slate-600 dark:text-slate-400">Processing Fee (2%)</span>
                      <span className="text-sm font-bold text-[#6d28d9]">UGX {Math.round(processingFee).toLocaleString()}</span>
                    </div>
                    <div className="pt-2 border-t border-[#6d28d9]/10 flex justify-between items-center">
                      <span className="text-xs font-bold text-slate-900 dark:text-white uppercase">Total Repayment</span>
                      <span className="text-base font-black text-slate-900 dark:text-white">UGX {Math.round(totalRepayment).toLocaleString()}</span>
                    </div>
                  </div>
                  
                  <button disabled={formLoading} className="w-full py-4 bg-[#6d28d9] text-white font-bold rounded-xl shadow-lg shadow-[#6d28d9]/20 hover:bg-[#6d28d9]/90 transition-all hover:-translate-y-1 disabled:opacity-50" type="submit">
                    {formLoading ? 'Executing...' : 'Submit Request'}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Decorative Blur Backgrounds */}
      <div className="fixed top-0 right-0 -z-10 w-[500px] h-[500px] bg-[#6d28d9]/5 blur-[120px] rounded-full pointer-events-none"></div>
      <div className="fixed bottom-0 left-0 -z-10 w-[300px] h-[300px] bg-blue-500/5 blur-[100px] rounded-full pointer-events-none"></div>
    </div>
  );
}
