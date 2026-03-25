import { UserPlus } from 'lucide-react';
import { useState, useEffect } from 'react';
import { getMyNetwork } from '../services/agentApi';
import toast from 'react-hot-toast';

export default function SubAgents() {
  const [teamMembers, setTeamMembers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchNetwork = async () => {
      try {
        const data = await getMyNetwork();
        setTeamMembers(data || []);
      } catch (err) {
        toast.error('Failed to load sub-agents network');
      } finally {
        setIsLoading(false);
      }
    };
    fetchNetwork();
  }, []);

  return (
    <div className="bg-background-light dark:bg-background-dark font-sans text-slate-900 dark:text-slate-100 min-h-screen flex flex-col">
      <header className="px-4 py-6 border-b border-primary/10">
        <h1 className="text-2xl font-bold">Sub Agents</h1>
      </header>
      
      <main className="flex-1 overflow-y-auto pb-24">
        <div className="p-4 flex flex-col gap-6">
          <div className="w-full">
            <button className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl h-14 bg-primary text-white font-bold text-lg shadow-lg shadow-primary/20 active:scale-[0.98] transition-all">
              <UserPlus size={24} />
              <span>Add Sub Agent</span>
            </button>
          </div>
          
          <section>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-slate-900 dark:text-white text-xl font-bold tracking-tight">Your Team</h3>
              <span className="text-primary text-sm font-semibold bg-primary/10 px-3 py-1 rounded-full">{teamMembers.length} Active</span>
            </div>
            
            <div className="flex flex-col gap-3">
              {isLoading ? (
                <div className="p-8 text-center text-sm text-slate-500">Loading sub-agents...</div>
              ) : teamMembers.length === 0 ? (
                <div className="p-8 text-center text-sm text-slate-500">No sub-agents in your network yet.</div>
              ) : (
                teamMembers.map((member: any) => (
                  <div key={member.id} className="flex items-center gap-4 bg-white dark:bg-slate-900 p-4 rounded-xl border border-primary/5 shadow-sm">
                    <div className="size-14 shrink-0 overflow-hidden rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold text-xl uppercase">
                      {(member.sub_agent_id || 'UA').substring(0, 2)}
                    </div>
                    <div className="flex-1">
                      <p className="text-slate-900 dark:text-white font-bold">{member.sub_agent_id === 'pending_auth_uuid_for_0' ? 'Pending Acceptance' : member.sub_agent_id}</p>
                      <p className="text-slate-500 dark:text-slate-400 text-sm capitalize">{member.source?.replace(/_/g, ' ') || 'Referral'}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] text-slate-400 uppercase font-bold tracking-tighter">Joined</p>
                      <p className="text-slate-900 dark:text-white text-xs font-bold">{new Date(member.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>
        </div>
      </main>

    </div>
  );
}
