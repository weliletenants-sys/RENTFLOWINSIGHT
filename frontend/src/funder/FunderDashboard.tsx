import { Download, ArrowRightLeft, Banknote, ChevronDown, ChevronRight, HelpCircle, MessageSquare, Lock, Cpu } from 'lucide-react';
import type { ReactNode } from 'react';

export default function FunderDashboard() {
  return (
    <div className="flex flex-col gap-4 pb-6 mt-2 relative z-10 w-full overflow-hidden">
      
      {/* Portfolio Combined Card */}
      <div className="relative mt-2">
        {/* Bottom layer (Light Purple Action Area) */}
        <div className="absolute top-16 inset-x-0 bg-[#E9DDFD] pt-[110px] pb-6 px-4 rounded-[2rem] flex justify-between items-center z-0">
          <ActionBtn icon={<Download size={24} strokeWidth={1.5} />} label="Add money" />
          <ActionBtn icon={<ArrowRightLeft size={24} strokeWidth={1.5} />} label="Transfer" />
          <ActionBtn icon={<Banknote size={24} strokeWidth={1.5} />} label="Withdraw" />
          <ActionBtn icon={<ChevronDown size={24} strokeWidth={1.5} />} label="More" />
        </div>

        {/* Top layer (Dark Purple Gradient Portfolio Card) */}
        <div className="bg-gradient-to-br from-[#915BFE] to-[#713BF0] p-6 rounded-[2rem] text-white relative z-10 overflow-hidden min-h-[180px] shadow-[0_10px_20px_-10px_rgba(113,59,240,0.5)]">
          {/* Abstract wavy lines decoration */}
          <div className="absolute -bottom-6 -right-6 opacity-30">
             <svg width="180" height="180" viewBox="0 0 100 100">
               <path d="M0,50 Q25,20 50,50 T100,50" stroke="white" strokeWidth="1" fill="none"/>
               <path d="M0,70 Q25,40 50,70 T100,70" stroke="white" strokeWidth="1" fill="none"/>
             </svg>
          </div>
          <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-bl-full pointer-events-none"></div>
          
          <div className="flex justify-between items-start mb-6 text-[13.5px] font-medium text-purple-200 relative z-10">
            <p className="text-white/80">Your portfolio</p>
            <p className="text-white/80">May 10, 2023</p>
          </div>
          
          <div className="flex justify-between items-end mt-2 relative z-10">
            <div>
              <p className="text-white/90 text-[14px] mb-1">Total balance:</p>
              <h2 className="text-[2.6rem] leading-none font-bold tracking-tight text-white">$4,003.46</h2>
            </div>
            <div className="text-right pb-1 flex flex-col items-center">
              <p className="text-white/80 text-[11px] mb-1.5 font-medium">Month-to-date</p>
              <div className="bg-[#5CE182] text-green-900 px-3 py-1.5 rounded-full text-[11px] font-bold flex items-center justify-center gap-1.5 shadow-sm min-w-[70px]">
                <span className="text-[9px]">▲</span> + 4.12%
              </div>
            </div>
          </div>
        </div>

        {/* Spacer to push content below the absolute positioned action area */}
        <div className="h-[125px]"></div>
      </div>

      {/* AI Assistant Banner */}
      <div className="bg-gradient-to-r from-[#8E5BF9] to-[#7340F2] rounded-[1.5rem] p-4 flex items-center shadow-sm cursor-pointer hover:shadow-md transition group mt-6 mx-0.5">
        <div className="bg-white/20 p-2.5 rounded-full text-white mr-4 shrink-0">
          <Cpu size={24} strokeWidth={1.5} />
        </div>
        <div className="flex-1">
          <h3 className="text-white font-semibold text-[15px] mb-0.5">AI StockBit Assistant</h3>
          <p className="text-purple-100/90 text-[11px] max-w-[200px] leading-snug font-medium">Get up to 150% profit on your investment portfolio</p>
        </div>
        <ChevronRight className="text-white/70 group-hover:text-white transition group-hover:translate-x-1 shrink-0" size={24} strokeWidth={1.5} />
      </div>

      {/* Support List */}
      <div className="bg-white rounded-[1.5rem] shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] mt-2 px-2 py-1 mx-0.5">
        <ListItem icon={<HelpCircle size={22} strokeWidth={1.5} className="text-gray-700" />} label="Help & Support" />
        <div className="h-[1px] bg-gray-50 mx-10"></div>
        <ListItem icon={<MessageSquare size={22} strokeWidth={1.5} className="text-gray-700" />} label="Contact us" />
        <div className="h-[1px] bg-gray-50 mx-10"></div>
        <ListItem icon={<Lock size={22} strokeWidth={1.5} className="text-gray-700" />} label="Privacy policy" />
      </div>
      
    </div>
  );
}

function ActionBtn({ icon, label }: { icon: ReactNode, label: string }) {
  return (
    <button className="flex flex-col items-center justify-center gap-3 group w-1/4">
      <div className="w-[52px] h-[52px] bg-white rounded-full flex justify-center items-center text-gray-700 shadow-sm group-hover:bg-gray-50 transition border border-white/50">
        {icon}
      </div>
      <span className="text-[12px] font-medium text-gray-800 tracking-tight">{label}</span>
    </button>
  );
}

function ListItem({ icon, label }: { icon: ReactNode, label: string }) {
  return (
    <button className="w-full flex items-center py-4 px-4 hover:bg-gray-50 rounded-2xl transition group">
      <div className="mr-5">
        {icon}
      </div>
      <span className="flex-1 text-left font-semibold text-gray-800 text-[14.5px]">{label}</span>
      <ChevronRight className="text-gray-400 group-hover:text-gray-600 transition" size={20} strokeWidth={1.5} />
    </button>
  );
}
