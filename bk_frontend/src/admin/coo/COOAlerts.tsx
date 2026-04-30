import React, { useState, useEffect } from 'react';
import { AlertTriangle, AlertCircle, ShieldAlert, CheckCircle, Clock, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { fetchAlerts } from '../../services/cooApi';

interface SystemEvent {
  id: string;
  type: string;
  source: string;
  description: string;
  severity: string;
  created_at: string;
}

const COOAlerts: React.FC = () => {
  const [alerts, setAlerts] = useState<SystemEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadAlerts = async () => {
      try {
        const data = await fetchAlerts();
        setAlerts(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    loadAlerts();
  }, []);

  const handleAcknowledge = (id: string) => {
    setAlerts(alerts.filter(a => a.id !== id));
    toast.success('Alert acknowledged and archived');
  };

  const getLevelStyles = (level: string) => {
    // Map backend SystemEvent severity to our frontend colors
    const severity = level.toUpperCase();
    if (severity === 'HIGH' || severity === 'CRITICAL') {
      return { bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-700', icon: <ShieldAlert className="text-red-600" size={20} />, badge: 'bg-red-100 text-red-800' };
    }
    if (severity === 'MEDIUM' || severity === 'WARNING') {
      return { bg: 'bg-orange-50', border: 'border-orange-200', text: 'text-orange-700', icon: <AlertTriangle className="text-orange-500" size={20} />, badge: 'bg-orange-100 text-orange-800' };
    }
    return { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-700', icon: <AlertCircle className="text-blue-500" size={20} />, badge: 'bg-blue-100 text-blue-800' };
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <Loader2 className="w-10 h-10 text-[#6c11d4] animate-spin mb-4" />
        <p className="text-slate-500 font-medium">Scanning risk registers...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-red-50 text-red-600 rounded-3xl border border-red-100 flex items-center shadow-sm">
        <AlertTriangle className="w-8 h-8 mr-4" />
        <div>
          <h3 className="font-bold text-lg mb-1">Failed to Load Risk Events</h3>
          <p className="text-sm">{error}</p>
        </div>
      </div>
    );
  }

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
          const style = getLevelStyles(alert.severity);
          return (
            <div key={alert.id} className={`${style.bg} border ${style.border} rounded-3xl p-5 shadow-sm flex flex-col sm:flex-row sm:items-start justify-between gap-4 transition-all hover:shadow-md`}>
              <div className="flex space-x-4">
                <div className="flex-shrink-0 mt-1">
                  {style.icon}
                </div>
                <div>
                  <div className="flex items-center space-x-2 mb-1">
                    <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-md ${style.badge}`}>
                      {alert.severity}
                    </span>
                    <span className="text-xs text-slate-500 flex items-center font-medium">
                      <Clock size={12} className="mr-1" /> {new Date(alert.created_at).toLocaleString()}
                    </span>
                  </div>
                  <h3 className={`text-lg font-bold ${style.text}`}>{alert.type || 'SYSTEM NOTIFICATION'}</h3>
                  <p className="text-sm text-slate-700 mt-1 max-w-3xl">{alert.description}</p>
                  <p className="text-[10px] text-slate-400 font-mono mt-2 uppercase">{alert.source}</p>
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
