import React, { useState } from 'react';
import { X, Send, Users } from 'lucide-react';

interface CreateUserInviteDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CreateUserInviteDialog({ isOpen, onClose }: CreateUserInviteDialogProps) {
  const [phone, setPhone] = useState('');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-t-[1.5rem] sm:rounded-[1.5rem] w-full max-w-sm overflow-hidden shadow-xl animate-in slide-in-from-bottom sm:slide-in-from-bottom-0 sm:zoom-in-95">
        <div className="flex justify-between items-center p-5 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <Users className="text-[#512DA8]" size={20} />
            <h2 className="font-bold text-gray-900">Invite User</h2>
          </div>
          <button onClick={onClose} className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors">
            <X size={18} />
          </button>
        </div>

        <form className="p-5 space-y-4" onSubmit={(e) => { e.preventDefault(); onClose(); }}>
          <p className="text-xs text-gray-500 leading-relaxed font-medium">
            Send an SMS invitation with a magic link to immediately onboard a new tenant or sub-agent into your network.
          </p>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Phone Number</label>
            <input
              type="tel"
              required
              placeholder="e.g. 0770000000"
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#512DA8] focus:border-transparent transition-all"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>

          <div className="pt-2">
            <button type="submit" className="w-full py-3.5 bg-[#512DA8] text-white font-bold rounded-xl hover:bg-[#4527a0] transition-colors flex justify-center items-center gap-2 text-sm">
              <Send size={16} /> Send SMS Invite
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
