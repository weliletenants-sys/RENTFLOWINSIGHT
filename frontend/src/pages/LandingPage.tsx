import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserPlus, UserCheck, Rocket, Zap, CalendarDays, LineChart, ShieldCheck, Home, Users, CreditCard, TrendingUp } from 'lucide-react';

export default function LandingPage() {
  const navigate = useNavigate();

  useEffect(() => {
    function reveal() {
      const reveals = document.querySelectorAll('.reveal');
      for (let i = 0; i < reveals.length; i++) {
        const windowHeight = window.innerHeight;
        const elementTop = reveals[i].getBoundingClientRect().top;
        const elementVisible = 0;
        if (elementTop < windowHeight - elementVisible) {
          reveals[i].classList.add('active');
        }
      }
    }

    window.addEventListener('scroll', reveal);
    reveal();

    return () => window.removeEventListener('scroll', reveal);
  }, []);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault();
    const target = document.getElementById(targetId);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const [rentHandled, setRentHandled] = useState(5420000);

  useEffect(() => {
    // Animate the number counting up
    let startTimestamp: number | null = null;
    const duration = 2500; // 2.5 seconds
    const startValue = 5420000;
    const endValue = 200420000000; // 200 Billion+

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      
      // Easing function for smooth deceleration
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      
      setRentHandled(Math.floor(easeOutQuart * (endValue - startValue) + startValue));
      
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    
    // Start animation
    window.requestAnimationFrame(step);
  }, []);

  return (
    <div className="antialiased font-sans bg-[#ffffff] text-slate-900">
      <style>{`
        .glass-effect {
          background: rgba(109, 40, 217, 0.8); /* #6d28d9 with 80% opacity */
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }
        .card-glass {
          background: rgba(255, 255, 255, 0.03);
          backdrop-filter: blur(8px);
          border: 1px solid rgba(255, 255, 255, 0.08);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .card-glass:hover {
          background: rgba(255, 255, 255, 0.06);
          border-color: rgba(139, 92, 246, 0.3);
        }
        .role-section {
          min-height: 100vh;
          display: flex;
          align-items: center;
        }
        .bg-gradient-mesh {
          background: radial-gradient(circle at 20% 30%, #2E1065 0%, transparent 40%),
                      radial-gradient(circle at 80% 70%, #0A192F 0%, transparent 40%);
        }
        .reveal {
          opacity: 0;
          transform: translateY(30px);
          transition: all 0.8s ease-out;
        }
        .reveal.active {
          opacity: 1;
          transform: translateY(0);
        }
        @keyframes fadeInUp {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        .animate-fade-in-up { animation: fadeInUp 0.8s ease-out forwards; }
        .animate-float { animation: float 6s ease-in-out infinite; }
      `}</style>

      {/* BEGIN: Navbar */}
      <nav className="fixed top-0 w-full z-50 glass-effect">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex-shrink-0 flex items-center gap-2">
              <ShieldCheck className="text-white w-8 h-8" />
              <span className="text-2xl font-black text-white tracking-tight">Welile</span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a onClick={(e) => handleNavClick(e, 'tenants')} className="text-sm font-medium text-slate-200 hover:text-white transition-colors cursor-pointer" href="#tenants">Tenants</a>
              <a onClick={(e) => handleNavClick(e, 'agents')} className="text-sm font-medium text-slate-200 hover:text-white transition-colors cursor-pointer" href="#agents">Agents</a>
              <a onClick={(e) => handleNavClick(e, 'supporters')} className="text-sm font-medium text-slate-200 hover:text-white transition-colors cursor-pointer" href="#supporters">Supporters</a>
              <a onClick={(e) => handleNavClick(e, 'how-it-works')} className="text-sm font-medium text-slate-200 hover:text-white transition-colors cursor-pointer" href="#how-it-works">How it Works</a>
            </div>
            <div className="hidden md:flex items-center space-x-4">
              <button onClick={() => navigate('/role-selection')} className="text-sm font-medium bg-white text-[#6d28d9] px-6 py-2.5 rounded-lg hover:bg-slate-200 transition-all font-semibold">Sign Up</button>
            </div>
          </div>
        </div>
      </nav>

      <main>
        {/* 1. HERO SECTION */}
        <section className="relative min-h-screen flex flex-col justify-center pt-8 overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full mb-16">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="animate-fade-in-up">
                <h1 className="text-5xl md:text-7xl font-heading font-bold text-slate-900 mb-6 tracking-tight leading-[1.1]">
                  Pay Rent Smarter. <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-300 to-fuchsia-300">Earn From Rent Faster.</span>
                </h1>
                <p className="text-lg md:text-xl text-slate-500 mb-10 leading-relaxed max-w-xl">
                  Welile connects tenants, agents, and supporters into one powerful rent ecosystem.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <button onClick={() => navigate('/role-selection')} className="px-8 py-4 bg-[#6d28d9] text-white font-bold rounded-xl shadow-lg hover:shadow-white/10 transition-all transform hover:scale-[1.02]">
                    Get Started
                  </button>
                  <a onClick={(e) => handleNavClick(e, 'value-proposition')} className="px-8 py-4 bg-transparent border border-[#6d28d9] text-[#6d28d9] font-bold rounded-xl hover:bg-slate-50 shadow-sm border-slate-200 transition-all text-center cursor-pointer" href="#value-proposition">
                    Learn More
                  </a>
                </div>
              </div>
              <div className="relative animate-float hidden lg:block">
                <div className="card-glass rounded-2xl p-6 shadow-2xl relative z-10">
                  <div className="flex items-center justify-between mb-8">
                    <div className="flex gap-2">
                       <div className="w-3 h-3 rounded-full bg-red-500/50"></div>
                       <div className="w-3 h-3 rounded-full bg-yellow-500/50"></div>
                       <div className="w-3 h-3 rounded-full bg-violet-400/50"></div>
                     </div>
                     <div className="text-xs text-slate-500 font-medium uppercase tracking-widest">Dashboard Overview</div>
                   </div>
                   <div className="space-y-4">
                     <div className="h-24 bg-white shadow-sm border-slate-200 rounded-xl border border-slate-200 flex items-center px-6 justify-between">
                       <div>
                         <div className="text-[10px] text-slate-500 uppercase font-bold mb-1">Total Rent Handled</div>
                         <div className="text-2xl font-heading font-bold">UGX {rentHandled.toLocaleString()}</div>
                       </div>
                        <div className="h-10 w-10 bg-violet-400/20 rounded-lg flex items-center justify-center">
                          <TrendingUp className="text-violet-300 w-5 h-5" />
                        </div>
                     </div>
                     <div className="grid grid-cols-2 gap-4">
                       <div className="h-20 bg-white shadow-sm border-slate-200 rounded-xl border border-slate-200 p-4">
                         <div className="text-[10px] text-slate-500 uppercase font-bold mb-1">Active Users</div>
                         <div className="text-xl font-bold">10,242</div>
                       </div>
                       <div className="h-20 bg-white shadow-sm border-slate-200 rounded-xl border border-slate-200 p-4">
                         <div className="text-[10px] text-slate-500 uppercase font-bold mb-1">Agent Pool</div>
                         <div className="text-xl font-bold">582</div>
                       </div>
                     </div>
                   </div>
                 </div>
                 <div className="absolute -bottom-6 -right-6 w-48 h-48 bg-violet-400/20 blur-[80px] rounded-full"></div>
                 <div className="absolute -top-10 -left-10 w-48 h-48 bg-fuchsia-400/20 blur-[80px] rounded-full"></div>
               </div>
             </div>
           </div>
         </section>
 
         {/* 2. TRUST STRIP */}
         <section className="bg-white py-12">
           <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
             <div className="flex flex-col md:flex-row items-center justify-between gap-8 md:gap-4">
               <div className="text-[#0A192F] font-bold text-lg md:text-xl text-center md:text-left">
                 Trusted by tenants, agents &amp; funders
               </div>
               <div className="grid grid-cols-3 gap-8 md:gap-16">
                 <div className="text-center">
                   <div className="text-[#0A192F] text-2xl font-heading font-bold">10k+</div>
                   <div className="text-slate-500 text-xs font-semibold uppercase tracking-tighter">Users</div>
                 </div>
                 <div className="text-center border-x border-slate-200 px-8">
                   <div className="text-[#0A192F] text-2xl font-heading font-bold leading-none">UGX 5B+</div>
                   <div className="text-slate-500 text-xs font-semibold uppercase tracking-tighter mt-1">Handled</div>
                 </div>
                 <div className="text-center">
                   <div className="text-[#0A192F] text-2xl font-heading font-bold">500+</div>
                   <div className="text-slate-500 text-xs font-semibold uppercase tracking-tighter">Active Agents</div>
                 </div>
               </div>
             </div>
           </div>
         </section>
 
         {/* 3. VALUE SECTION */}
         <section className="py-24" id="value-proposition">
           <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
             <div className="text-center mb-16 reveal">
               <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">One Platform. Three Opportunities.</h2>
               <p className="text-slate-500">Simplifying the housing ecosystem for everyone involved.</p>
             </div>
             <div className="grid md:grid-cols-3 gap-8">
               <div className="card-glass rounded-2xl p-8 text-center reveal">
                 <div className="w-12 h-12 bg-violet-400/10 rounded-xl flex items-center justify-center mb-6 mx-auto">
                   <Home className="text-violet-500 w-6 h-6" />
                 </div>
                 <h3 className="text-lg font-bold mb-3">Access rent easily</h3>
                 <p className="text-slate-500 text-sm">Get the home you want with flexible payment plans that fit your income cycle.</p>
               </div>
               <div className="card-glass rounded-2xl p-8 text-center reveal" style={{ transitionDelay: '0.1s' }}>
                 <div className="w-12 h-12 bg-violet-400/10 rounded-xl flex items-center justify-center mb-6 mx-auto">
                   <Users className="text-violet-500 w-6 h-6" />
                 </div>
                 <h3 className="text-lg font-bold mb-3">Earn as an agent</h3>
                 <p className="text-slate-500 text-sm">Become a vital link in the housing chain and earn commissions on every successful placement.</p>
               </div>
               <div className="card-glass rounded-2xl p-8 text-center reveal" style={{ transitionDelay: '0.2s' }}>
                 <div className="w-12 h-12 bg-violet-400/10 rounded-xl flex items-center justify-center mb-6 mx-auto">
                   <CreditCard className="text-violet-500 w-6 h-6" />
                 </div>
                 <h3 className="text-lg font-bold mb-3">Grow money as a supporter</h3>
                 <p className="text-slate-500 text-sm">Support real people while earning reliable monthly returns on your capital.</p>
               </div>
             </div>
           </div>
         </section>
 
         {/* 4. ROLE SECTIONS (Scrollable Journey) */}
         {/* Tenants */}
         <section className="role-section py-24 bg-slate-50" id="tenants">
           <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
             <div className="grid lg:grid-cols-2 gap-16 items-center">
               <div className="reveal">
                 <span className="text-violet-300 font-bold uppercase tracking-widest text-sm mb-4 block">For Tenants</span>
                 <h2 className="text-4xl md:text-5xl font-heading font-bold mb-8">Move in now, <br/>pay as you earn.</h2>
                 <ul className="space-y-6 mb-10">
                   <li className="flex items-start gap-4">
                     <span className="material-symbols-outlined text-violet-300 bg-violet-400/10 rounded-full p-1 text-sm">check</span>
                     <span className="text-slate-600">Pay rent in flexible installments</span>
                   </li>
                   <li className="flex items-start gap-4">
                     <span className="material-symbols-outlined text-violet-300 bg-violet-400/10 rounded-full p-1 text-sm">check</span>
                     <span className="text-slate-600">Access verified listings only</span>
                   </li>
                   <li className="flex items-start gap-4">
                     <span className="material-symbols-outlined text-violet-300 bg-violet-400/10 rounded-full p-1 text-sm">check</span>
                     <span className="text-slate-600">Avoid eviction pressure with our safety net</span>
                   </li>
                 </ul>
                 <button onClick={() => navigate('/role-selection')} className="block mx-auto px-8 py-4 bg-[#8b5cf6] text-slate-900 font-bold rounded-xl hover:bg-violet-600 transition-all shadow-lg shadow-violet-500/20">
                   Get Rent Support
                 </button>
               </div>
                <div className="reveal flex justify-center lg:justify-end" style={{ transitionDelay: '0.2s' }}>
                  <img src="/images/tenant_app_mockup.png" alt="Tenant App Mockup" className="max-w-[500px] lg:max-w-[600px] w-full h-auto drop-shadow-2xl rounded-3xl rotate-2 hover:rotate-0 transition-transform duration-500" />
                </div>
             </div>
           </div>
         </section>
 
         {/* Agents */}
         <section className="role-section py-24" id="agents">
           <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
             <div className="grid lg:grid-cols-2 gap-16 items-center">
               <div className="lg:order-2 reveal">
                 <span className="text-violet-300 font-bold uppercase tracking-widest text-sm mb-4 block">For Agents</span>
                 <h2 className="text-4xl md:text-5xl font-heading font-bold mb-8">Earn through the <br/>power of trust.</h2>
                 <ul className="space-y-6 mb-10">
                   <li className="flex items-start gap-4">
                     <span className="material-symbols-outlined text-violet-300 bg-violet-400/10 rounded-full p-1 text-sm">check</span>
                     <span className="text-slate-600">Earn commissions on every placement</span>
                   </li>
                   <li className="flex items-start gap-4">
                     <span className="material-symbols-outlined text-violet-300 bg-violet-400/10 rounded-full p-1 text-sm">check</span>
                     <span className="text-slate-600">Get referral bonuses for growing the network</span>
                   </li>
                   <li className="flex items-start gap-4">
                     <span className="material-symbols-outlined text-violet-300 bg-violet-400/10 rounded-full p-1 text-sm">check</span>
                     <span className="text-slate-600">Flexible work in your own area</span>
                   </li>
                 </ul>
                 <button onClick={() => navigate('/role-selection')} className="block mx-auto px-8 py-4 bg-[#8b5cf6] text-slate-900 font-bold rounded-xl hover:bg-violet-600 transition-all shadow-lg shadow-violet-500/20">
                   Start Earning
                 </button>
               </div>
                <div className="lg:order-1 reveal flex justify-center lg:justify-start" style={{ transitionDelay: '0.2s' }}>
                  <img src="/images/agent_app_mockup.png" alt="Agent App Mockup" className="max-w-[500px] lg:max-w-[600px] w-full h-auto drop-shadow-2xl rounded-3xl -rotate-2 hover:rotate-0 transition-transform duration-500" />
                </div>
             </div>
           </div>
         </section>
 
         {/* Supporters */}
         <section className="role-section py-24 bg-slate-50" id="supporters">
           <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
             <div className="grid lg:grid-cols-2 gap-16 items-center">
               <div className="reveal">
                 <span className="text-violet-300 font-bold uppercase tracking-widest text-sm mb-4 block">For Supporters</span>
                 <h2 className="text-4xl md:text-5xl font-heading font-bold mb-8">Support housing, <br/>receive monthly returns.</h2>
                 <ul className="space-y-6 mb-10">
                   <li className="flex items-start gap-4">
                     <span className="material-symbols-outlined text-violet-300 bg-violet-400/10 rounded-full p-1 text-sm">check</span>
                     <span className="text-slate-600">Fund verified rent pools</span>
                   </li>
                   <li className="flex items-start gap-4">
                     <span className="material-symbols-outlined text-violet-300 bg-violet-400/10 rounded-full p-1 text-sm">check</span>
                     <span className="text-slate-600">Earn monthly returns on your capital</span>
                   </li>
                   <li className="flex items-start gap-4">
                     <span className="material-symbols-outlined text-violet-300 bg-violet-400/10 rounded-full p-1 text-sm">check</span>
                     <span className="text-slate-600">Support real people in your community</span>
                   </li>
                 </ul>
                 <button onClick={() => navigate('/role-selection')} className="block mx-auto px-8 py-4 bg-[#8b5cf6] text-slate-900 font-bold rounded-xl hover:bg-violet-600 transition-all shadow-lg shadow-violet-500/20">
                   Start Supporting
                 </button>
               </div>
                <div className="reveal flex justify-center lg:justify-end" style={{ transitionDelay: '0.2s' }}>
                  <img src="/images/supporter_app_mockup.png" alt="Supporter App Mockup" className="max-w-[500px] lg:max-w-[600px] w-full h-auto drop-shadow-2xl rounded-3xl rotate-2 hover:rotate-0 transition-transform duration-500" />
                </div>
             </div>
           </div>
         </section>
 
         {/* 5. HOW IT WORKS */}
         <section className="py-24 bg-slate-50" id="how-it-works">
           <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
             <div className="text-center mb-20 reveal">
               <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">Simple Path to Housing Freedom</h2>
               <p className="text-slate-500 max-w-xl mx-auto">Getting started with Welile takes less than five minutes. Follow these simple steps.</p>
             </div>
             <div className="grid md:grid-cols-3 gap-12 relative">
               {/* Connector line */}
               <div className="hidden md:block absolute top-12 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
               <div className="relative z-10 text-center reveal">
                 <div className="w-16 h-16 bg-white border border-slate-200 rounded-xl flex items-center justify-center mb-6 mx-auto shadow-md">
                   <UserPlus className="text-slate-900 w-8 h-8" />
                 </div>
                 <div className="text-violet-500 font-bold mb-1 text-sm">Step 01</div>
                 <h3 className="text-lg font-bold mb-3">Choose your role</h3>
                 <p className="text-slate-500 text-xs px-2">Select if you are a tenant, agent, or supporter to tailor your experience.</p>
               </div>
               <div className="relative z-10 text-center reveal" style={{ transitionDelay: '0.1s' }}>
                 <div className="w-16 h-16 bg-white border border-slate-200 rounded-xl flex items-center justify-center mb-6 mx-auto shadow-md">
                   <UserCheck className="text-slate-900 w-8 h-8" />
                 </div>
                 <div className="text-violet-500 font-bold mb-1 text-sm">Step 02</div>
                 <h3 className="text-lg font-bold mb-3">Sign up</h3>
                 <p className="text-slate-500 text-xs px-2">Verify your identity and link your wallet or bank account securely.</p>
               </div>
               <div className="relative z-10 text-center reveal" style={{ transitionDelay: '0.2s' }}>
                 <div className="w-16 h-16 bg-white border border-slate-200 rounded-xl flex items-center justify-center mb-6 mx-auto shadow-md">
                   <Rocket className="text-slate-900 w-8 h-8" />
                 </div>
                 <div className="text-violet-500 font-bold mb-1 text-sm">Step 03</div>
                 <h3 className="text-lg font-bold mb-3">Start your journey</h3>
                 <p className="text-slate-500 text-xs px-2">Access rent assistance, earn commissions, or start funding pools instantly.</p>
               </div>
             </div>
           </div>
         </section>
 
         {/* 6. BENEFITS SECTION */}
         <section className="py-24">
           <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
             <div className="grid md:grid-cols-2 gap-8">
               <div className="card-glass p-8 rounded-3xl reveal">
                 <div className="flex gap-6 items-start">
                   <div className="w-12 h-12 bg-violet-400/10 rounded-xl flex items-center justify-center flex-shrink-0">
                     <Zap className="text-violet-500 w-6 h-6" />
                   </div>
                   <div>
                     <h3 className="text-xl font-bold mb-2">Fast approvals</h3>
                     <p className="text-slate-500 text-sm">Proprietary risk assessment means you get an answer in hours, not weeks.</p>
                   </div>
                 </div>
               </div>
               <div className="card-glass p-8 rounded-3xl reveal" style={{ transitionDelay: '0.1s' }}>
                 <div className="flex gap-6 items-start">
                   <div className="w-12 h-12 bg-violet-400/10 rounded-xl flex items-center justify-center flex-shrink-0">
                     <CalendarDays className="text-violet-500 w-6 h-6" />
                   </div>
                   <div>
                     <h3 className="text-xl font-bold mb-2">Daily repayments</h3>
                     <p className="text-slate-500 text-sm">Small, manageable daily or weekly payments that match your cash flow.</p>
                   </div>
                 </div>
               </div>
               <div className="card-glass p-8 rounded-3xl reveal" style={{ transitionDelay: '0.2s' }}>
                 <div className="flex gap-6 items-start">
                   <div className="w-12 h-12 bg-violet-400/10 rounded-xl flex items-center justify-center flex-shrink-0">
                     <LineChart className="text-violet-500 w-6 h-6" />
                   </div>
                   <div>
                     <h3 className="text-xl font-bold mb-2">Transparent tracking</h3>
                     <p className="text-slate-500 text-sm">Every UGX is tracked through our blockchain-verified ledger for full visibility.</p>
                   </div>
                 </div>
               </div>
               <div className="card-glass p-8 rounded-3xl reveal" style={{ transitionDelay: '0.3s' }}>
                 <div className="flex gap-6 items-start">
                   <div className="w-12 h-12 bg-violet-400/10 rounded-xl flex items-center justify-center flex-shrink-0">
                     <ShieldCheck className="text-violet-500 w-6 h-6" />
                   </div>
                   <div>
                     <h3 className="text-xl font-bold mb-2">Secure system</h3>
                     <p className="text-slate-500 text-sm">Bank-grade encryption and multi-sig wallets protect your funds at all times.</p>
                   </div>
                 </div>
               </div>
             </div>
           </div>
         </section>
 
         {/* 7. TRUST & SECURITY */}
         <section className="py-24 bg-slate-50">
           <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="max-w-4xl mx-auto">
                <div className="reveal">
                  <h2 className="text-3xl md:text-4xl font-heading font-bold mb-6">Built on Transparency</h2>
                  <div className="space-y-8">
                    <div>
                      <h4 className="text-slate-900 font-bold mb-2">How your money is used</h4>
                      <p className="text-slate-500 text-sm">Supporter funds are pooled and strictly allocated to pre-verified tenant rent payments. No speculative trading, just real-world utility.</p>
                    </div>
                    <div>
                      <h4 className="text-slate-900 font-bold mb-2">How returns are generated</h4>
                      <p className="text-slate-500 text-sm">Returns come from the small facilitation fees paid by tenants for the flexibility of installment payments. It's a sustainable, circular economy.</p>
                    </div>
                  </div>
                  <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white shadow-sm border-slate-200 p-6 rounded-2xl border border-slate-200 italic text-slate-500 text-sm relative">
                      "Welile helped me secure a house when I was UGX 500k short on the deposit. The weekly payments are so easy to manage."
                      <div className="mt-4 not-italic font-bold text-slate-900 text-xs">— Sarah K., Tenant</div>
                    </div>
                    <div className="bg-white shadow-sm border-slate-200 p-6 rounded-2xl border border-slate-200 italic text-slate-500 text-sm relative">
                      "As an agent, I finally have a platform that rewards my hard work instantly. My earnings are clear and paid daily."
                      <div className="mt-4 not-italic font-bold text-slate-900 text-xs">— John D., Agent</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
 
         {/* 8. FINAL CTA */}
         <section className="py-32 relative overflow-hidden">
           <div className="absolute inset-0 bg-gradient-to-t from-violet-400/10 to-transparent"></div>
           <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center reveal">
             <h2 className="text-4xl md:text-6xl font-heading font-bold mb-8">Start your journey <br/>with Welile today</h2>
             <p className="text-slate-500 text-lg md:text-xl mb-12 max-w-2xl mx-auto">Join the movement that's reshaping how Africa lives and earns. Secure your spot in the ecosystem.</p>
             <button onClick={() => navigate('/role-selection')} className="px-12 py-5 bg-[#6d28d9] text-white font-bold text-lg rounded-2xl shadow-2xl hover:bg-slate-100 transition-all transform hover:scale-105">
               Get Started
             </button>
           </div>
         </section>
       </main>
 
       {/* 9. FOOTER */}
       <footer className="bg-slate-50 py-20 border-t border-slate-200">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-12 mb-16">
             <div className="col-span-2">
               <span className="text-2xl font-heading font-bold text-slate-900 mb-6 block">WELILE</span>
               <p className="text-slate-600 text-sm max-w-xs leading-relaxed">
                 Revolutionizing rent payments and capital growth across the African continent through transparent fintech.
               </p>
             </div>
             <div>
               <h4 className="text-slate-900 font-semibold mb-6">About</h4>
               <ul className="space-y-4 text-sm text-slate-600">
                 <li><a className="hover:text-slate-900 transition-colors cursor-pointer">Mission</a></li>
                 <li><a className="hover:text-slate-900 transition-colors cursor-pointer">Team</a></li>
                 <li><a className="hover:text-slate-900 transition-colors cursor-pointer">Careers</a></li>
               </ul>
             </div>
             <div>
               <h4 className="text-slate-900 font-semibold mb-6">Legal</h4>
               <ul className="space-y-4 text-sm text-slate-600">
                 <li><a className="hover:text-slate-900 transition-colors cursor-pointer">Privacy</a></li>
                 <li><a className="hover:text-slate-900 transition-colors cursor-pointer">Terms</a></li>
                 <li><a className="hover:text-slate-900 transition-colors cursor-pointer">Compliance</a></li>
               </ul>
             </div>
             <div>
               <h4 className="text-slate-900 font-semibold mb-6">Social</h4>
               <ul className="space-y-4 text-sm text-slate-600">
                 <li><a className="hover:text-slate-900 transition-colors cursor-pointer">Twitter</a></li>
                 <li><a className="hover:text-slate-900 transition-colors cursor-pointer">LinkedIn</a></li>
                 <li><a className="hover:text-slate-900 transition-colors cursor-pointer">Instagram</a></li>
               </ul>
             </div>
           </div>
           <div className="pt-8 border-t border-slate-200 flex flex-col md:flex-row justify-between items-center gap-6">
             <p className="text-slate-600 text-xs">
               © 2026 Welile Fintech Limited. All rights reserved. Registered financial services provider.
             </p>
             
           </div>
         </div>
       </footer>
     </div>
   );
}
