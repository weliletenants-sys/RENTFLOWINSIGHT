import React, { useState } from 'react';
import { X, Target } from 'lucide-react';

interface SetTeamGoalDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (target: number) => void;
}

export default function SetTeamGoalDialog({ isOpen, onClose, onSubmit }: SetTeamGoalDialogProps) {
  const [goal, setGoal] = useState('20');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(parseInt(goal, 10));
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-[1.5rem] w-full max-w-sm overflow-hidden shadow-xl animate-in zoom-in-95">
        <div className="flex justify-between items-center p-5 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <Target className="text-[#512DA8]" size={20} />
            <h2 className="font-bold text-gray-900">Set Team Goal</h2>
          </div>
          <button onClick={onClose} className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <p className="text-xs text-gray-500 leading-relaxed font-medium">
            Define a collective target for your recruited sub-agents. Hitting this group goal activates a 2% multiplier on your override commission.
          </p>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Monthly Repayment Target</label>
            <input
              type="number"
              required
              min="5"
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 font-bold text-lg focus:outline-none focus:ring-2 focus:ring-[#512DA8] focus:border-transparent transition-all"
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
            />
          </div>

          <div className="pt-2 flex gap-3">
            <button type="button" onClick={onClose} className="flex-1 py-3 text-gray-600 font-bold bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors text-sm">
              Cancel
            </button>
            <button type="submit" className="flex-1 py-3 bg-[#512DA8] text-white font-bold rounded-xl hover:bg-[#4527a0] transition-colors text-sm">
              Save Goal
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
