import { UserPlus } from 'lucide-react';

export default function SubAgents() {
  
  const teamMembers = [
    {
      id: 1,
      name: 'Sarah Miller',
      role: 'Top Performer • NY',
      recruits: 142,
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCELn6Io9mkboAnClKmWNCXlGHKY2MB8r8RmEnyDAVSJ0Vl9lWRYgO6u-b7tHlkyryUF2bl4kviRAkXvNTAiZNaGLXo2d96fdTPzSHRvq-BRx-AKBKFH61LxrXRTe3w4Jwbl0BonU4KZlNnEirrdMGYtKmFoZ3FeP1BSoXc2q2lm2cixMEJ3YIGIprw3L01Tss3dMWnmnXcFbgtsCtErDewoWF5zzrsDwTX4R80Q_yGKiIElUzU455r9ONBHMk3s1stdUFsRPZfBaI'
    },
    {
      id: 2,
      name: 'David Chen',
      role: 'Growth Phase • CA',
      recruits: 89,
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA_z-MuHv2hVyd6xyVcYWFFlYmfCtFJOHmWzS9NE1umMWRpJscxH5Cy5qGlhXwosdVt6lniZeD6_dfmjxLWfeRiNQPnYSZ44XUbWW2Tg23ymdlV-TSdLoAcE5_djtYKcKooLjLS6sd3KLxwecazJYc-vfd9wkpJgM76x4MTgv05ufR_Y698nh0OkQeQzmPZZGuI0UDpLKVnn1TrXiP-DdwVgKFQ55cQxDsLV0jR0JYEHH3fy7ZBpFgD2voRM77TKklBEoPQNc4Ovpo'
    },
    {
       id: 3,
       name: 'Elena Rodriguez',
       role: 'New Agent • TX',
       recruits: 34,
       image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCsuGRn9xNNA3sXm4UdUm1lnT5SgX5KcQALs8yBD8PP57RkFfSBwanFrRys22j8SDadB9F34CCbt1MVWqbYQPM27b4-4ETbfahsvhMtYbQf3VJFWUXAKAzuT0N0CNCdzqV0OpYRfovxROL4LolCQvLkFCY_BD1qR9xnBKwJNLvZAkWs-MF7ZP_z9C9LvU6JCD6UCc7Ylgj66FG8TlkHPd6qll-HMPBZ7EJ0KYuJ66jq24-nAbDi7lwUPkJBpFRyLWOSRQB4mYYOAmg'
    },
    {
       id: 4,
       name: 'Marcus Thorne',
       role: 'Senior Lead • FL',
       recruits: 215,
       image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCQZTjQaUKEKN2Y5447AbyjwdULFS-CUH_W-R1w1SaMpNEDZuYeHgxuhWzP8ewpZpA8aCJkMtFnbxOiMHGjUdl6gJFPMO7KhHfu27S3u7AkBi0OE3ycoD_n2bp-gLW9cTlxKdPRLMdEqpqIDHrf1W2uf1933FNWbTHf_BDix7UJP9Hx9_pZrS23w921gh12H7-uQk6ZT0RYWAjAr5X2k3JAis_q4OL7UJ3miRQFmC4dk0OUe0z7UTZsJJmmq-FnSHNMiEUfFyiLhs8'
    }
  ];

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
              <span className="text-primary text-sm font-semibold bg-primary/10 px-3 py-1 rounded-full">4 Active</span>
            </div>
            
            <div className="flex flex-col gap-3">
              {teamMembers.map(member => (
                <div key={member.id} className="flex items-center gap-4 bg-white dark:bg-slate-900 p-4 rounded-xl border border-primary/5 shadow-sm">
                  <div className="size-14 shrink-0 overflow-hidden rounded-lg bg-primary/5">
                    <img alt={member.name} className="w-full h-full object-cover" src={member.image} />
                  </div>
                  <div className="flex-1">
                    <p className="text-slate-900 dark:text-white font-bold">{member.name}</p>
                    <p className="text-slate-500 dark:text-slate-400 text-sm">{member.role}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-primary font-bold">{member.recruits}</p>
                    <p className="text-[10px] text-slate-400 uppercase font-bold tracking-tighter">Recruits</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>

    </div>
  );
}
