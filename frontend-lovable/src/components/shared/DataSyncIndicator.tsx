import { RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';

interface DataSyncIndicatorProps {
  lastUpdated: number | null;
  isSyncing: boolean;
  className?: string; // For positioning
}

export const STALE_THRESHOLD_MS = 5 * 60 * 1000; // 5 minutes

export function DataSyncIndicator({ lastUpdated, isSyncing, className }: DataSyncIndicatorProps) {
  const [timeAgo, setTimeAgo] = useState<string>('');
  const [isStale, setIsStale] = useState(false);

  useEffect(() => {
    if (!lastUpdated) return;

    const calculateStaleness = () => {
      const diff = Date.now() - lastUpdated;
      setIsStale(diff > STALE_THRESHOLD_MS);

      if (diff < 60000) {
        setTimeAgo('just now');
      } else if (diff < 3600000) {
        setTimeAgo(`${Math.floor(diff / 60000)}m ago`);
      } else {
        const hours = Math.floor(diff / 3600000);
        setTimeAgo(`${hours}h ${hours > 24 ? 'old' : 'ago'}`);
      }
    };

    calculateStaleness();
    const interval = setInterval(calculateStaleness, 30000); // Check every 30s
    return () => clearInterval(interval);
  }, [lastUpdated]);

  if (!lastUpdated && !isSyncing) return null; // No context yet
  if (!isStale && !isSyncing) return null; // Fresh data, UI is quiet

  return (
    <div 
      className={cn(
        "inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-medium transition-all duration-300",
        isSyncing 
          ? "text-primary/70 bg-primary/5" 
          : "text-muted-foreground/60 bg-muted/40",
        className
      )}
    >
      {isSyncing ? (
        <>
          <RefreshCw className="h-3 w-3 animate-spin" />
          <span>Syncing</span>
        </>
      ) : (
        <>
          <span className="w-1.5 h-1.5 rounded-full bg-warning/50 animate-pulse" />
          <span>Updated {timeAgo}</span>
        </>
      )}
    </div>
  );
}
