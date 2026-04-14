import { supabase } from '@/integrations/supabase/client';

export type OfflineActionType = 'UPDATE_PROFILE' | 'CREATE_TENANT' | 'SAVE_PREFERENCES';

export interface OfflineAction {
  id: string;
  type: OfflineActionType;
  payload: any;
  createdAt: number;
  retryCount: number;
}

const QUEUE_KEY = 'welile_offline_action_queue';

class OfflineActionQueue {
  private getQueue(): OfflineAction[] {
    try {
      const raw = localStorage.getItem(QUEUE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }

  private setQueue(queue: OfflineAction[]) {
    localStorage.setItem(QUEUE_KEY, JSON.stringify(queue));
  }

  public enqueue(type: OfflineActionType, payload: any) {
    const queue = this.getQueue();
    const action: OfflineAction = {
      id: crypto.randomUUID(),
      type,
      payload,
      createdAt: Date.now(),
      retryCount: 0
    };
    queue.push(action);
    this.setQueue(queue);
    
    // Broadcast generic event for UI components
    window.dispatchEvent(new CustomEvent('offline-action-queued', { detail: action }));
  }

  public async processQueue(onSuccess?: (type: OfflineActionType) => void, onError?: (type: OfflineActionType, err: any) => void) {
    if (!navigator.onLine) return; // Failsafe
    
    const queue = this.getQueue();
    if (queue.length === 0) return;

    // Filter to retain failed items instead of deleting the whole queue instantly
    console.log(`[OfflineQueue] Processing ${queue.length} pending actions`);
    
    const remainingQueue: OfflineAction[] = [];

    // Process sequentially to respect chronological order
    for (const action of queue) {
      try {
        await this.handleAction(action);
        console.log(`[OfflineQueue] Successfully synced ${action.type}`);
        onSuccess?.(action.type);
      } catch (error) {
        console.error(`[OfflineQueue] Failed to sync ${action.type}:`, error);
        onError?.(action.type, error);
        
        // Retry tracking
        action.retryCount = (action.retryCount || 0) + 1;
        if (action.retryCount <= 3) {
          remainingQueue.push(action);
        } else {
          console.error(`[OfflineQueue] Dropping action ${action.id} after max retries.`);
        }
      }
    }

    this.setQueue(remainingQueue);
    window.dispatchEvent(new CustomEvent('offline-queue-processed'));
  }

  public getPendingCount(): number {
    return this.getQueue().length;
  }

  // --- Handlers for specific intents ---
  private async handleAction(action: OfflineAction) {
    switch (action.type) {
      case 'UPDATE_PROFILE':
        // Expects payload: { userId, updateData }
        const { userId, updateData } = action.payload;
        if (!userId || !updateData) throw new Error("Invalid payload for UPDATE_PROFILE");
        
        const { error } = await supabase
          .from('profiles')
          .update(updateData)
          .eq('id', userId);
        
        if (error) throw error;
        break;
        
      // Future scope: SAFE ACTIONS ONLY
      // case 'CREATE_TENANT':
      //   break;

      default:
        console.warn(`[OfflineQueue] No handler defined for action type: ${action.type}`);
        // Consider it handled so it gets cleared out
        break;
    }
  }
}

export const offlineQueue = new OfflineActionQueue();

// Register the global flusher (must only run once typically, let's put it in App.tsx or invoke it here)
// E.g., `window.addEventListener('online', () => offlineQueue.processQueue(...))`
