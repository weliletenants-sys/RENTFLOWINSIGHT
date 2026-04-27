import React, { useState } from 'react';
import { Users, Home, UserPlus, X, ChevronRight } from 'lucide-react';

interface UnifiedRegistrationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (type: 'tenant' | 'landlord' | 'sub_agent') => void;
}

export default function UnifiedRegistrationDialog({ isOpen, onClose, onNavigate }: UnifiedRegistrationDialogProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-t-[1.5rem] sm:rounded-[1.5rem] w-full max-w-md overflow-hidden shadow-xl animate-in slide-in-from-bottom sm:slide-in-from-bottom-0 sm:zoom-in-95">
        <div className="flex justify-between items-center p-5 border-b border-gray-100">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Register New User</h2>
            <p className="text-xs text-gray-500 mt-1">Select the type of user you want to onboard</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-4 space-y-3">
          {/* Tenant Registration */}
          <button 
            onClick={() => onNavigate('tenant')}
            className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-purple-50 hover:border-purple-200 border border-transparent rounded-2xl transition-all group group-active:scale-[0.98]"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-purple-100 text-[#512DA8] rounded-full flex justify-center items-center group-hover:scale-110 transition-transform">
                <Users size={24} />
              </div>
              <div className="text-left">
                <h3 className="font-bold text-gray-900">Register Tenant</h3>
                <p className="text-xs text-gray-500">Add a new tenant to your portfolio</p>
              </div>
            </div>
            <ChevronRight size={20} className="text-gray-300 group-hover:text-purple-500 group-hover:translate-x-1 transition-all" />
          </button>

          {/* Landlord Registration */}
          <button 
            onClick={() => onNavigate('landlord')}
            className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-blue-50 hover:border-blue-200 border border-transparent rounded-2xl transition-all group group-active:scale-[0.98]"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex justify-center items-center group-hover:scale-110 transition-transform">
                <Home size={24} />
              </div>
              <div className="text-left">
                <h3 className="font-bold text-gray-900">Register Landlord</h3>
                <p className="text-xs text-gray-500">Onboard a new property owner</p>
              </div>
            </div>
            <ChevronRight size={20} className="text-gray-300 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
          </button>

          {/* Sub-Agent Registration */}
          <button 
            onClick={() => onNavigate('sub_agent')}
            className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-amber-50 hover:border-amber-200 border border-transparent rounded-2xl transition-all group group-active:scale-[0.98]"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-full flex justify-center items-center group-hover:scale-110 transition-transform">
                <UserPlus size={24} />
              </div>
              <div className="text-left">
                <h3 className="font-bold text-gray-900">Register Sub-Agent</h3>
                <p className="text-xs text-gray-500">Grow your team and earn commissions</p>
              </div>
            </div>
            <ChevronRight size={20} className="text-gray-300 group-hover:text-amber-500 group-hover:translate-x-1 transition-all" />
          </button>
        </div>
      </div>
    </div>
  );
}
