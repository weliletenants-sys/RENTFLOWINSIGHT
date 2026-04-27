import React, { useState } from 'react';
import { ArrowRightLeft, Wallet, AlertCircle } from 'lucide-react';

export default function AgentFloatPayoutWizard() {
  const [step, setStep] = useState(1);
  const [payoutType, setPayoutType] = useState('');
  
  return (
    <div className="bg-white rounded-[1.5rem] p-5 shadow-sm border border-gray-100 h-full flex flex-col">
      <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-50">
        <div className="w-10 h-10 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-600">
          <ArrowRightLeft size={20} />
        </div>
        <div>
          <h2 className="text-lg font-bold text-gray-900">Float Payout Wizard</h2>
          <p className="text-xs text-gray-500">Initiate transfers from your float balance</p>
        </div>
      </div>

      <div className="flex-1">
        {step === 1 && (
          <div className="space-y-4 animate-in fade-in">
            <h3 className="font-bold text-gray-800 text-sm mb-3">Select Payout Destination</h3>
            
            <button 
              onClick={() => { setPayoutType('landlord'); setStep(2); }}
              className="w-full text-left p-4 rounded-xl border border-gray-100 hover:border-indigo-200 hover:bg-indigo-50/50 transition-all group"
            >
              <div className="font-bold text-gray-900 group-hover:text-indigo-700 transition-colors">Direct to Landlord</div>
              <p className="text-xs text-gray-500 mt-1">Send collected float directly to an assigned landlord's wallet.</p>
            </button>
            
            <button 
              onClick={() => { setPayoutType('self'); setStep(2); }}
              className="w-full text-left p-4 rounded-xl border border-gray-100 hover:border-indigo-200 hover:bg-indigo-50/50 transition-all group"
            >
              <div className="font-bold text-gray-900 group-hover:text-indigo-700 transition-colors">Cash-Out to Self</div>
              <p className="text-xs text-gray-500 mt-1">Empty physical collections into your personal MoMo/Bank.</p>
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4 animate-in slide-in-from-right">
            <div className="bg-amber-50 text-amber-700 p-3 rounded-lg flex items-start gap-3 border border-amber-100">
              <AlertCircle size={18} className="mt-0.5 shrink-0" />
              <p className="text-xs font-medium leading-relaxed">
                You are initiating a {payoutType === 'landlord' ? 'Landlord Payout' : 'Personal Cash-Out'}. 
                This will deduct from your working float capacity. Please enter the amount below.
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Amount (UGX)</label>
              <input
                type="number"
                placeholder="Enter payout amount"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              />
            </div>
            
            <div className="flex gap-3 pt-4">
              <button 
                onClick={() => setStep(1)}
                className="flex-1 py-3 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition-colors"
              >
                Back
              </button>
              <button className="flex-[2] py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-colors">
                Continue to Review
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
