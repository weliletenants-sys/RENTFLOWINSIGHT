import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { AlertTriangle, TrendingUp, CheckCircle2 } from 'lucide-react';

const mockPaymentData = [
  { name: 'MTN Mobile Money', value: 45, color: '#facc15' },
  { name: 'Airtel Money', value: 30, color: '#ef4444' },
  { name: 'Bank Transfer', value: 15, color: '#3b82f6' },
  { name: 'Cash Deposits', value: 10, color: '#10b981' },
];

const mockAlerts = [
  { id: 1, type: 'CRITICAL', msg: 'System Wallet Balance dropped below 5M UGX reserve threshold.', time: '10 mins ago' },
  { id: 2, type: 'WARNING', msg: 'Abnormal spike in withdrawn requests (14) over the last hour.', time: '2 hours ago' },
  { id: 3, type: 'SUCCESS', msg: 'Nightly master ledger synchronization completed.', time: '5 hours ago' },
];

export default function AnalyticsSummaryPanels() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      
      {/* Panel 1: Payment Mode Analytics */}
      <div className="bg-white/80 backdrop-blur-xl rounded-3xl border border-slate-100 shadow-sm p-6 md:p-8 flex flex-col hover:border-indigo-100 transition-colors">
        <div className="mb-4">
          <h2 className="text-lg font-black text-slate-800 tracking-tight flex items-center gap-2">
            <TrendingUp size={18} className="text-[#6c11d4]" />
            Volume by Channels
          </h2>
          <p className="text-xs font-semibold text-slate-500 mt-1 uppercase tracking-widest">Payment Modes Auto-classification</p>
        </div>
        
        <div className="flex-1 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="w-full sm:w-1/2 h-48 relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={mockPaymentData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {mockPaymentData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value: number) => [`${value}%`, 'Volume']}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}
                />
              </PieChart>
            </ResponsiveContainer>
            {/* Center Label inside donut */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Total</span>
              <span className="text-lg font-black text-slate-800">100%</span>
            </div>
          </div>
          
          <div className="w-full sm:w-1/2 space-y-3">
            {mockPaymentData.map(item => (
              <div key={item.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }}></div>
                  <span className="text-sm font-bold text-slate-600">{item.name}</span>
                </div>
                <span className="text-sm font-black text-slate-900">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Panel 2: Financial Alerts */}
      <div className="bg-white/80 backdrop-blur-xl rounded-3xl border border-slate-100 shadow-sm p-6 md:p-8 flex flex-col hover:border-amber-100 transition-colors">
        <div className="mb-6 flex justify-between items-center">
           <div>
              <h2 className="text-lg font-black text-slate-800 tracking-tight flex items-center gap-2">
                <AlertTriangle size={18} className="text-amber-500" />
                Live Network Anomalies
              </h2>
              <p className="text-xs font-semibold text-slate-500 mt-1 uppercase tracking-widest">Automated Trigger Audits</p>
           </div>
           <button className="text-xs font-bold text-[#6c11d4] bg-indigo-50 px-3 py-1.5 rounded-lg hover:bg-indigo-100 transition-colors">
             View All
           </button>
        </div>
        
        <div className="flex-1 space-y-4">
          {mockAlerts.map(alert => (
            <div key={alert.id} className="flex items-start gap-4 pb-4 border-b border-slate-50 last:border-0 last:pb-0">
              <div className="mt-0.5">
                {alert.type === 'CRITICAL' ? (
                  <div className="w-8 h-8 rounded-full bg-rose-50 border border-rose-100 text-rose-500 flex items-center justify-center shrink-0">
                    <AlertTriangle size={14} />
                  </div>
                ) : alert.type === 'WARNING' ? (
                  <div className="w-8 h-8 rounded-full bg-amber-50 border border-amber-100 text-amber-500 flex items-center justify-center shrink-0">
                    <AlertTriangle size={14} />
                  </div>
                ) : (
                  <div className="w-8 h-8 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-500 flex items-center justify-center shrink-0">
                    <CheckCircle2 size={14} />
                  </div>
                )}
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-slate-700 leading-tight">
                  {alert.msg}
                </p>
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mt-1">{alert.time}</p>
              </div>
            </div>
          ))}
          {mockAlerts.length === 0 && (
             <div className="h-full flex items-center justify-center text-slate-400 font-semibold text-sm">
                No active anomalies inside the network.
             </div>
          )}
        </div>
      </div>

    </div>
  );
}
