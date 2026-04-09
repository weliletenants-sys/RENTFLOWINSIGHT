import React, { useState } from 'react';
import { Star, X } from 'lucide-react';
import toast from 'react-hot-toast';

interface TenantRatingProps {
  tenantId: string | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function TenantRating({ tenantId, isOpen, onClose }: TenantRatingProps) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);

  if (!isOpen || !tenantId) return null;

  const handleSubmit = () => {
    if (rating === 0) {
      toast.error('Please select a star rating first.');
      return;
    }
    toast.success('Rating submitted successfully.');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white dark:bg-slate-900 w-full max-w-sm rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="flex justify-between items-center p-6 pb-2">
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">Rate Tenant</h2>
          <button onClick={onClose} className="text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 p-2 rounded-full transition">
            <X size={20} />
          </button>
        </div>
        
        <div className="p-6 text-center space-y-6">
          <p className="text-sm text-slate-500">
            How would you rate your recent experience with this tenant regarding payments and property care?
          </p>

          <div className="flex justify-center gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                className="transition-transform hover:scale-110 focus:outline-none"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
              >
                <Star 
                  size={36} 
                  className={`transition-colors ${
                    (hoverRating || rating) >= star 
                      ? 'fill-amber-400 text-amber-400' 
                      : 'text-slate-200 dark:text-slate-700'
                  }`} 
                />
              </button>
            ))}
          </div>

          <button 
            onClick={handleSubmit}
            className="w-full bg-amber-500 hover:bg-amber-600 text-white font-semibold py-3.5 rounded-xl transition shadow-lg shadow-amber-500/20"
          >
            Submit Rating
          </button>
        </div>
      </div>
    </div>
  );
}
