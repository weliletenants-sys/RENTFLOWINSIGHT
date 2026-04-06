import React, { useState } from 'react';
import { X, Download, Copy, Ticket, Check } from 'lucide-react';

interface GeneratePaymentTokenDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function GeneratePaymentTokenDialog({ isOpen, onClose }: GeneratePaymentTokenDialogProps) {
  const [isCopied, setIsCopied] = useState(false);

  if (!isOpen) return null;

  // Mock token to simulate generated payload
  const token = 'PAY-8X4-M2B';

  const copyToClipboard = () => {
    navigator.clipboard.writeText(token);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-t-[1.5rem] sm:rounded-[1.5rem] w-full max-w-sm overflow-hidden shadow-xl animate-in slide-in-from-bottom sm:slide-in-from-bottom-0 sm:zoom-in-95">
        <div className="flex justify-between items-center p-4 border-b border-gray-100">
          <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
            <Ticket size={18} className="text-[#512DA8]" /> Payment Token
          </h2>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 bg-gray-50 rounded-full transition-colors">
            <X size={18} />
          </button>
        </div>

        <div className="p-6 flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4">
            <Ticket size={28} className="text-[#512DA8]" />
          </div>
          
          <h3 className="font-bold text-gray-900 mb-2">Token Generated</h3>
          <p className="text-sm text-gray-500 mb-6 px-4">
            Give this token to offline tenants. They can use it to securely pay rent via authorized outlets.
          </p>

          <div className="w-full p-4 bg-gray-50 border-2 border-dashed border-purple-200 rounded-2xl flex items-center justify-between mb-6 group cursor-pointer hover:bg-purple-50 transition-colors" onClick={copyToClipboard}>
            <div className="text-2xl font-black text-gray-800 tracking-widest">{token}</div>
            {isCopied ? <Check size={20} className="text-green-500" /> : <Copy size={20} className="text-gray-400 group-hover:text-[#512DA8]" />}
          </div>

          <div className="w-full flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 bg-gray-100 text-gray-700 font-bold py-3 rounded-xl hover:bg-gray-200 transition-colors"
            >
              Close
            </button>
            <button
              className="flex-1 bg-[#512DA8] text-white font-bold py-3 rounded-xl hover:bg-[#4527a0] transition-colors flex justify-center items-center gap-2"
            >
              <Download size={18} /> Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
