import { useState, useRef, useEffect } from 'react';
import { Share2, Download, Mail, MessageCircle, Link as LinkIcon, Smartphone } from 'lucide-react';

interface SharePortfolioProps {
  portfolioCode: string;
  shareUrl: string;
  onPdfDownload?: () => void;
}

export default function SharePortfolioDropdown({ portfolioCode, shareUrl, onPdfDownload }: SharePortfolioProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareUrl);
    setIsOpen(false);
  };

  const shareText = `Check out my real estate investment portfolio on Welile (${portfolioCode}). View my returns here: `;

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl font-bold text-sm text-slate-700 hover:bg-slate-50 transition-colors shadow-sm focus:ring-4 focus:ring-purple-500/10"
      >
        <Share2 className="w-4 h-4 text-purple-600" />
        Share Statement
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="p-3 bg-slate-50/50 border-b border-slate-100">
            <p className="text-[10px] uppercase tracking-widest font-bold text-slate-500 mb-1">Export</p>
            <button 
              onClick={() => { onPdfDownload?.(); setIsOpen(false); }}
              className="flex items-center gap-3 w-full p-2.5 hover:bg-white rounded-xl transition-colors text-left text-sm font-bold text-slate-700 border border-transparent hover:border-slate-200 hover:shadow-sm"
            >
              <div className="w-8 h-8 rounded-full bg-rose-100 flex items-center justify-center text-rose-600 shrink-0">
                <Download className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <p>Download PDF</p>
                <p className="text-[10px] text-slate-400 font-medium">Printable statement</p>
              </div>
            </button>
          </div>
          
          <div className="p-3">
             <p className="text-[10px] uppercase tracking-widest font-bold text-slate-500 mb-2 pl-1">Share Link</p>
             
             <button 
              onClick={() => { window.open(`https://wa.me/?text=${encodeURIComponent(shareText + shareUrl)}`, '_blank'); setIsOpen(false); }}
              className="flex items-center gap-3 w-full px-2.5 py-2 hover:bg-emerald-50 rounded-xl transition-colors text-left text-sm font-bold text-slate-700 group"
            >
              <MessageCircle className="w-4 h-4 text-emerald-500" />
              <span className="group-hover:text-emerald-700">WhatsApp</span>
            </button>

            <button 
              onClick={() => { window.location.href = `mailto:?subject=My Welile Portfolio&body=${encodeURIComponent(shareText + shareUrl)}`; setIsOpen(false); }}
              className="flex items-center gap-3 w-full px-2.5 py-2 hover:bg-blue-50 rounded-xl transition-colors text-left text-sm font-bold text-slate-700 group"
            >
              <Mail className="w-4 h-4 text-blue-500" />
              <span className="group-hover:text-blue-700">Email Link</span>
            </button>
            
            <button 
              onClick={() => { window.location.href = `sms:?body=${encodeURIComponent(shareText + shareUrl)}`; setIsOpen(false); }}
              className="flex items-center gap-3 w-full px-2.5 py-2 hover:bg-purple-50 rounded-xl transition-colors text-left text-sm font-bold text-slate-700 group"
            >
              <Smartphone className="w-4 h-4 text-purple-500" />
              <span className="group-hover:text-purple-700">Send by SMS</span>
            </button>

            <button 
              onClick={copyToClipboard}
              className="flex items-center gap-3 w-full px-2.5 py-2 hover:bg-slate-50 rounded-xl transition-colors text-left text-sm font-bold text-slate-700 group"
            >
              <LinkIcon className="w-4 h-4 text-slate-400 group-hover:text-slate-700" />
              <span>Copy Link</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
