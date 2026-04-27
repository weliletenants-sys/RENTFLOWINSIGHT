import React from 'react';
import AgentLayout from './components/AgentLayout';

export default function AgentCommissionBenefits() {
  return (
    <AgentLayout activePage="earnings" pageTitle="Commission & Benefits">
      <div className="p-4 space-y-6 pb-24 max-w-lg mx-auto bg-slate-50 min-h-screen font-sans">
        
        {/* Card 1: All Ways You Can Earn */}
        <div className="bg-[#fcfaff] rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.02)] border border-[#e4d4f4] overflow-hidden p-5">
          <div className="flex items-center gap-2 mb-4">
            <div className="text-[#7214c9]">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m13 2-2 2.5h3L11 8"/><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2l.5-.5M12 15l-3-3M15 12l-3-3M19.121 8.121c.85-.85 2-1 2.5-1.5C22.511 5.727 22.348 3.652 21 2.304S16.273 2.489 15.378 3.385c-.5.5-.65 1.65-1.5 2.5M16 11l-3 3M19 14l-3 3"/></svg>
            </div>
            <h3 className="font-bold text-[#1e1e1e] text-[15px]">All Ways You Can Earn 💰</h3>
          </div>
          
          <p className="text-[#64748b] text-[12px] mb-4">
            Here is every opportunity to make money as a Welile Agent — all in one place:
          </p>

          <div className="bg-[#f3e8ff]/40 rounded-2xl border border-[#e4d4f4]/60 p-4">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-[12px]">📊</span>
              <span className="text-[10px] font-bold text-slate-700 uppercase tracking-wider text-[#1e1e1e]">YOUR EARNING OPPORTUNITIES</span>
            </div>

            <div className="space-y-4 mb-6">
              <div className="flex justify-between items-start gap-4">
                <div className="flex gap-3 items-start">
                  <div className="text-[14px]">💲</div>
                  <div>
                    <h4 className="font-bold text-[#1e1e1e] text-[13px]">Rent Repayment Commission</h4>
                    <p className="text-[#64748b] text-[11px] leading-snug">Every time your tenant pays rent — you earn 10% automatically, forever!</p>
                  </div>
                </div>
                <div className="font-bold text-[#7214c9] text-[13px]">10%</div>
              </div>

              <div className="h-px bg-slate-200"></div>

              <div className="flex justify-between items-start gap-4">
                <div className="flex gap-3 items-start">
                  <div className="text-[14px] text-[#7214c9] opacity-70">👥</div>
                  <div>
                    <h4 className="font-bold text-[#1e1e1e] text-[13px]">Recruiter Override</h4>
                    <p className="text-[#64748b] text-[11px] leading-snug">Earn 2% from every tenant managed by agents YOU recruited</p>
                  </div>
                </div>
                <div className="font-bold text-[#7214c9] text-[13px]">2%</div>
              </div>

              <div className="h-px bg-slate-200"></div>

              <div className="flex justify-between items-start gap-4">
                <div className="flex gap-3 items-start">
                  <div className="text-[14px]">💸</div>
                  <div>
                    <h4 className="font-bold text-[#1e1e1e] text-[13px]">Collect Rent from Tenants</h4>
                    <p className="text-[#64748b] text-[11px] leading-snug">Go out and collect rent directly — record it in the app and build your collection streaks</p>
                  </div>
                </div>
                <div className="font-bold text-[#64748b] text-[13px]">Float</div>
              </div>
            </div>

            <div className="mb-3">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">ONE-TIME CASH BONUSES</span>
            </div>

            <div className="space-y-4 mb-6">
              <div className="flex justify-between items-center bg-white/60 p-3 rounded-xl border border-slate-100">
                <div className="flex gap-3 items-center">
                  <div className="text-[16px]">🏪</div>
                  <div>
                    <h4 className="font-bold text-[#1e1e1e] text-[13px]">Set Up a Service Centre</h4>
                    <p className="text-[#64748b] text-[10px]">Print poster, mount it, submit photo + GPS — get paid after verification!</p>
                  </div>
                </div>
                <div className="font-bold text-[#7214c9] text-[13px] whitespace-nowrap">UGX 25,000</div>
              </div>

              <div className="flex justify-between items-center p-1">
                <div className="flex gap-3 items-center">
                  <div className="text-[14px]">🎀</div>
                  <div>
                    <h4 className="font-bold text-[#1e1e1e] text-[13px]">Replace a Tenant</h4>
                    <p className="text-[#64748b] text-[10px]">Find a new tenant for a vacated house</p>
                  </div>
                </div>
                <div className="font-bold text-[#7214c9] text-[13px] whitespace-nowrap">UGX 20,000</div>
              </div>

              <div className="h-px bg-slate-200 mx-1"></div>

              <div className="flex justify-between items-center p-1">
                <div className="flex gap-3 items-center">
                  <div className="text-[14px]">👤</div>
                  <div>
                    <h4 className="font-bold text-[#1e1e1e] text-[13px]">Register a New Agent</h4>
                    <p className="text-[#64748b] text-[10px]">Bring someone new to join as a Welile agent under you</p>
                  </div>
                </div>
                <div className="font-bold text-[#7214c9] text-[13px] whitespace-nowrap">UGX 10,000</div>
              </div>

              <div className="h-px bg-slate-200 mx-1"></div>

              <div className="flex justify-between items-center p-1">
                <div className="flex gap-3 items-center">
                  <div className="text-[14px]">📖</div>
                  <div>
                    <h4 className="font-bold text-[#1e1e1e] text-[13px]">Help a Tenant Apply for Rent</h4>
                    <p className="text-[#64748b] text-[10px]">Help post a rent request for a tenant who needs help</p>
                  </div>
                </div>
                <div className="font-bold text-[#7214c9] text-[13px] whitespace-nowrap">UGX 5,000</div>
              </div>

              <div className="h-px bg-slate-200 mx-1"></div>

              <div className="flex justify-between items-center p-1">
                <div className="flex gap-3 items-center">
                  <div className="text-[14px]">📍</div>
                  <div>
                    <h4 className="font-bold text-[#1e1e1e] text-[13px]">List an Empty House</h4>
                    <p className="text-[#64748b] text-[10px]">Find and list a vacant house for Welile</p>
                  </div>
                </div>
                <div className="font-bold text-[#7214c9] text-[13px] whitespace-nowrap">UGX 5,000</div>
              </div>
            </div>

            <div className="mb-3">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">CAREER GROWTH REWARDS</span>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center p-1">
                <div className="flex gap-3 items-center">
                  <div className="text-[14px]">💼</div>
                  <div>
                    <h4 className="font-bold text-[#1e1e1e] text-[13px]">Cash Advance Access</h4>
                    <p className="text-[#64748b] text-[10px]">Recruit 2+ sub-agents and become a Team Leader — unlock cash advances from Welile</p>
                  </div>
                </div>
                <div className="font-bold text-[#64748b] text-[12px] whitespace-nowrap">2+ agents</div>
              </div>

              <div className="h-px bg-slate-200 mx-1"></div>

              <div className="flex justify-between items-center p-1">
                <div className="flex gap-3 items-center">
                  <div className="text-[14px]">🏍️</div>
                  <div>
                    <h4 className="font-bold text-[#1e1e1e] text-[13px]">Electric Bike Reward</h4>
                    <p className="text-[#64748b] text-[10px]">Manage 50 active tenants and earn an electric bike to boost your fieldwork!</p>
                  </div>
                </div>
                <div className="font-bold text-[#64748b] text-[12px] whitespace-nowrap">50 tenants</div>
              </div>

              <div className="h-px bg-slate-200 mx-1"></div>

              <div className="flex justify-between items-center p-1">
                <div className="flex gap-3 items-center">
                  <div className="text-[14px]">🤝</div>
                  <div>
                    <h4 className="font-bold text-[#1e1e1e] text-[13px]">Invite a Funder</h4>
                    <p className="text-[#64748b] text-[10px]">Share your referral link to bring investors who fund rent — helping you and your tenants</p>
                  </div>
                </div>
                <div className="font-bold text-[#64748b] text-[12px] whitespace-nowrap">Referral</div>
              </div>
            </div>

          </div>
        </div>

        {/* Card 2: How the 10% is Shared */}
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

        {/* Card 3: Real Money Example */}
        <div className="bg-white rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.02)] border border-slate-100 overflow-hidden mb-8">
          <div className="p-5">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-6 h-6 rounded-full bg-[#f3e8ff] flex items-center justify-center text-[#7214c9] text-[10px]">
                📖
              </div>
              <h3 className="font-bold text-[#1e1e1e] text-[15px]">Real Money Example</h3>
            </div>
            
            <p className="text-[#64748b] text-[13px] mb-5">
              Let's say a tenant pays back <span className="font-bold text-slate-800">UGX 100,000</span>. Here's who gets paid:
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
              <span className="text-[14px] not-italic">⚡</span>
              If you're both the registering agent and the manager, you take home the full UGX 10,000!
            </p>
          </div>
        </div>

        {/* Card 4: Earn from Agents You Recruit */}
        <div className="bg-white rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.02)] border border-slate-100 overflow-hidden mb-8">
          <div className="p-5">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-6 h-6 rounded-full bg-[#f3e8ff] flex items-center justify-center text-[#7214c9] text-[10px]">👥</div>
              <h3 className="font-bold text-[#1e1e1e] text-[15px]">Earn from Agents You Recruit</h3>
            </div>
            
            <p className="text-[#64748b] text-[13px] mb-5 leading-relaxed">
              Did you bring another agent to Welile? <span className="font-semibold text-slate-800">You earn 2% from every tenant they manage!</span>
            </p>

            <div className="bg-[#f8fafc] rounded-xl p-4 mb-4 border border-slate-100">
              <h4 className="font-bold text-[#1e1e1e] text-[12px] mb-2 flex items-center gap-1.5">
                <span className="text-[14px]">📖</span> Example:
              </h4>
              <p className="text-[12px] text-[#64748b] mb-4">
                You recruited Agent Mary. Mary manages a tenant who pays UGX 100,000.
              </p>

              <div className="space-y-2 text-[12px]">
                <div className="flex justify-between border-b border-slate-200 pb-2">
                  <span className="text-[#64748b]">Agent who registered tenant</span>
                  <span className="font-medium text-slate-700">UGX 2,000 (2%)</span>
                </div>
                <div className="flex justify-between border-b border-slate-200 pb-2">
                  <span className="text-[#64748b]">Mary (managing agent)</span>
                  <span className="font-medium text-slate-700">UGX 6,000 (6%)</span>
                </div>
                <div className="flex justify-between border-b border-slate-200 pb-2">
                  <span className="font-medium text-[#1e1e1e]">You (recruited Mary) 🎉</span>
                  <span className="font-bold text-[#7214c9]">UGX 2,000 (2%)</span>
                </div>
                <div className="flex justify-between pt-1">
                   <span className="font-bold text-[#1e1e1e]">Total</span>
                   <span className="font-bold text-slate-900">UGX 10,000 (10%)</span>
                </div>
              </div>
            </div>

            <p className="text-[12px] text-[#64748b] italic flex items-start gap-1.5 leading-relaxed">
              <span className="text-[14px] not-italic">⚡</span>
              The more agents you recruit, the more you earn — without doing extra work!
            </p>
          </div>
        </div>

        {/* Card 5: Extra Cash Bonuses */}
        <div className="bg-white rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.02)] border border-slate-100 overflow-hidden mb-8">
          <div className="p-5">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-6 h-6 rounded-full bg-[#f3e8ff] flex items-center justify-center text-[#7214c9] text-[10px]">🎀</div>
              <h3 className="font-bold text-[#1e1e1e] text-[15px]">Extra Cash Bonuses 🎁</h3>
            </div>
            
            <p className="text-[#64748b] text-[13px] mb-4">
              You also earn bonus cash for helping Welile grow:
            </p>

            <div className="divide-y divide-slate-100">
               <div className="py-4 flex flex-row items-center justify-between">
                  <div className="pr-4 flex gap-3">
                     <div className="text-[16px] mt-0.5">🏪</div>
                     <div>
                       <h4 className="font-bold text-[#1e1e1e] text-[13px] mb-0.5">Set up a Service Centre</h4>
                       <p className="text-[#64748b] text-[11px] leading-snug">Print poster, mount, submit photo + GPS</p>
                     </div>
                  </div>
                  <span className="font-bold text-[#7214c9] text-[14px] whitespace-nowrap">UGX 25,000</span>
               </div>
               
               <div className="py-4 flex flex-row items-center justify-between">
                  <div className="pr-4 flex gap-3">
                     <div className="text-[14px] mt-0.5">🎀</div>
                     <div>
                       <h4 className="font-bold text-[#1e1e1e] text-[13px] mb-0.5">Replace a tenant</h4>
                       <p className="text-[#64748b] text-[11px] leading-snug">Find a new tenant for a vacated house</p>
                     </div>
                  </div>
                  <span className="font-bold text-[#7214c9] text-[14px] whitespace-nowrap">UGX 20,000</span>
               </div>

               <div className="py-4 flex flex-row items-center justify-between">
                  <div className="pr-4 flex gap-3">
                     <div className="text-[14px] mt-0.5">👤</div>
                     <div>
                       <h4 className="font-bold text-[#1e1e1e] text-[13px] mb-0.5">Register a new agent</h4>
                       <p className="text-[#64748b] text-[11px] leading-snug">Bring someone new to join as a Welile agent</p>
                     </div>
                  </div>
                  <span className="font-bold text-[#7214c9] text-[14px] whitespace-nowrap">UGX 10,000</span>
               </div>

               <div className="py-4 flex flex-row items-center justify-between">
                  <div className="pr-4 flex gap-3">
                     <div className="text-[14px] mt-0.5">📖</div>
                     <div>
                       <h4 className="font-bold text-[#1e1e1e] text-[13px] mb-0.5">Help a tenant apply for rent</h4>
                       <p className="text-[#64748b] text-[11px] leading-snug">When you help post a rent request</p>
                     </div>
                  </div>
                  <span className="font-bold text-[#7214c9] text-[14px] whitespace-nowrap">UGX 5,000</span>
               </div>

               <div className="py-4 flex flex-row items-center justify-between">
                  <div className="pr-4 flex gap-3">
                     <div className="text-[14px] mt-0.5">📍</div>
                     <div>
                       <h4 className="font-bold text-[#1e1e1e] text-[13px] mb-0.5">List an empty house</h4>
                       <p className="text-[#64748b] text-[11px] leading-snug">Find and list a vacant house for Welile</p>
                     </div>
                  </div>
                  <span className="font-bold text-[#7214c9] text-[14px] whitespace-nowrap">UGX 5,000</span>
               </div>
            </div>
          </div>
        </div>

        {/* Card 6: Career Growth & Rewards */}
        <div className="bg-white rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.02)] border border-slate-100 overflow-hidden mb-8">
          <div className="p-5">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-6 h-6 rounded-full bg-[#f3e8ff] flex items-center justify-center text-[#7214c9] text-[10px]">⚡</div>
              <h3 className="font-bold text-[#1e1e1e] text-[15px]">Career Growth & Rewards 🚀</h3>
            </div>
            
            <p className="text-[#64748b] text-[13px] mb-5">
              The harder you work, the more Welile rewards you. Here's what's ahead:
            </p>

            <div className="space-y-4">
              <div className="bg-[#fcfaff] rounded-xl p-4 border border-[#e4d4f4]">
                <div className="flex gap-2 items-center mb-1">
                  <span className="text-[14px]">🏅</span>
                  <h4 className="font-bold text-[#1e1e1e] text-[13px]">Team Leader (2+ Sub-Agents)</h4>
                </div>
                <p className="text-[#64748b] text-[12px] leading-relaxed">
                  Recruit at least 2 agents under you and become a <span className="font-bold text-[#1e1e1e]">Team Leader</span>. This unlocks <span className="font-bold text-[#7214c9]">cash advances</span> from Welile — money you can use for your fieldwork and pay back over time.
                </p>
              </div>

              <div className="bg-[#fcfaff] rounded-xl p-4 border border-[#e4d4f4]">
                <div className="flex gap-2 items-center mb-1">
                  <span className="text-[14px]">🏍️</span>
                  <h4 className="font-bold text-[#1e1e1e] text-[13px]">Electric Bike (50 Active Tenants)</h4>
                </div>
                <p className="text-[#64748b] text-[12px] leading-relaxed">
                  Manage <span className="font-bold text-[#1e1e1e]">50 active tenants</span> and earn a <span className="font-bold text-[#7214c9]">free electric bike</span> from Welile! This helps you move faster and serve more tenants.
                </p>
              </div>

              <div className="bg-[#fcfaff] rounded-xl p-4 border border-[#e4d4f4]">
                <div className="flex gap-2 items-center mb-1">
                  <span className="text-[14px]">🔗</span>
                  <h4 className="font-bold text-[#1e1e1e] text-[13px]">Invite a Funder</h4>
                </div>
                <p className="text-[#64748b] text-[12px] leading-relaxed">
                  Share your referral link with potential investors. When they fund rent for your tenants, <span className="font-bold text-[#1e1e1e]">everyone wins</span> — tenants get rent, you earn commissions, and the funder earns returns.
                </p>
              </div>

              <div className="bg-[#fcfaff] rounded-xl p-4 border border-[#e4d4f4]">
                <div className="flex gap-2 items-center mb-1">
                  <span className="text-[14px]">📈</span>
                  <h4 className="font-bold text-[#1e1e1e] text-[13px]">Collection Streaks</h4>
                </div>
                <p className="text-[#64748b] text-[12px] leading-relaxed">
                  Collect rent consistently and build <span className="font-bold text-[#1e1e1e]">collection streaks</span>. Longer streaks earn you <span className="font-bold text-[#7214c9]">streak multiplier badges</span> and increase your performance tier.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Card 7: Where Does My Money Go? */}
        <div className="bg-white rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.02)] border border-slate-100 overflow-hidden mb-8">
          <div className="p-5">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-6 h-6 rounded-full bg-[#f3e8ff] flex items-center justify-center text-[#7214c9] text-[10px]">⭐</div>
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

        {/* Card 8: Posters & Branding */}
        <div className="bg-white rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.02)] border border-slate-100 overflow-hidden mb-8">
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
                 <img src="/WELILE LOGO.jpeg" alt="Welile Logo" className="w-full h-full object-cover" />
              </div>
              <p className="text-[11px] text-center text-[#1e1e1e] font-bold mb-2">Welile Logo</p>
              <a href="/WELILE LOGO.jpeg" download="Welile_Logo.jpeg" className="w-full bg-[#fcfaff] border border-[#e4d4f4] text-[#1e1e1e] text-[12px] font-bold py-2.5 rounded-xl flex items-center justify-center gap-2 hover:bg-[#f3e8ff] active:bg-[#e4d4f4] transition">
                 <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                 Download Welile Logo
              </a>
            </div>

            {/* Poster 2: Service Centre */}
            <div>
              <div className="w-full aspect-[1/2] rounded-xl overflow-hidden mb-3 shadow-[0_4px_20px_rgba(0,0,0,0.08)] bg-slate-100 flex items-center justify-center">
                 <img src="/welile-poster.png.jpeg" alt="Welile Service Centre Poster" className="w-full h-full object-cover" />
              </div>
              <p className="text-[11px] text-center text-[#1e1e1e] font-bold mb-2">Welile Service Centre Poster</p>
              <a href="/welile-poster.png.jpeg" download="Welile_Service_Centre_Poster.jpeg" className="w-full bg-[#fcfaff] border border-[#e4d4f4] text-[#1e1e1e] text-[12px] font-bold py-2.5 rounded-xl flex items-center justify-center gap-2 hover:bg-[#f3e8ff] active:bg-[#e4d4f4] transition">
                 <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                 Download Service Centre Poster
              </a>
            </div>
          </div>
        </div>

        {/* Card 9: How to Print & Set Up */}
        <div className="bg-[#fcfaff] rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.02)] border border-[#e4d4f4] overflow-hidden mb-8">
          <div className="p-5 flex flex-col gap-5">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-[#f3e8ff] flex items-center justify-center text-[#7214c9] text-[10px]">
                🖨️
              </div>
              <h3 className="font-bold text-[#1e1e1e] text-[15px]">How to Print & Set Up Your Service Centre</h3>
            </div>
            
            <p className="font-bold text-[#1e1e1e] text-[13px]">
              Follow these simple steps:
            </p>

            <div className="space-y-4">
              {/* Step 1 */}
              <div className="bg-[#f8fafc] rounded-xl p-4 border border-slate-100">
                <h4 className="font-bold text-[#1e1e1e] text-[13px] mb-1">Step 1: Download the Images ⬇️</h4>
                <p className="text-[12px] text-[#64748b]">
                  Tap the download buttons above to save the <span className="font-bold text-slate-800">Welile Logo</span> and the <span className="font-bold text-slate-800">Service Centre Poster</span> to your phone.
                </p>
              </div>

              {/* Step 2 */}
              <div className="bg-[#f8fafc] rounded-xl p-4 border border-slate-100">
                <h4 className="font-bold text-[#1e1e1e] text-[13px] mb-2">Step 2: Go to Any Print Shop 🖨️</h4>
                <p className="text-[12px] text-[#64748b] mb-3">
                  Take your phone to any nearby print shop (cyber café, stationery shop). Show them the downloaded images and ask them to print:
                </p>
                <ul className="text-[12px] text-[#64748b] space-y-1.5 list-disc pl-4">
                  <li><span className="font-bold text-slate-800">Poster:</span> Print on <span className="font-bold text-slate-800">A3</span> or <span className="font-bold text-slate-800">A2</span> paper (big size for walls)</li>
                  <li><span className="font-bold text-slate-800">Logo:</span> Print on <span className="font-bold text-slate-800">A4</span> paper (normal size for windows/doors)</li>
                  <li>Ask for <span className="font-bold text-slate-800">colour printing</span> on thick/glossy paper</li>
                </ul>
              </div>

              {/* Step 3 */}
              <div className="bg-[#f8fafc] rounded-xl p-4 border border-slate-100">
                <h4 className="font-bold text-[#1e1e1e] text-[13px] mb-2">Step 3: Official Colour Codes 🎨</h4>
                <p className="text-[12px] text-[#64748b] mb-4">
                  Tell the print shop to use these exact colours:
                </p>
                <div className="flex gap-4">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-[#7214c9]"></div>
                    <div>
                      <div className="text-[12px] font-bold text-slate-800 leading-tight">Purple</div>
                      <div className="text-[9px] text-[#64748b]">#7214c9</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full border border-slate-200 bg-[#ffffff]"></div>
                    <div>
                      <div className="text-[12px] font-bold text-slate-800 leading-tight">White</div>
                      <div className="text-[9px] text-[#64748b]">#ffffff</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-[#000000]"></div>
                    <div>
                      <div className="text-[12px] font-bold text-slate-800 leading-tight">Black</div>
                      <div className="text-[9px] text-[#64748b]">#000000</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 4 */}
              <div className="bg-[#f8fafc] rounded-xl p-4 border border-slate-100">
                <h4 className="font-bold text-[#1e1e1e] text-[13px] mb-2">Step 4: Mount at Your Location 📌</h4>
                <p className="text-[12px] text-[#64748b] mb-3">
                  Put up the poster and logo where people can easily see them:
                </p>
                <ul className="text-[12px] text-[#64748b] space-y-1.5 list-disc pl-4">
                  <li>On a <span className="font-bold text-slate-800">visible wall</span> facing the road or walkway</li>
                  <li>On a <span className="font-bold text-slate-800">window or glass door</span></li>
                  <li>On a <span className="font-bold text-slate-800">signboard</span> at the entrance</li>
                  <li>Make sure it's <span className="font-bold text-slate-800">not blocked</span> by anything</li>
                </ul>
              </div>

              {/* Step 5 */}
              <div className="bg-[#f3e8ff]/50 rounded-xl p-4 border border-[#e4d4f4]">
                <h4 className="font-bold text-[#1e1e1e] text-[13px] mb-1">Step 5: Take a Photo & Submit Below 📸</h4>
                <p className="text-[12px] text-[#64748b]">
                  After mounting, take a clear photo of your setup and submit it below. Once verified by Agent Ops and approved by the CFO, you will earn <span className="font-bold text-[#7214c9]">UGX 25,000</span> straight to your wallet!
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Card 10: Submit Your Service Centre */}
        <div className="bg-white rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.02)] border border-slate-100 overflow-hidden mb-8">
          <div className="p-5">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-6 h-6 rounded-full bg-[#f3e8ff] flex items-center justify-center text-[#7214c9] text-[10px]">
                🚀
              </div>
              <h3 className="font-bold text-[#1e1e1e] text-[15px]">Submit Your Service Centre</h3>
            </div>
            
            <p className="text-[#64748b] text-[12px] mb-6 leading-relaxed">
              After you print and mount the poster, take a photo and submit it here. You will earn <span className="font-bold text-[#7214c9]">UGX 25,000</span> once verified and approved!
            </p>

            <form className="space-y-4">
              {/* Photo Upload */}
              <div>
                <label className="block text-[12px] font-bold text-slate-700 mb-2 flex items-center gap-1.5">
                   📸 Photo of Service Centre Setup
                </label>
                <div className="w-full border border-slate-200 outline-none focus:border-[#7214c9] bg-[#fcfaff] rounded-xl px-4 py-3 text-[13px] text-[#64748b] flex cursor-pointer">
                  <span className="text-[#1e1e1e] font-medium mr-2">Browse...</span> No file selected.
                </div>
              </div>

              {/* GPS Location */}
              <div>
                <label className="block text-[12px] font-bold text-slate-700 mb-2 flex items-center gap-1.5">
                   📍 GPS Location
                </label>
                <button type="button" className="w-full border border-slate-200 outline-none bg-[#fcfaff] hover:bg-slate-50 transition rounded-xl px-4 py-3 text-[13px] text-[#1e1e1e] font-bold flex items-center justify-center gap-2">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                  Capture GPS Location
                </button>
              </div>

              {/* Describe Location */}
              <div>
                <label className="block text-[12px] font-bold text-slate-700 mb-2 flex items-center gap-1.5">
                   📝 Describe the Location
                </label>
                <input 
                  type="text" 
                  placeholder="e.g. Kampala Road, near Shell Petrol Station"
                  className="w-full border border-slate-200 outline-none focus:border-[#7214c9] bg-[#fcfaff] rounded-xl px-4 py-3 text-[13px] placeholder:text-slate-400 text-slate-800"
                />
              </div>

              {/* Readonly Agent Info */}
              <div className="bg-[#f8fafc] rounded-xl p-4 border border-slate-100">
                <div className="text-[12px]">
                  <span className="font-bold text-[#1e1e1e]">Agent Name: </span><span className="text-slate-700">JOSHUA WANDA</span>
                </div>
                <div className="text-[12px] mt-1">
                  <span className="font-bold text-[#1e1e1e]">Phone: </span><span className="text-slate-700">0704825473</span>
                </div>
              </div>

              {/* Submit Button */}
              <button 
                type="button"
                className="w-full bg-[#c084fc] hover:bg-[#b06df0] text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all active:scale-[0.98] shadow-sm uppercase tracking-wide text-[13px]"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
                SUBMIT SERVICE CENTRE
              </button>
            </form>
          </div>
        </div>

        {/* Card 11: My Submissions */}
        <div className="bg-white rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.02)] border border-slate-100 overflow-hidden mb-12">
          <div className="p-5">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-6 h-6 rounded-full bg-[#f3e8ff] flex items-center justify-center text-[#7214c9] text-[10px]">
                📸
              </div>
              <h3 className="font-bold text-[#1e1e1e] text-[15px]">My Submissions</h3>
            </div>
            
            <div className="flex items-center justify-center py-6 text-center">
               <p className="text-[#64748b] text-[12px]">
                 No submissions yet. Set up a Service Centre and submit above!
               </p>
            </div>
          </div>
        </div>

        {/* Share Button (Restored to the very bottom) */}
        <button 
          onClick={() => {
            const shareText = `💰 Welile Service Centre Agent Earnings Plan\n- Earn 10% total commission split on rent collections\n- Earn UGX 5K to 20K per real-estate event\nJoin our field agent program!`;
            if (navigator.share) {
              try { navigator.share({ title: 'Welile Agent Commission Plan', text: shareText }); } 
              catch (err) { console.error('Share failed', err); }
            } else {
              window.open(`https://wa.me/?text=${encodeURIComponent(shareText)}`, '_blank');
            }
          }}
          className="w-full bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 shadow-[0_4px_14px_rgba(37,211,102,0.3)] transition-all active:scale-[0.98] relative z-10"
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

