import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

export default function AgentNotificationSettings() {
  const navigate = useNavigate();
  
  const [settings, setSettings] = useState({
    pushRentReminders: true,
    emailReceipts: true,
    smsAlerts: false,
    commissionUpdates: true,
    newFeatureAnnouncements: false,
  });

  const toggle = (key: keyof typeof settings) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="bg-[#f8f6f6] dark:bg-[#221610] min-h-screen text-slate-900 dark:text-slate-100 font-['Public_Sans'] pb-10">
      <div className="max-w-md mx-auto bg-white dark:bg-slate-900 min-h-screen shadow-sm border-x border-slate-100 dark:border-slate-800">
        
        <header className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-100 dark:border-slate-800 px-4 py-4 flex items-center justify-between">
          <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-lg font-bold">Notifications</h1>
          <div className="w-9" />
        </header>

        <div className="p-6 space-y-8">
          
          <section>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Core Alerts</h3>
            <div className="space-y-4 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-sm">Push Rent Reminders</p>
                  <p className="text-xs text-slate-500">Get notified when a tenant's rent is due</p>
                </div>
                <Toggle active={settings.pushRentReminders} onClick={() => toggle('pushRentReminders')} />
              </div>
              
              <hr className="border-slate-200 dark:border-slate-700" />
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-sm">Commission Updates</p>
                  <p className="text-xs text-slate-500">Alerts when you receive a commission</p>
                </div>
                <Toggle active={settings.commissionUpdates} onClick={() => toggle('commissionUpdates')} />
              </div>

            </div>
          </section>

          <section>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Communication</h3>
            <div className="space-y-4 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-sm">Email Receipts</p>
                  <p className="text-xs text-slate-500">Receive transaction receipts via email</p>
                </div>
                <Toggle active={settings.emailReceipts} onClick={() => toggle('emailReceipts')} />
              </div>
              
              <hr className="border-slate-200 dark:border-slate-700" />
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-sm">SMS Alerts</p>
                  <p className="text-xs text-slate-500">Important alerts via text message</p>
                </div>
                <Toggle active={settings.smsAlerts} onClick={() => toggle('smsAlerts')} />
              </div>

            </div>
          </section>

          <section>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">News & Updates</h3>
            <div className="space-y-4 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-sm">Feature Announcements</p>
                  <p className="text-xs text-slate-500">New tools and updates from Welile</p>
                </div>
                <Toggle active={settings.newFeatureAnnouncements} onClick={() => toggle('newFeatureAnnouncements')} />
              </div>

            </div>
          </section>

        </div>
      </div>
    </div>
  );
}

function Toggle({ active, onClick }: { active: boolean, onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${active ? 'bg-[#6d28d9]' : 'bg-slate-300 dark:bg-slate-600'}`}
    >
      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${active ? 'translate-x-6' : 'translate-x-1'}`} />
    </button>
  );
}
