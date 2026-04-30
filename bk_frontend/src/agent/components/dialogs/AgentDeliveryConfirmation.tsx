import React, { useState } from 'react';
import { X, CheckSquare, Upload, CheckCircle2, Loader2 } from 'lucide-react';
import { useConfirmDeliveryMutation } from '../../hooks/useAgentQueries';

interface AgentDeliveryConfirmationProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (fileUrl: string) => void;
}

export default function AgentDeliveryConfirmation({ isOpen, onClose, onSubmit }: AgentDeliveryConfirmationProps) {
  const [fileUploaded, setFileUploaded] = useState(false);
  const { mutate: confirmDelivery, isPending } = useConfirmDeliveryMutation();

  if (!isOpen) return null;

  const handleUploadClick = () => {
    // Simulate upload delay
    setTimeout(() => {
      setFileUploaded(true);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-t-[1.5rem] sm:rounded-[1.5rem] w-full max-w-md overflow-hidden shadow-xl animate-in slide-in-from-bottom sm:slide-in-from-bottom-0 sm:zoom-in-95">
        <div className="flex justify-between items-center p-5 border-b border-gray-100 bg-green-50">
          <div>
            <h2 className="text-lg font-bold text-green-900">Confirm Rent Delivery</h2>
            <p className="text-xs text-green-700/70 mt-1">Proof of cash delivered to landlord</p>
          </div>
          <button onClick={onClose} className="p-2 text-green-900/50 hover:text-green-900 hover:bg-green-100 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-5 space-y-5">
          <div className="bg-gray-50 border border-gray-100 rounded-2xl p-4">
            <div className="flex gap-3 mb-3">
              <CheckSquare size={20} className="text-green-600" />
              <div>
                <h3 className="font-bold text-sm text-gray-900">Landlord Receipt Required</h3>
                <p className="text-xs text-gray-500 mt-1">Upload a photo of the signed receipt or a screenshot of the MoMo transfer confirmation.</p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleUploadClick}
              disabled={fileUploaded}
              className={`w-full mt-2 h-24 border-2 border-dashed rounded-xl flex flex-col items-center justify-center gap-2 transition-all ${
                fileUploaded 
                  ? 'bg-green-50 border-green-200 text-green-600 disabled:opacity-100 disabled:cursor-default' 
                  : 'bg-white border-gray-300 text-gray-400 hover:border-green-400 hover:bg-green-50/50 hover:text-green-600'
              }`}
            >
              {fileUploaded ? (
                <>
                  <CheckCircle2 size={24} />
                  <span className="font-bold text-xs uppercase pt-1">Receipt Uploaded</span>
                </>
              ) : (
                <>
                  <Upload size={24} />
                  <span className="font-bold text-xs uppercase tracking-wider pt-1">Tap to browse files</span>
                </>
              )}
            </button>
          </div>

          <div className="pt-2">
            <button
              disabled={!fileUploaded || isPending}
              onClick={() => {
                 confirmDelivery(
                    { receipt_url: 'mock-receipt-url.jpg' }, 
                    { onSuccess: () => { onSubmit('mock-receipt-url.jpg'); onClose(); }}
                 );
              }}
              className="w-full bg-green-600 flex justify-center items-center gap-2 text-white font-bold py-3.5 rounded-xl shadow-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors active:scale-[0.98]"
            >
              {isPending && <Loader2 size={16} className="animate-spin" />}
              Complete Delivery
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
