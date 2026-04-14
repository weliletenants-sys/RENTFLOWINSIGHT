import { WifiOff, CloudOff, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useOffline } from '@/contexts/OfflineContext';
import { Button } from '@/components/ui/button';

export function OfflineBanner() {
  const { isOnline, isSlowConnection, pendingSyncCount, syncNow } = useOffline();

  if (isOnline && !isSlowConnection && pendingSyncCount === 0) {
    return null;
  }

  return (
    <AnimatePresence>
      {/* Offline state relies on the global pill in App.tsx. We don't render a big red banner anymore. */}

      {isOnline && isSlowConnection && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="bg-muted text-muted-foreground px-4 py-1.5 flex items-center justify-center gap-2 text-[11px] font-medium border-b border-border/50"
        >
          <CloudOff className="h-3 w-3" />
          <span>Limited connectivity</span>
        </motion.div>
      )}

      {isOnline && pendingSyncCount > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="bg-primary/90 text-primary-foreground px-4 py-2 flex items-center justify-center gap-2 text-sm"
        >
          <RefreshCw className="h-4 w-4 animate-spin" />
          <span>{pendingSyncCount} pending change{pendingSyncCount > 1 ? 's' : ''} to sync</span>
          <Button 
            size="sm" 
            variant="secondary" 
            className="h-6 px-2 text-xs ml-2"
            onClick={syncNow}
          >
            Sync Now
          </Button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
