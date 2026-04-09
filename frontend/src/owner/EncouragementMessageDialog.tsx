import React, { useState } from 'react';
import { Send, HeartHandshake, X } from 'lucide-react';
import toast from 'react-hot-toast';

interface EncouragementMessageDialogProps {
  tenantId: string | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function EncouragementMessageDialog({ tenantId, isOpen, onClose }: EncouragementMessageDialogProps) {
  const [loading, setLoading] = useState(false);
  const [template, setTemplate] = useState('thank-you');

  if (!isOpen || !tenantId) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast.success('Message sent successfully!');
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="flex justify-between items-center p-6 border-b border-gray-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="bg-pink-100 dark:bg-pink-900/30 text-pink-600 p-2.5 rounded-full">
              <HeartHandshake size={22} className="dark:text-pink-400" />
            </div>
            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">Send Message</h2>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 p-2 rounded-full transition">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <p className="text-sm text-slate-500 mb-4">
            Send an SMS to your tenant to build loyalty and acknowledge their prompt payments.
          </p>

          <div className="flex flex-col gap-3">
            <label 
              className={`p-4 border rounded-xl cursor-pointer transition ${
                template === 'thank-you' 
                  ? 'border-pink-500 bg-pink-50 dark:bg-pink-900/10' 
                  : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              <div className="flex items-center gap-3">
                <input 
                  type="radio" 
                  name="template" 
                  value="thank-you" 
                  checked={template === 'thank-you'} 
                  onChange={() => setTemplate('thank-you')}
                  className="w-4 h-4 text-pink-600 focus:ring-pink-500"
                />
                <span className="font-medium text-slate-700 dark:text-slate-300">Prompt Payment Thanks</span>
              </div>
              <p className="pl-7 mt-1 text-xs text-slate-500">
                "Thank you for your prompt rent payment this month. Your diligence is highly appreciated!"
              </p>
            </label>

            <label 
              className={`p-4 border rounded-xl cursor-pointer transition ${
                template === 'welile-homes' 
                  ? 'border-pink-500 bg-pink-50 dark:bg-pink-900/10' 
                  : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              <div className="flex items-center gap-3">
                <input 
                  type="radio" 
                  name="template" 
                  value="welile-homes" 
                  checked={template === 'welile-homes'} 
                  onChange={() => setTemplate('welile-homes')}
                  className="w-4 h-4 text-pink-600 focus:ring-pink-500"
                />
                <span className="font-medium text-slate-700 dark:text-slate-300">Welile Homes Invite</span>
              </div>
              <p className="pl-7 mt-1 text-xs text-slate-500">
                "I highly recommend joining Welile Homes. When you join, 10% of your rent saves towards your own home! Let's get you set up."
              </p>
            </label>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-pink-600 hover:bg-pink-700 text-white font-semibold py-3.5 rounded-xl transition flex items-center justify-center gap-2 mt-4 disabled:opacity-70"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <Send size={18} />
                Send SMS Notification
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
