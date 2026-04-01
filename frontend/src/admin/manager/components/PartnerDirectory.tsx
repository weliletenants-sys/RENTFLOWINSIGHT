import { useState } from 'react';
import { Search, HeartHandshake, Phone, Mail, FileText } from 'lucide-react';

export default function PartnerDirectory() {
  const [search, setSearch] = useState('');
  
  const [partners] = useState([
    { id: 'PT-9901', name: 'InvestCo Africa', type: 'Institutional', capital: 50000000, active: 12, phone: '+256 700 000001' },
    { id: 'PT-8102', name: 'David T.', type: 'Retail VIP', capital: 15000000, active: 4, phone: '+256 772 000002' },
    { id: 'PT-3100', name: 'Sarah L.', type: 'Retail', capital: 5000000, active: 1, phone: '+256 750 000003' },
  ]);

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden animate-in fade-in duration-500 font-inter">
      <div className="px-6 py-5 border-b border-slate-100 flex flex-col md:flex-row gap-4 justify-between items-center bg-slate-50/50">
        <h3 className="text-lg font-bold text-slate-800 tracking-tight">Supporter Master Directory</h3>
        
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input 
            type="text" 
            placeholder="Search by ID or name..." 
            className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium focus:ring-2 focus:ring-[var(--color-primary)] outline-none transition-shadow"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-white border-b border-slate-100">
              <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Partner Entity</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Total AUM</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Portfolios</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Contact Channels</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {partners.map((p) => (
              <tr key={p.id} className="hover:bg-slate-50/80 transition-colors group">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center font-bold text-sm border border-slate-200">
                      <HeartHandshake size={18} />
                    </div>
                    <div>
                      <div className="font-bold text-slate-900 group-hover:text-[var(--color-primary)] transition-colors">{p.name}</div>
                      <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mt-0.5">{p.id} • {p.type}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm font-bold text-slate-900 font-outfit">UGX {p.capital.toLocaleString()}</div>
                </td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center justify-center px-2.5 py-1 rounded-[6px] text-xs font-bold bg-[#f4f0ff] text-[var(--color-primary)] border border-[var(--color-primary-light)]">
                    {p.active} Active
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                      <button className="p-2 bg-white text-slate-400 border border-slate-200 hover:text-emerald-600 hover:bg-emerald-50 hover:border-emerald-200 rounded-lg transition-all shadow-sm">
                        <Phone size={14} />
                      </button>
                      <button className="p-2 bg-white text-slate-400 border border-slate-200 hover:text-blue-600 hover:bg-blue-50 hover:border-blue-200 rounded-lg transition-all shadow-sm">
                        <Mail size={14} />
                      </button>
                      <button className="p-2 bg-white text-slate-400 border border-slate-200 hover:text-[var(--color-primary)] hover:bg-[var(--color-primary-faint)] hover:border-[var(--color-primary-light)] rounded-lg transition-all shadow-sm">
                        <FileText size={14} />
                      </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
