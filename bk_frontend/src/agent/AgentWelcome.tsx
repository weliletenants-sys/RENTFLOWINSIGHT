import { useNavigate } from 'react-router-dom';
import { ShieldCheck, ArrowRight, Wallet, Clock, Globe, Sparkles, Mail, MessageSquare } from 'lucide-react';

export default function AgentWelcome() {
  const navigate = useNavigate();

  return (
    <div className="bg-sky-50 dark:bg-[#0c4a6e] font-sans text-sky-950 dark:text-sky-100 relative flex min-h-screen w-full flex-col overflow-x-hidden">
      {/* Header/Navigation */}
      <header className="sticky top-0 z-50 w-full border-b border-primary/10 bg-[#6c11d4] dark:bg-[#6c11d4] px-6 md:px-20 py-4 shadow-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div 
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => navigate('/')}
          >
            <ShieldCheck size={32} className="text-white" />
            <h2 className="text-xl font-extrabold tracking-tight text-white">Welile <span className="text-white/80">Agents</span></h2>
          </div>
          <nav className="hidden md:flex items-center gap-10">
            <a className="text-sm font-semibold text-white/90 hover:text-white transition-colors" href="#">How it Works</a>
            <a className="text-sm font-semibold text-white/90 hover:text-white transition-colors" href="#">Earnings</a>
            <a className="text-sm font-semibold text-white/90 hover:text-white transition-colors" href="#">Success Stories</a>
            <a className="text-sm font-semibold text-white/90 hover:text-white transition-colors" href="#">FAQ</a>
          </nav>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate('/login')}
              className="hidden sm:block text-sm font-bold px-4 py-2 text-white/90 hover:text-white"
            >
              Login
            </button>
            <button 
              onClick={() => navigate('/agent-signup')}
              className="rounded-full bg-white px-6 py-2.5 text-sm font-bold text-[#6c11d4] shadow-lg hover:bg-slate-50 transition-all"
            >
              Become an Agent
            </button>
          </div>
        </div>
      </header>

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative px-6 py-16 md:py-24 md:px-20 overflow-hidden">
          <div className="mx-auto max-w-7xl">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-stretch">
              <div className="flex h-full flex-col items-center justify-center text-center gap-8 bg-[#6c11d4] p-8 md:p-12 rounded-[2rem] shadow-2xl">
                <div className="inline-flex w-fit items-center justify-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-white shadow-sm">
                  <ShieldCheck size={16} />
                  <span className="text-xs font-bold uppercase tracking-wider">Official Strategic Partner Program</span>
                </div>
                <h1 className="text-5xl md:text-7xl font-black leading-tight tracking-tighter text-white">
                  Welile Agents <br className="hidden md:block"/> <span className="text-sky-200">Network</span>
                </h1>
                <p className="text-lg md:text-xl text-white/90 max-w-lg leading-relaxed">
                  Earn by connecting businesses and people to Welile services. Start your journey as a strategic partner today and unlock limitless potential.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 mt-2">
                  <button 
                    onClick={() => navigate('/agent-signup')}
                    className="flex items-center justify-center gap-3 rounded-full bg-white px-8 py-4 text-lg font-bold text-[#6c11d4] shadow-xl hover:bg-slate-50 transition-colors"
                  >
                    <span>Get Started Now</span>
                    <ArrowRight size={20} className="text-[#6c11d4]" />
                  </button>
                </div>
              </div>
              <div className="flex flex-col gap-6 h-full">
                <div className="relative overflow-hidden flex-grow min-h-[300px] rounded-[2rem] border border-primary/10 shadow-2xl">
                  {/* UPDATE THIS PATH: Save the photo you uploaded into "frontend/public/agent-hero.jpeg" */}
                  <img alt="Hero Image" className="absolute inset-0 h-full w-full object-cover" src="/agent-hero.jpeg"/>
                </div>
                
                {/* Separated Floating stats widget */}
                <div className="rounded-[2rem] bg-white dark:bg-[#0c4a6e] p-6 shadow-xl border border-sky-950 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex -space-x-3">
                      <div className="h-10 w-10 rounded-full border-2 border-white bg-sky-200 bg-cover bg-center" style={{backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuByWXd3XYRP_dIpC1wo9GDdebgSqusIJhYTTI8uMj0KprEFt5UNupPLIyvD3A0RsagVAFblrf05m-WAm0ty_V7ugOCMa1a4GSZoBrL_aTuNl0PX3FTf4CSKKWur5QvHLXKMuX2IojXqB6PPauOF3NyJMxi_FsZnmkuLmT8EofUhTuoeaO1HuLAbx-cg80-zw7wAv267ugZhLZBiXF8eDdty_niAm2qDwGuaK4JSKLgr8OkdM8WurZOtRJocqFE_53o7MaG7ZUlts8ll')"}}></div>
                      <div className="h-10 w-10 rounded-full border-2 border-white bg-sky-200 bg-cover bg-center" style={{backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAfQ6zEJrn9o_odbaPL5GLPElMWPS-M_6nAbeEw5vlzrP-RR-5Ew9iOH-zeKd2XcQixcKoH9eMurR7NFFa1CkhfiML6p2jHkuEQFpl4rPe6liZL5ANPmjA_rYWLUThO0_55QWXLyjGrfFEYxclJ-27ct0hnYXtUy2fIengYGO57N2qlQSCXYyjB7ZG5vDTfvDpMoDWYzF_zKwtCZjZ0er74NUW4QSFf4rdnB__NW8EZi2d87s7gDpFKS9jqbT-11oecpGk2ffgUBEUI')"}}></div>
                      <div className="h-10 w-10 rounded-full border-2 border-white bg-sky-200 bg-cover bg-center" style={{backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuD9tLcLAQwuTYoPr9j8HIHBdrhkJ_uz24N8zyrPcYmY8qZzbRPVUUW05CcPEQ_pveGIe3ADGU-joqn79u6CkkyjjYhVXK9RBWsL2FMYnlAK1K2oIKwJB1vdWpKkdTLyF-NkBf26cfTDKPbA7laqI42fydpK6FJbRcKRk-Uj_C4pv7_sqVG2jEAVmiCQ9Ms6k0QH-9dc-KsjFNLtjh7pSgMbr1TC8x1XL56oDJSa6gq7wFzWpdzigmBvaDcWp6heMbS0_aXMsGjwKd1Y')"}}></div>
                    </div>
                    <p className="text-base font-medium text-sky-700 dark:text-sky-300">
                      Join <span className="font-bold text-primary">5,000+</span> agents<br/>earning today
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Earnings Pool Section */}
        <section className="bg-[#6c11d4] px-6 py-12 md:px-20">
          <div className="mx-auto max-w-7xl">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8 rounded-3xl bg-white/10 p-8 md:p-12 backdrop-blur-lg border border-white/20">
              <div className="flex flex-col gap-2 text-center md:text-left">
                <h3 className="text-white/90 text-lg font-medium">Total Agent Earnings Today</h3>
                <div className="flex items-baseline gap-2 justify-center md:justify-start">
                  <span className="text-4xl md:text-6xl font-black text-white tracking-tighter">UGX 35,600,000</span>
                  <span className="flex h-3 w-3 rounded-full bg-green-400 animate-pulse"></span>
                </div>
              </div>
              <div className="h-px w-full md:h-16 md:w-px bg-white/20"></div>
              <div className="flex flex-col gap-4 items-center md:items-end">
                <p className="text-white/90 text-center md:text-right max-w-[280px]">Our high-performance network is distributing rewards every second.</p>
                <button className="bg-white text-[#6c11d4] rounded-full px-8 py-3 font-bold hover:bg-slate-50 transition-colors shadow-xl">
                  Claim Your Share
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="px-6 py-24 md:px-20">
          <div className="mx-auto max-w-7xl">
            <div className="mb-16 text-center">
              <h2 className="text-3xl md:text-5xl font-black text-sky-950 dark:text-white mb-4">Why Join the Network?</h2>
              <p className="text-sky-700 dark:text-sky-300 max-w-2xl mx-auto text-lg">Our platform provides the tools and network you need to succeed as a Welile Agent from day one.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <div className="group rounded-3xl border border-[#6c11d4]/20 hover:border-[#6c11d4] bg-white p-10 transition-all hover:shadow-xl">
                <div className="flex items-center gap-3 mb-6">
                  <Wallet size={24} className="text-primary" />
                  <h3 className="text-xl font-bold text-sky-950">High Commissions</h3>
                </div>
                <p className="text-sky-700 text-sm leading-relaxed">Earn top-tier percentages on every successful connection made through your referral. No hidden fees.</p>
              </div>
              
              {/* Feature 2 */}
              <div className="group rounded-3xl border border-[#6c11d4]/20 hover:border-[#6c11d4] bg-white p-10 transition-all hover:shadow-xl">
                <div className="flex items-center gap-3 mb-6">
                  <Clock size={24} className="text-primary" />
                  <h3 className="text-xl font-bold text-sky-950">Flexible Hours</h3>
                </div>
                <p className="text-sky-700 text-sm leading-relaxed">Work from anywhere at any time. You are in total control of your schedule, your goals, and your earnings.</p>
              </div>
              
              {/* Feature 3 */}
              <div className="group rounded-3xl border border-[#6c11d4]/20 hover:border-[#6c11d4] bg-white p-10 transition-all hover:shadow-xl">
                <div className="flex items-center gap-3 mb-6">
                  <Globe size={24} className="text-primary" />
                  <h3 className="text-xl font-bold text-sky-950">Global Network</h3>
                </div>
                <p className="text-sky-700 text-sm leading-relaxed">Access a wide range of services and premium businesses looking for your local and global expertise.</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="relative px-6 py-20 md:px-20 overflow-hidden">
          <div className="absolute inset-0 -z-10 bg-primary/5"></div>
          <div className="mx-auto max-w-4xl rounded-[40px] bg-[#6c11d4] p-12 md:p-20 text-center relative shadow-2xl">
            <div className="absolute top-0 right-0 p-8 opacity-20">
              <Sparkles size={96} className="text-white" />
            </div>
            <h2 className="text-4xl md:text-6xl font-black text-white mb-8 tracking-tighter">Ready to maximize your potential?</h2>
            <p className="text-white/90 text-lg md:text-xl mb-12 max-w-2xl mx-auto">
              Join the Welile Agents Network today and start transforming connections into commissions. It only takes 2 minutes to apply.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-6">
              <button 
                onClick={() => navigate('/agent-signup')}
                className="rounded-full bg-white px-10 py-5 text-xl font-bold text-[#6c11d4] shadow-2xl hover:bg-slate-50 transition-colors"
              >
                Become an Agent
              </button>
              <button className="rounded-full bg-transparent px-10 py-5 text-xl font-bold text-white border-2 border-white/50 hover:bg-white/10 transition-colors">
                Contact Support
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-[#0c4a6e] border-t border-sky-100 dark:border-primary/10 px-6 py-12 md:px-20">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-10">
            
            {/* Logo Column */}
            <div className="lg:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <ShieldCheck size={28} className="text-[#6c11d4]" />
                <h2 className="text-lg font-extrabold text-[#6c11d4]">Welile Agents</h2>
              </div>
              
              <p className="text-[#0081C9] text-xs leading-relaxed max-w-xs">
                Connecting people and businesses across the globe through a strategic partner network designed for growth.
              </p>
            </div>
            
            {/* Platform Column */}
            <div>
              <h4 className="font-bold text-[#003B5C] dark:text-white text-sm mb-4">Platform</h4>
              <ul className="flex flex-col gap-3 text-xs text-[#0081C9]">
                <li><a className="hover:text-primary transition-colors" href="#">How it works</a></li>
                <li><a className="hover:text-primary transition-colors" href="#">Earnings</a></li>
                <li><a className="hover:text-primary transition-colors" href="#">Pricing &amp; Fees</a></li>
                <li><a className="hover:text-primary transition-colors" href="#">Agent Tools</a></li>
              </ul>
            </div>
            
            {/* Company Column */}
            <div>
              <h4 className="font-bold text-[#003B5C] dark:text-white text-sm mb-4">Company</h4>
              <ul className="flex flex-col gap-3 text-xs text-[#0081C9]">
                <li><a className="hover:text-primary transition-colors" href="#">About Us</a></li>
                <li><a className="hover:text-primary transition-colors" href="#">Success Stories</a></li>
                <li><a className="hover:text-primary transition-colors" href="#">Careers</a></li>
                <li><a className="hover:text-primary transition-colors" href="#">Legal</a></li>
              </ul>
            </div>
            
            {/* Support Column */}
            <div>
              <h4 className="font-bold text-[#003B5C] dark:text-white text-sm mb-4">Support</h4>
              <ul className="flex flex-col gap-3 text-xs text-[#0081C9]">
                <li><a className="hover:text-primary transition-colors" href="#">Help Center</a></li>
                <li><a className="hover:text-primary transition-colors" href="#">FAQ</a></li>
                <li><a className="hover:text-primary transition-colors" href="#">Knowledge Base</a></li>
                <li><a className="hover:text-primary transition-colors" href="#">Community</a></li>
                <li className="block sm:hidden"><a className="hover:text-primary transition-colors font-bold" href="/login">Agent Login</a></li>
              </ul>
            </div>
            
          </div>
          
          {/* Bottom Copyright Row */}
          <div className="flex flex-col lg:flex-row items-center lg:justify-between pt-8 mt-12 w-full border-t border-sky-100 dark:border-primary/10 gap-6">
            <p className="text-[10px] sm:text-xs text-[#0081C9] text-center lg:text-left">© 2024 Welile Agents Network. All rights reserved.</p>
            <div className="flex gap-4 sm:gap-6">
              <a className="text-[#00a6fb] hover:text-primary transition-colors" href="#"><Globe size={18} strokeWidth={2} /></a>
              <a className="text-[#00a6fb] hover:text-primary transition-colors" href="#"><Mail size={18} strokeWidth={2} /></a>
              <a className="text-[#00a6fb] hover:text-primary transition-colors" href="#"><MessageSquare size={18} strokeWidth={2} /></a>
            </div>
          </div>
          
        </div>
      </footer>
    </div>
  );
}
