import { useState } from 'react';
import { Save, ShieldAlert, GitBranch, MessageSquarePlus, Activity } from 'lucide-react';
import toast from 'react-hot-toast';

export default function CrmSettings() {
  const [loading, setLoading] = useState(false);

  // Form State
  const [form, setForm] = useState({
    autoAssignSupport: true,
    autoAssignInquiries: false,
    escalationHours: 4,
    urgentBacklogThreshold: 50,
    readRateGood: 80,
    readRateWarning: 50,
  });

  const [quickReplies] = useState([
    { id: 1, title: 'Password Reset', message: 'You can reset your password by tapping "Forgot Password" on the login screen and following the link sent to your email.' },
    { id: 2, title: 'Withdrawal Delay', message: 'Standard withdrawals may take up to 24 hours to reflect via mobile money. Rest assured your funds are secure pipeline.' },
  ]);

  const handleSave = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast.success('CRM preferences saved successfully');
    }, 800);
  };

  return (
    <div className="max-w-5xl mx-auto pb-12">
      <div className="flex items-center justify-end mb-6">
        <button 
          onClick={handleSave}
          disabled={loading}
          className="flex items-center space-x-2 bg-[#6c11d4] hover:bg-[#5b0eae] text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-sm transition-all disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {loading ? (
             <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <Save size={18} />
          )}
          <span>{loading ? 'Saving...' : 'Save Changes'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Routing & Triage Rules */}
        <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm">
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
              <GitBranch size={20} />
            </div>
            <h3 className="text-lg font-bold font-outfit text-slate-800">Routing & Triage</h3>
          </div>

          <div className="space-y-5 flex-1">
            <label className="flex items-center justify-between cursor-pointer group p-3 hover:bg-slate-50 rounded-xl transition-colors border border-transparent hover:border-slate-100">
              <div>
                <span className="font-bold text-slate-700 text-sm block">Auto-Assign Support Tickets</span>
                <span className="text-xs text-slate-500">Automatically map new user tickets to active agents.</span>
              </div>
              <div className={`w-11 h-6 rounded-full transition-colors relative ${form.autoAssignSupport ? 'bg-[#6c11d4]' : 'bg-slate-200'}`} onClick={() => setForm(f => ({ ...f, autoAssignSupport: !f.autoAssignSupport }))}>
                <div className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${form.autoAssignSupport ? 'translate-x-5' : 'translate-x-0'}`} />
              </div>
            </label>

            <label className="flex items-center justify-between cursor-pointer group p-3 hover:bg-slate-50 rounded-xl transition-colors border border-transparent hover:border-slate-100">
              <div>
                <span className="font-bold text-slate-700 text-sm block">Auto-Assign General Inquiries</span>
                <span className="text-xs text-slate-500">Distribute general questions to the support pool.</span>
              </div>
              <div className={`w-11 h-6 rounded-full transition-colors relative ${form.autoAssignInquiries ? 'bg-[#6c11d4]' : 'bg-slate-200'}`} onClick={() => setForm(f => ({ ...f, autoAssignInquiries: !f.autoAssignInquiries }))}>
                <div className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${form.autoAssignInquiries ? 'translate-x-5' : 'translate-x-0'}`} />
              </div>
            </label>

            <div className="p-3 border-t border-slate-100 mt-2">
              <label className="font-bold text-slate-700 text-sm block mb-1">Ticket Escalation SLA</label>
              <p className="text-xs text-slate-500 mb-3">Notify managers if an unread ticket breaches this time.</p>
              <div className="flex items-center space-x-2">
                <input 
                  type="number" 
                  value={form.escalationHours}
                  onChange={(e) => setForm(f => ({ ...f, escalationHours: parseInt(e.target.value) || 0 }))}
                  className="w-20 px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-[#6c11d4]/20 focus:border-[#6c11d4] outline-none transition-all font-semibold"
                />
                <span className="text-sm font-semibold text-slate-600">Hours</span>
              </div>
            </div>
          </div>
        </div>

        {/* Alert Thresholds */}
        <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm">
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-2 bg-amber-50 text-amber-600 rounded-lg">
              <Activity size={20} />
            </div>
            <h3 className="text-lg font-bold font-outfit text-slate-800">Operational Health Targets</h3>
          </div>

          <div className="space-y-6">
            <div>
              <label className="font-bold text-slate-700 text-sm block mb-1 flex items-center gap-2">
                Unread Backlog Urgency Trigger <ShieldAlert size={14} className="text-red-500" />
              </label>
              <p className="text-xs text-slate-500 mb-3">When the unread queue crosses this number, it pulses critical.</p>
              <div className="flex items-center space-x-2">
                <input 
                  type="number" 
                  value={form.urgentBacklogThreshold}
                  onChange={(e) => setForm(f => ({ ...f, urgentBacklogThreshold: parseInt(e.target.value) || 0 }))}
                  className="w-full sm:w-32 px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-red-500/20 focus:border-red-500 outline-none transition-all font-semibold text-slate-800"
                />
                <span className="text-sm font-bold text-slate-400">Tickets</span>
              </div>
            </div>
            
            <div className="border-t border-slate-100 pt-5">
              <label className="font-bold text-slate-700 text-sm block mb-1">Read Rate Benchmarks (%)</label>
              <p className="text-xs text-slate-500 mb-3">Determines Engagement Health (Good / Moderate / Low) classification criteria.</p>
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="flex-1 bg-emerald-50 rounded-xl p-3 border border-emerald-100">
                  <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider block mb-2">Good Target ({'>'})</span>
                  <div className="flex items-center space-x-1">
                    <input 
                      type="number" 
                      value={form.readRateGood}
                      onChange={(e) => setForm(f => ({ ...f, readRateGood: parseInt(e.target.value) || 0 }))}
                      className="w-full px-2 py-1 bg-white border border-emerald-200 rounded-lg text-sm font-bold text-emerald-800 focus:outline-none"
                    />
                    <span className="text-emerald-700 font-bold">%</span>
                  </div>
                </div>

                <div className="flex-1 bg-amber-50 rounded-xl p-3 border border-amber-100">
                  <span className="text-xs font-bold text-amber-700 uppercase tracking-wider block mb-2">Warning Target ({'<'})</span>
                  <div className="flex items-center space-x-1">
                    <input 
                      type="number" 
                      value={form.readRateWarning}
                      onChange={(e) => setForm(f => ({ ...f, readRateWarning: parseInt(e.target.value) || 0 }))}
                      className="w-full px-2 py-1 bg-white border border-amber-200 rounded-lg text-sm font-bold text-amber-800 focus:outline-none"
                    />
                    <span className="text-amber-700 font-bold">%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Replies / Canned Responses */}
        <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
                <MessageSquarePlus size={20} />
              </div>
              <h3 className="text-lg font-bold font-outfit text-slate-800">Quick Replies</h3>
            </div>
            <button className="text-sm font-bold text-[#6c11d4] hover:bg-purple-50 px-3 py-1.5 rounded-lg transition-colors">
              + New Template
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {quickReplies.map((reply) => (
              <div key={reply.id} className="border border-slate-200 rounded-2xl p-4 hover:border-purple-300 hover:shadow-sm transition-all group">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-bold text-slate-800 text-sm">{reply.title}</h4>
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                    <button className="text-xs font-bold text-slate-400 hover:text-[#6c11d4]">Edit</button>
                    <button className="text-xs font-bold text-slate-400 hover:text-red-500">Delete</button>
                  </div>
                </div>
                <p className="text-sm text-slate-500 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-100 resize-none w-full italic">
                  "{reply.message}"
                </p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
