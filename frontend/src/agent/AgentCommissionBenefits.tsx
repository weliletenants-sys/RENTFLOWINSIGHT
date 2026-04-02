import React from 'react';
import AgentLayout from './components/AgentLayout';

export default function AgentCommissionBenefits() {
  const handleShare = async () => {
    const shareText = `💰 Welile Service Centre Agent Earnings Plan\n- Earn 10% total commission split on rent collections\n- Earn UGX 5K to 20K per real-estate event\nJoin our field agent program!`;
    if (navigator.share) {
      try { await navigator.share({ title: 'Welile Agent Commission Plan', text: shareText }); } 
      catch (err) { console.error('Share failed', err); }
    } else {
      window.open(`https://wa.me/?text=${encodeURIComponent(shareText)}`, '_blank');
    }
  };

  return (
    <AgentLayout activePage="earnings" pageTitle="Commission & Benefits">
      <div className="p-4 space-y-6 pb-24 max-w-lg mx-auto bg-slate-50 min-h-screen font-sans">
        
        {/* Header Block */}
        <div className="bg-[#fcfaff] border border-[#e4d4f4] rounded-2xl p-5 text-center shadow-sm">
          <div className="text-3xl mb-2">💵</div>
          <h2 className="font-bold text-[#1e1e1e] text-[15px] mb-2 leading-tight">
            Every time your tenant pays rent, you earn money!
          </h2>
          <p className="text-[#64748b] text-[13px]">
            You get <span className="font-bold text-[#7214c9]">10%</span> of every repayment — automatically sent to your wallet.
          </p>
        </div>

        {/* Card 1: How the 10% is Shared */}
        <div className="bg-white rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.02)] border border-slate-100 overflow-hidden">
          <div className="p-5">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-6 h-6 rounded-full bg-[#f3e8ff] flex items-center justify-center text-[#7214c9] text-xs font-bold">
                $
              </div>
              <h3 className="font-bold text-[#1e1e1e] text-[15px]">How the 10% is Shared</h3>
            </div>
            
            <p className="text-[#64748b] text-[13px] mb-5">
              When a tenant pays back rent, <span className="font-semibold text-slate-800">two agents can earn</span> from that payment:
            </p>

            <div className="space-y-4 mb-5">
              <div className="bg-[#f8fafc] rounded-xl p-4 border border-slate-100">
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded flex-shrink-0 bg-blue-500 text-white flex items-center justify-center text-[11px] font-bold mt-0.5">
                    1
                  </div>
                  <div>
                    <h4 className="font-bold text-[#1e1e1e] text-[13px] mb-1">The Agent Who Registered the Tenant</h4>
                    <p className="text-[12px] text-[#64748b] leading-relaxed">
                      This is the person who first brought the tenant to Welile. You get <span className="font-bold text-[#7214c9]">2%</span> of every repayment — forever!
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-[#f8fafc] rounded-xl p-4 border border-slate-100">
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded flex-shrink-0 bg-blue-500 text-white flex items-center justify-center text-[11px] font-bold mt-0.5">
                    2
                  </div>
                  <div>
                    <h4 className="font-bold text-[#1e1e1e] text-[13px] mb-1">The Agent Managing the Tenant Now</h4>
                    <p className="text-[12px] text-[#64748b] leading-relaxed">
                      This is the agent currently assigned to the tenant. You get <span className="font-bold text-[#7214c9]">8%</span> of every repayment.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-[#fcfaff] border border-[#e4d4f4] rounded-xl p-4">
              <h4 className="font-bold text-[#1e1e1e] text-[13px] mb-1 flex items-center gap-1.5">
                ⭐ If You Are Both?
              </h4>
              <p className="text-[12px] text-[#64748b] leading-relaxed">
                If you registered the tenant AND you are managing them — you keep the <span className="font-bold text-[#7214c9]">full 10%</span>! That's the best position to be in.
              </p>
            </div>
          </div>
        </div>

        {/* Card 2: Real Money Example */}
        <div className="bg-white rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.02)] border border-slate-100 overflow-hidden">
          <div className="p-5">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-6 h-6 rounded-full bg-[#f3e8ff] flex items-center justify-center text-[#7214c9] text-[10px]">
                📖
              </div>
              <h3 className="font-bold text-[#1e1e1e] text-[15px]">Real Money Example</h3>
            </div>
            
            <p className="text-[#64748b] text-[13px] mb-5">
              Let's say a tenant pays back <span className="font-semibold text-slate-800">UGX 100,000</span>. Here's who gets paid:
            </p>

            <div className="border border-slate-100 rounded-xl overflow-hidden mb-4">
              <div className="bg-[#f8fafc] px-4 py-3 flex items-center gap-2 border-b border-slate-100">
                <span className="text-[14px]">⚠️</span>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">WHO GETS WHAT</span>
              </div>
              
              <div className="divide-y divide-slate-100">
                <div className="px-4 py-3 flex justify-between items-center text-[13px]">
                  <span className="text-[#64748b]">Agent who registered tenant (2%)</span>
                  <span className="font-bold text-slate-800">UGX 2,000</span>
                </div>
                <div className="px-4 py-3 flex justify-between items-center text-[13px]">
                  <span className="text-[#64748b]">Agent managing tenant (8%)</span>
                  <span className="font-bold text-slate-800">UGX 8,000</span>
                </div>
                <div className="px-4 py-4 flex justify-between items-center bg-[#fcfaff]">
                   <span className="font-bold tracking-tight text-[#1e1e1e] text-[14px]">Total Earned</span>
                   <span className="font-bold text-[#7214c9] text-[14px]">UGX 10,000</span>
                </div>
              </div>
            </div>

            <p className="text-[12px] text-[#64748b] italic flex items-start gap-1.5 leading-relaxed">
              <span className="text-[14px] not-italic">💡</span>
              If you're both the registering agent and the manager, you take home the full UGX 10,000!
            </p>
          </div>
        </div>

        {/* Card 3: Earn from Agents You Recruit */}
        <div className="bg-white rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.02)] border border-slate-100 overflow-hidden">
          <div className="p-5">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-6 h-6 rounded-full bg-[#f3e8ff] flex items-center justify-center text-[#7214c9] text-[10px]">
                👥
              </div>
              <h3 className="font-bold text-[#1e1e1e] text-[15px]">Earn from Agents You Recruit</h3>
            </div>
            
            <p className="text-[#64748b] text-[13px] mb-5 leading-relaxed">
              Did you bring another agent to Welile? <span className="font-semibold text-slate-800">You earn 2% from every tenant they manage!</span>
            </p>

            <div className="bg-[#f0fdf4] border border-[#bbf7d0] rounded-xl p-4 mb-4">
              <h4 className="font-bold text-[#1e1e1e] text-[12px] mb-2 flex items-center gap-1.5 text-emerald-800">
                <span className="text-[14px]">📊</span> Example:
              </h4>
              <p className="text-[12px] text-[#64748b] mb-4">
                You recruited Agent Mary. Mary manages a tenant who pays UGX 100,000.
              </p>

              <div className="space-y-2 text-[12px]">
                <div className="flex justify-between border-b border-emerald-100/50 pb-2">
                  <span className="text-[#64748b]">Agent who registered tenant</span>
                  <span className="font-medium text-slate-700">UGX 2,000 (2%)</span>
                </div>
                <div className="flex justify-between border-b border-emerald-100/50 pb-2">
                  <span className="text-[#64748b]">Mary (managing agent)</span>
                  <span className="font-medium text-slate-700">UGX 6,000 (6%)</span>
                </div>
                <div className="flex justify-between border-b border-emerald-100/50 pb-2">
                  <span className="font-medium text-[#1e1e1e]">You (recruited Mary) 🎉</span>
                  <span className="font-bold text-emerald-600">UGX 2,000 (2%)</span>
                </div>
                <div className="flex justify-between pt-1">
                   <span className="font-bold text-[#1e1e1e]">Total</span>
                   <span className="font-bold text-slate-900">UGX 10,000 (10%)</span>
                </div>
              </div>
            </div>

            <p className="text-[12px] text-[#64748b] italic flex items-start gap-1.5 leading-relaxed">
              <span className="text-[14px] not-italic">💡</span>
              The more agents you recruit, the more you earn — without doing extra work!
            </p>
          </div>
        </div>

        {/* Card 4: Extra Cash Bonuses */}
        <div className="bg-white rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.02)] border border-slate-100 overflow-hidden">
          <div className="p-5 pb-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-6 h-6 rounded-full bg-[#f3e8ff] flex items-center justify-center text-[#7214c9] text-[10px]">
                🎀
              </div>
              <h3 className="font-bold text-[#1e1e1e] text-[15px]">Extra Cash Bonuses 🎁</h3>
            </div>
            
            <p className="text-[#64748b] text-[13px] mb-4">
              You also earn bonus cash for helping Welile grow:
            </p>

            <div className="divide-y divide-slate-100">
               {/* Bonus Item */}
               <div className="py-4 flex flex-row items-center justify-between">
                  <div className="pr-4">
                     <h4 className="font-bold text-[#1e1e1e] text-[13px] mb-0.5">Help a tenant apply for rent</h4>
                     <p className="text-[#64748b] text-[11px] leading-snug">When you help post a rent request.</p>
                  </div>
                  <span className="font-bold text-[#7214c9] text-[13px] whitespace-nowrap">UGX 5,000</span>
               </div>
               
               {/* Bonus Item */}
               <div className="py-4 flex flex-row items-center justify-between">
                  <div className="pr-4">
                     <h4 className="font-bold text-[#1e1e1e] text-[13px] mb-0.5">List an empty house</h4>
                     <p className="text-[#64748b] text-[11px] leading-snug">Find and list a vacant house for Welile.</p>
                  </div>
                  <span className="font-bold text-[#7214c9] text-[13px] whitespace-nowrap">UGX 5,000</span>
               </div>

               {/* Bonus Item */}
               <div className="py-4 flex flex-row items-center justify-between">
                  <div className="pr-4">
                     <h4 className="font-bold text-[#1e1e1e] text-[13px] mb-0.5">Replace a tenant</h4>
                     <p className="text-[#64748b] text-[11px] leading-snug">Find a new tenant for a vacated house.</p>
                  </div>
                  <span className="font-bold text-[#7214c9] text-[13px] whitespace-nowrap">UGX 20,000</span>
               </div>

               {/* Bonus Item */}
               <div className="py-4 flex flex-row items-center justify-between">
                  <div className="pr-4">
                     <h4 className="font-bold text-[#1e1e1e] text-[13px] mb-0.5">Register a new agent</h4>
                     <p className="text-[#64748b] text-[11px] leading-snug">Bring someone new to join as a Welile agent.</p>
                  </div>
                  <span className="font-bold text-[#7214c9] text-[13px] whitespace-nowrap">UGX 10,000</span>
               </div>
            </div>
          </div>
        </div>

        {/* Card 5: Where Does My Money Go? */}
        <div className="bg-white rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.02)] border border-slate-100 overflow-hidden">
          <div className="p-5">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-6 h-6 rounded-full bg-[#f3e8ff] flex items-center justify-center text-[#7214c9] text-[10px]">
                🌟
              </div>
              <h3 className="font-bold text-[#1e1e1e] text-[15px]">Where Does My Money Go?</h3>
            </div>
            
            <p className="text-[#64748b] text-[13px] mb-4 leading-relaxed">
              All the money you earn goes straight into your <span className="font-semibold text-slate-800">Welile Wallet</span>. You can see every earning clearly:
            </p>

            <ul className="space-y-3">
              <li className="flex items-start gap-2.5">
                <div className="w-4 h-4 rounded bg-emerald-500 text-white flex shrink-0 items-center justify-center mt-0.5">
                   <svg width="10" height="8" viewBox="0 0 10 8" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1 4L3.5 6.5L9 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </div>
                <span className="text-[13px] text-[#64748b]">How much you earned</span>
              </li>
              <li className="flex items-start gap-2.5">
                <div className="w-4 h-4 rounded bg-emerald-500 text-white flex shrink-0 items-center justify-center mt-0.5">
                   <svg width="10" height="8" viewBox="0 0 10 8" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1 4L3.5 6.5L9 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </div>
                <span className="text-[13px] text-[#64748b]">Which tenant the money came from</span>
              </li>
              <li className="flex items-start gap-2.5">
                <div className="w-4 h-4 rounded bg-emerald-500 text-white flex shrink-0 items-center justify-center mt-0.5">
                   <svg width="10" height="8" viewBox="0 0 10 8" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1 4L3.5 6.5L9 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </div>
                <span className="text-[13px] text-[#64748b]">Why you earned it (registration, managing, bonus, etc.)</span>
              </li>
              <li className="flex items-start gap-2.5">
                <div className="w-4 h-4 rounded bg-emerald-500 text-white flex shrink-0 items-center justify-center mt-0.5">
                   <svg width="10" height="8" viewBox="0 0 10 8" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1 4L3.5 6.5L9 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </div>
                <span className="text-[13px] text-[#64748b]">You can withdraw anytime to Mobile Money</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Card 6: Posters & Branding */}
        <div className="bg-white rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.02)] border border-slate-100 overflow-hidden">
          <div className="p-5">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-6 h-6 rounded-full bg-[#f3e8ff] flex items-center justify-center text-[#7214c9] text-[10px]">
                🖼️
              </div>
              <h3 className="font-bold text-[#1e1e1e] text-[15px]">Posters & Branding</h3>
            </div>
            
            <p className="text-[#64748b] text-[13px] mb-5 leading-relaxed">
              Download these images to print and set up your own Welile Service Centre.
            </p>

            {/* Poster 1: Logo */}
            <div className="mb-8">
              <div className="w-full aspect-square rounded-xl overflow-hidden mb-3 shadow-[0_4px_20px_rgba(0,0,0,0.08)] bg-slate-100 flex items-center justify-center">
                 <img src="/welile-logo.png" alt="Welile Logo" className="w-full h-full object-cover" />
              </div>
              <p className="text-[11px] text-center text-[#64748b] font-medium mb-2">Welile Logo</p>
              <a href="/welile-logo.png" download="Welile_Logo.png" className="w-full bg-[#f8fafc] border border-slate-200 text-slate-700 text-[12px] font-bold py-2.5 rounded-xl flex items-center justify-center gap-2 hover:bg-slate-50 active:bg-slate-100 transition">
                 <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                 Download Welile Logo
              </a>
            </div>

            {/* Poster 2: Service Centre */}
            <div>
              <div className="w-full aspect-[1/2] rounded-xl overflow-hidden mb-3 shadow-[0_4px_20px_rgba(0,0,0,0.08)] bg-slate-100 flex items-center justify-center">
                 <img src="/welile-poster.png.jpeg" alt="Welile Service Centre Poster" className="w-full h-full object-cover" />
              </div>
              <p className="text-[11px] text-center text-[#64748b] font-medium mb-2">Welile Service Centre Poster</p>
              <a href="/welile-poster.png.jpeg" download="Welile_Service_Centre_Poster.jpeg" className="w-full bg-[#f8fafc] border border-slate-200 text-slate-700 text-[12px] font-bold py-2.5 rounded-xl flex items-center justify-center gap-2 hover:bg-slate-50 active:bg-slate-100 transition">
                 <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                 Download Service Centre Poster
              </a>
            </div>
          </div>
        </div>
        
        {/* Share Button */}
        <button 
          onClick={handleShare}
          className="w-full bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-green-500/20 transition-all active:scale-[0.98]"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.888-.788-1.487-1.761-1.66-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
          </svg>
          Share on WhatsApp
        </button>

      </div>
    </AgentLayout>
  );
}
