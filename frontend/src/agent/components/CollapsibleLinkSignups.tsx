import React, { useState } from 'react';
import { Link as LinkIcon, ChevronDown, ChevronUp } from 'lucide-react';
import LinkSignupsList from './LinkSignupsList';

export default function CollapsibleLinkSignups() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-white rounded-[1.5rem] p-5 shadow-sm border border-gray-100">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center group"
      >
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-purple-50 text-[#512DA8] rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
            <LinkIcon size={16} />
          </div>
          <div className="text-left">
            <h3 className="font-bold text-gray-900 text-sm group-hover:text-[#512DA8] transition-colors">Signups via Link</h3>
            <p className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold">2 Recent Leads</p>
          </div>
        </div>
        <div className="text-gray-400 group-hover:text-[#512DA8] transition-colors">
          {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </div>
      </button>

      {isOpen && (
        <div className="animate-in slide-in-from-top-4 fade-in duration-200">
          <LinkSignupsList />
        </div>
      )}
    </div>
  );
}
