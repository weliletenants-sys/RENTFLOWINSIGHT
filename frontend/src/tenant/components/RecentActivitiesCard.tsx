import { useState, useEffect } from 'react';
import { ArrowDownToLine, Home } from 'lucide-react';
import { getTenantActivities } from '../../services/tenantApi';
import { useNavigate } from 'react-router-dom';

interface Activity {
  id: string;
  description: string;
  amount: number;
  date: string;
  type: string;
}

export default function RecentActivitiesCard() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    getTenantActivities()
      .then(setActivities)
      .catch(console.error);
  }, []);

  return (
    <section className="space-y-3 px-1">
      <div className="flex items-center justify-between">
        <h3 className="text-slate-900 dark:text-slate-100 font-bold">Recent Activities</h3>
        <a onClick={() => navigate('/dashboard/tenant/payments')} className="text-primary text-xs font-bold hover:underline cursor-pointer">View All</a>
      </div>

      <div className="space-y-3">
        {activities.length > 0 ? (
          activities.map((act) => (
            <div key={act.id} className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-primary/5 dark:border-slate-700 transition-colors">
              <div className="flex items-center gap-3">
                <div className={`size-10 rounded-full flex items-center justify-center transition-colors ${act.type === 'payment' ? 'bg-primary/10 text-primary dark:bg-purple-500/20 dark:text-purple-400' : 'bg-green-100 text-green-600 dark:bg-emerald-500/20 dark:text-emerald-400'}`}>
                  {act.type === 'payment' ? <Home size={24} /> : <ArrowDownToLine size={24} />}
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900 dark:text-slate-100 transition-colors">{act.description}</p>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 transition-colors">{new Date(act.date).toLocaleDateString()}</p>
                </div>
              </div>
              <span className={`text-sm font-bold transition-colors ${act.type === 'deposit' ? 'text-green-600 dark:text-emerald-400' : 'text-slate-900 dark:text-slate-100'}`}>
                {act.type === 'deposit' ? '+' : '-'}${Math.abs(act.amount).toLocaleString()}
              </span>
            </div>
          ))
        ) : (
          <p className="text-sm text-slate-500 italic p-3 text-center">No recent activities found.</p>
        )}
      </div>
    </section>
  );
}
