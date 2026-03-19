import React from 'react';
import { X, FileText, Home, DollarSign, Calculator, Search, Share2, HelpCircle, Settings, FileSpreadsheet, Gift } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface TenantMenuDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function TenantMenuDrawer({ isOpen, onClose }: TenantMenuDrawerProps) {
  const navigate = useNavigate();

  return (
    <>
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 bg-black/40 z-50 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />
      
      {/* Drawer (Sliding from Below) */}
      <div 
        className={`fixed bottom-0 left-0 right-0 max-h-[85vh] bg-white rounded-t-3xl z-50 flex flex-col shadow-2xl transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] ${isOpen ? 'translate-y-0' : 'translate-y-full'}`}
      >
        <div className="flex justify-between items-center p-6 border-b border-gray-100 shrink-0">
          <h2 className="font-bold text-gray-900 text-xl">Tenant Menu</h2>
          <button onClick={onClose} className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center text-gray-400 hover:bg-gray-100 transition active:scale-95">
            <X size={20} />
          </button>
        </div>

        <div className="overflow-y-auto p-4 flex-1 space-y-6">
          {/* PAYMENTS */}
          <div>
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest px-2 mb-3">Payments</h3>
            <div className="bg-gray-50 rounded-2xl overflow-hidden border border-gray-100/50">
              <MenuRow icon={<FileText />} label="My Repayment Schedule" subLabel="PDF & WhatsApp Sync" />
              <MenuRow icon={<Home />} label="Pay Rent to Landlord" borderTop />
              <MenuRow icon={<DollarSign />} label="Pay Welile" subLabel="Via Mobile Money" borderTop />
            </div>
          </div>

          {/* TOOLS */}
          <div>
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest px-2 mb-3">Tools</h3>
            <div className="bg-gray-50 rounded-2xl overflow-hidden border border-gray-100/50">
              <MenuRow icon={<Gift />} label="Post Shopping Receipt" subLabel="Earn limit bonuses" />
              <MenuRow icon={<Search />} label="Marketplace" subLabel="Find loans up to 30M" borderTop />
              <MenuRow icon={<Calculator />} label="Rent Calculator" borderTop />
            </div>
          </div>

          {/* GROWTH */}
          <div>
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest px-2 mb-3">Growth</h3>
            <div className="bg-gray-50 rounded-2xl overflow-hidden border border-gray-100/50">
              <MenuRow icon={<Home />} label="Welile Homes" />
              <MenuRow icon={<Share2 />} label="My Referrals (Share & Earn)" borderTop />
              <MenuRow icon={<FileSpreadsheet />} label="Financial Statement" borderTop />
            </div>
          </div>

          {/* MORE */}
          <div>
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest px-2 mb-3">More</h3>
            <div className="bg-gray-50 rounded-2xl overflow-hidden border border-gray-100/50 mb-8">
              <MenuRow icon={<FileText />} label="Tenant Agreement" onClick={() => { onClose(); navigate('/tenant-agreement'); }} />
              <MenuRow icon={<Settings />} label="Settings" borderTop />
              <MenuRow icon={<HelpCircle />} label="Help & Support" borderTop />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function MenuRow({ icon, label, subLabel, borderTop = false, onClick }: any) {
  return (
    <div 
      onClick={onClick}
      className={`flex items-center justify-between p-4 cursor-pointer hover:bg-gray-100 active:bg-gray-200 transition ${borderTop ? 'border-t border-gray-200/50' : ''}`}
    >
      <div className="flex items-center gap-3">
        <div className="text-gray-500 w-5 h-5 flex items-center justify-center">
          {React.cloneElement(icon, { size: 20 })}
        </div>
        <div>
          <p className="font-semibold text-gray-900 text-sm">{label}</p>
          {subLabel && <p className="text-[11px] text-gray-500 font-medium mt-0.5">{subLabel}</p>}
        </div>
      </div>
    </div>
  );
}
