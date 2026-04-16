import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/apiClient';
import { 
  cacheWallet, 
  getCachedWallet, 
  cacheTransactions, 
  getCachedTransactions,
  addToSyncQueue 
} from '@/lib/offlineDataStorage';
import { useServiceValidation } from '@/core/services/useServiceValidation';

interface WalletTransaction {
  id: string;
  sender_id: string;
  recipient_id: string;
  amount: number;
  description: string | null;
  created_at: string;
  sender_name?: string;
  recipient_name?: string;
  recipient_phone?: string;
}

interface Wallet {
  id: string;
  user_id: string;
  balance: number;
  created_at: string;
  updated_at: string;
}
// Module-level wallet cache to prevent duplicate fetches across component instances
let walletCache: { data: Wallet | null; userId: string; timestamp: number } | null = null;
const WALLET_CACHE_TTL = 30_000; // 30 seconds

export function useWallet() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { preValidateTransfer, checkBalance } = useServiceValidation();

  // Core React Query Implementation (Replaces rigid manual `useState` hydration)
  const { 
    data: wallet = null, 
    isLoading: walletLoading, 
    refetch: refreshWallet 
  } = useQuery({
    queryKey: ['wallet', user?.id],
    enabled: !!user,
    staleTime: 1000 * 60, // Keep fresh for 1 min
    queryFn: async () => {
      if (!user) return null;

      // 1. Supabase Source of Truth (Control System)
      const { data: supabaseData, error: sbError } = await supabase
        .from('wallets')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (!supabaseData && !sbError) {
        // Auto-initialize Wallet if missing
        const { data: newWallet } = await supabase
          .from('wallets')
          .insert({ user_id: user.id, balance: 0 })
          .select()
          .single();
        return newWallet;
      }

      // 2. Node Backend API Fetch (Parallel Experimental System)
      let apiData = null;
      try {
         const response = await apiClient.get('/wallets/my-wallet');
         apiData = response.data; 
         
         if (import.meta.env.DEV) {
            console.log('[Phase B Trial] Supabase vs API Wallet:', { supabaseData, apiData });
            if (supabaseData?.balance !== apiData?.balance) {
               console.warn(`[Ledger Warning] Backend Drift Detected. SB: ${supabaseData?.balance} | Node: ${apiData?.balance}`);
            }
         }
      } catch (err) {
         console.warn('[API Warning] Backend wallet fetch failed, smoothly falling back to Supabase', err);
      }

      // 3. Compare & Prefer Node over SB (or fallback)
      const finalData = apiData?.balance !== undefined ? apiData : supabaseData;
      
      // Mirror to traditional offline storage silently to appease legacy components
      try { localStorage.setItem(`wallet_${user.id}`, JSON.stringify(finalData)); } catch {}
      await cacheWallet(finalData);

      return finalData;
    }
  });

  const [transactions, setTransactions] = useState<WalletTransaction[]>([]);
  const loading = walletLoading;
  const isOfflineData = false;
  const lastSyncedAt = new Date();

    // Temporary fallback fetcher for transactions without Query for phase execution isolation!
    const fetchTransactions = useCallback(async () => {
    if (!user) return;

    // Try cached transactions first
    try {
      const cached = await getCachedTransactions();
      if (cached.length > 0) {
        setTransactions(cached.filter(t => t.sender_id === user.id || t.recipient_id === user.id));
      }
    } catch (e) {
      console.warn('[useWallet] Cache read failed:', e);
    }

    if (!navigator.onLine) return;

    try {
      const { data, error } = await supabase
        .from('wallet_transactions')
        .select('*')
        .or(`sender_id.eq.${user.id},recipient_id.eq.${user.id}`)
        .order('created_at', { ascending: false })
        .limit(5);

      if (error) {
        console.error('Error fetching transactions:', error);
        return;
      }

      if (data && data.length > 0) {
        // Filter out pool deployment transactions (admin-only visibility)
        const ADMIN_ONLY_DESCRIPTIONS = ['pool deployment'];
        const filteredData = data.filter(t =>
          !ADMIN_ONLY_DESCRIPTIONS.some(term => t.description?.toLowerCase().startsWith(term))
        );
        const userIds = [...new Set([...filteredData.map(t => t.sender_id), ...filteredData.map(t => t.recipient_id)])];
        
        const { data: profiles } = await supabase
          .from('profiles')
          .select('id, full_name, phone')
          .in('id', userIds);

        const profileMap = new Map(profiles?.map(p => [p.id, p]) || []);

        const enrichedTransactions = filteredData.map(t => ({
          ...t,
          sender_name: profileMap.get(t.sender_id)?.full_name || 'Unknown',
          recipient_name: profileMap.get(t.recipient_id)?.full_name || 'Unknown',
          recipient_phone: profileMap.get(t.recipient_id)?.phone || '',
        }));

        setTransactions(enrichedTransactions);
        await cacheTransactions(enrichedTransactions);
      } else {
        setTransactions([]);
      }
    } catch (e) {
      console.warn('[useWallet] Failed to fetch transactions:', e);
    }
  }, [user]);

  const sendMoney = useCallback(async (recipientPhone: string, amount: number, description?: string) => {
    if (!user) return { error: new Error('Please log in first') };

    const transferCheck = preValidateTransfer({ senderId: user.id, recipientPhone, amount, description });
    if (!transferCheck.shouldProceed) return { error: new Error(transferCheck.errors?.[0] || 'Validation failed') };

    if (wallet) {
      const balanceCheck = checkBalance(wallet.balance, amount);
      if (!balanceCheck.shouldProceed) return { error: new Error(balanceCheck.errors?.[0] || 'Insufficient balance') };
      
      // Extreme Optimistic Updates via QueryClient
      queryClient.setQueryData(['wallet', user.id], (old: any) => 
        old ? { ...old, balance: old.balance - amount } : old
      );
    }
    
    try {
      // 1. Fire strict transfer via native Node API
      let resError = null;
      try {
          await apiClient.post('/wallets/transfers', { recipientPhone, amount, description });
      } catch (err: any) {
          console.warn('[API Failover] Backend Transfer crashed, invoking Supabase Edge Node:', err);
          const { error, data } = await supabase.functions.invoke('wallet-transfer', {
             body: { recipient_phone: recipientPhone, amount, description: description || 'Wallet transfer' }
          });
          if (error || data?.error) resError = error || new Error(data?.error);
      }

      if (resError) {
         // Instantly Re-fetch authoritative truth on failure Rollback
         queryClient.invalidateQueries({ queryKey: ['wallet', user.id] });
         return { error: new Error(resError.message || 'Transfer failed') };
      }

      // Success: Silently re-sync and trust SSE triggers downstream
      queryClient.invalidateQueries({ queryKey: ['wallet', user.id] });
      return { error: null };
    } catch (e: any) {
      queryClient.invalidateQueries({ queryKey: ['wallet', user.id] });
      return { error: new Error(e.message || 'Transfer failed') };
    }
  }, [user, wallet, preValidateTransfer, checkBalance, queryClient]);

  const depositMoney = useCallback(async (_amount: number) => {
    // Direct client-side wallet updates are not allowed for security.
    // Use the deposit request flow instead (approve-deposit edge function).
    return { error: new Error('Direct deposits not allowed. Please use the deposit request flow.') };
  }, []);

  useEffect(() => {
    if (user) {
      fetchTransactions();

      // SINGLE realtime channel natively piped into QueryClient invalidation
      const walletChannel = supabase
        .channel(`wallet-${user.id}`)
        .on(
          'postgres_changes',
          { event: 'UPDATE', schema: 'public', table: 'wallets', filter: `user_id=eq.${user.id}` },
          (payload) => {
            if (payload.new) {
               // Update Realtime Cache (Optimistic overwrite)
               queryClient.setQueryData(['wallet', user.id], payload.new);
            }
          }
        )
        .subscribe();

      // Implement new native SSE Listener here as backup abstraction to bypass Supabase Channels later
      const sseSource = new EventSource(`${apiClient.defaults.baseURL}/settings/sse?token=${localStorage.getItem('access_token')}`);
      sseSource.onmessage = (event) => {
          try {
             const data = JSON.parse(event.data);
             if (data.type === 'INVALIDATE' && data.keys?.includes(`wallet-${user.id}`)) {
                queryClient.invalidateQueries({ queryKey: ['wallet', user.id] });
             }
          } catch(e) {}
      };

      return () => {
        supabase.removeChannel(walletChannel);
        sseSource.close();
      };
    }
  }, [user, fetchTransactions, queryClient]);

  return {
    wallet,
    transactions,
    loading,
    isOfflineData,
    lastSyncedAt,
    sendMoney,
    depositMoney,
    refreshWallet, // Hooks seamlessly to query refetch natively
    refreshTransactions: fetchTransactions,
  };
}
