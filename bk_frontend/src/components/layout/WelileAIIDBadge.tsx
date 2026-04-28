import { Fingerprint } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export default function WelileAIIDBadge() {
  const { user } = useAuth();
  
  // Deterministic AI ID generator based on user ID or email
  const generateAIID = (identifier: string | undefined): string => {
    if (!identifier) return 'WEL-------';
    
    // Simple fast string hash
    const hash = Array.from(identifier).reduce((s, c) => Math.imul(31, s) + c.charCodeAt(0) | 0, 0);
    const hex = Math.abs(hash).toString(16).toUpperCase().padStart(6, '0').slice(0, 6);
    return `WEL-${hex}`;
  };

  const aiId = generateAIID(user?.id || user?.email);

  return (
    <div 
      className="flex items-center gap-2 bg-[#f3e8ff] text-[#7e22ce] px-3 py-1.5 rounded-full border border-[#d8b4fe] shadow-sm cursor-help transition-all hover:bg-[#e9d5ff]" 
      title="Your Welile AI ID - A secure financial fingerprint"
    >
      <Fingerprint className="w-4 h-4" />
      <span className="text-[13px] font-bold tracking-wide">{aiId}</span>
    </div>
  );
}
