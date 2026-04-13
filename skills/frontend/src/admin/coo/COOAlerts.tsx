import React, { useState } from 'react';
import { AlertTriangle, AlertCircle, ShieldAlert, CheckCircle, Clock } from 'lucide-react';
import toast from 'react-hot-toast';

type AlertLevel = 'CRITICAL' | 'WARNING' | 'INFO';

const mockAlerts = [
  { id: 'AL-001', level: 'CRITICAL', title: 'Float Limit Breach', message: 'Disbursal Escrow wallet has dropped below the UGX 2M minimum threshold. Current balance: UGX 1.4M.', time: '10 mins ago' },
  { id: 'AL-002', level: 'CRITICAL', title: 'Suspicious Transaction Size', message: 'Incoming deposit of UGX 150M exceeds standard partner limits. Requires anti-money laundering (AML) sign-off.', time: '1 hour ago' },
  { id: 'AL-003', level: 'WARNING', title: 'Missed Collection Targets', message: 'Agent Okwalinga Peter missed 5 consecutive scheduled payments today.', time: '2 hours ago' },
  { id: 'AL-004', level: 'WARNING', title: 'API Sync Failure', message: 'MTN Mobile Money webhook callback failed 3 times in the last hour. Payments may be delayed.', time: '3 hours ago' },
  { id: 'AL-005', level: 'INFO', title: 'Unusual Login Activity', message: 'Admin account "Lule Francis" logged in from a new IP address outside regular hours.', time: '5 hours ago' },
];

const COOAlerts: React.FC = () => {
  const [alerts, setAlerts] = useState(mockAlerts);

  const handleAcknowledge = (id: string) => {
    setAlerts(alerts.filter(a => a.id !== id));
    toast.success('Alert acknowledged and archived');
  };

  const getLevelStyles = (level: string) => {
    switch (level) {
      case 'CRITICAL': return { bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-700', icon: <ShieldAlert className="text-red-600" size={20} />, badge: 'bg-red-100 text-red-800' };
      case 'WARNING': return { bg: 'bg-orange-50', border: 'border-orange-200', text: 'text-orange-700', icon: <AlertTriangle className="text-orange-500" size={20} />, badge: 'bg-orange-100 text-orange-800' };
      case 'INFO': return { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-700', icon: <AlertCircle className="text-blue-500" size={20} />, badge: 'bg-blue-100 text-blue-800' };
      default: return { bg: 'bg-slate-50', border: 'border-slate-200', text: 'text-slate-700', icon: <AlertCircle />, badge: 'bg-slate-100 text-slate-800' };
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold font-outfit text-slate-800">System Alerts & Risk</h2>
          <p className="text-sm text-slate-500">Automated monitoring for financial and operational anomalies</p>
        </div>
        <div className="bg-slate-100 px-3 py-1.5 rounded-lg text-sm font-bold text-slate-600">
          {alerts.length} Active Alerts
        </div>
      </div>

      <div className="space-y-4">
        {alerts.map((alert) => {
          const style = getLevelStyles(alert.level);
          return (
            <div key={alert.id} className={`${style.bg} border ${style.border} rounded-3xl p-5 shadow-sm flex flex-col sm:flex-row sm:items-start justify-between gap-4 transition-all hover:shadow-md`}>
              <div className="flex space-x-4">
                <div className="flex-shrink-0 mt-1">
                  {style.icon}
                </div>
                <div>
                  <div className="flex items-center space-x-2 mb-1">
                    <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-md ${style.badge}`}>
                      {alert.level}
                    </span>
                    <span className="text-xs text-slate-500 flex items-center font-medium">
                      <Clock size={12} className="mr-1" /> {alert.time}
                    </span>
                  </div>
                  <h3 className={`text-lg font-bold ${style.text}`}>{alert.title}</h3>
                  <p className="text-sm text-slate-700 mt-1 max-w-3xl">{alert.message}</p>
                </div>
              </div>
              <div className="flex-shrink-0">
                 <button 
                   onClick={() => handleAcknowledge(alert.id)}
                   className="w-full sm:w-auto flex items-center justify-center space-x-1 border border-slate-300 bg-white text-slate-700 px-3 py-2 rounded-lg hover:bg-slate-50 hover:text-green-600 hover:border-green-300 transition text-sm font-bold"
                 >
                   <CheckCircle size={16} /> <span>Acknowledge</span>
                 </button>
              </div>
            </div>
          );
        })}

        {alerts.length === 0 && (
          <div className="bg-white p-12 rounded-3xl border border-slate-100 text-center flex flex-col items-center">
            <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="text-green-500" size={32} />
            </div>
            <h3 className="text-xl font-bold text-slate-800">All Clear</h3>
            <p className="text-slate-500 mt-2">There are no operational or financial risk alerts at this time.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default COOAlerts;
