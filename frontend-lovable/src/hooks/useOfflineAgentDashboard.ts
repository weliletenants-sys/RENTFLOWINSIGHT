// Offline-first agent dashboard data hook for instant loading
import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/apiClient';
import { 
  cacheDashboardData, 
  getCachedDashboardData,
  cacheProfile,
  getCachedProfile
} from '@/lib/offlineDataStorage';
import { useUserSnapshot } from './useUserSnapshot';

interface AgentDashboardStats {
  tenantsCount: number;
  referralCount: number;
  subAgentCount: number;
  subAgentEarnings: number;
  walletBalance: number;
  totalEarnings: number;
}

interface UseOfflineAgentDashboardReturn {
  stats: AgentDashboardStats;
  isLoading: boolean;
  isOfflineData: boolean;
  refreshData: () => Promise<void>;
  lastUpdated: Date | null;
  hasLoadedOnce: boolean;
}

const defaultStats: AgentDashboardStats = {
  tenantsCount: 0,
  referralCount: 0,
  subAgentCount: 0,
  subAgentEarnings: 0,
  walletBalance: 0,
  totalEarnings: 0,
};

export function useOfflineAgentDashboard(): UseOfflineAgentDashboardReturn {
  const { user } = useAuth();
  const { snapshot } = useUserSnapshot(user?.id);
  const queryClient = useQueryClient();

  const loadCachedData = async () => {
    if (!user) return null;
    try {
      const cachedStats = await getCachedDashboardData(user.id, 'agent');
      return cachedStats || null;
    } catch { return null; }
  };

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['agent_dashboard_overview', user?.id],
    enabled: !!user,
    staleTime: 5000,
    refetchInterval: 30000, 
    initialData: () => {
       try {
           const raw = localStorage.getItem(`agent_dashboard_${user?.id}`);
           return raw ? { stats: JSON.parse(raw) } : undefined;
       } catch (e) {
           return undefined;
       }
    },
    queryFn: async () => {
       // 1. Control Source (Supabase Native)
       let supabaseStats: AgentDashboardStats = { ...defaultStats };
       try {
          const requestsRes = await supabase.from('rent_requests').select('id', { count: 'exact', head: true }).eq('agent_id', user!.id);
          const cachedWalletBalance = await (async () => {
             try {
                const { getCachedWallet } = await import('@/lib/offlineDataStorage');
                const cached = await getCachedWallet(user!.id);
                return cached?.balance || 0;
             } catch { return 0; }
          })();

          supabaseStats = {
             tenantsCount: requestsRes.count || 0,
             referralCount: snapshot.referralCount || 0,
             subAgentCount: snapshot.subAgents?.length || 0,
             subAgentEarnings: 0, 
             walletBalance: cachedWalletBalance,
             totalEarnings: 0,
          };
       } catch (e) {}

       // 2. Experimental Verification Source (Node.js API)
       let apiData = null;
       try {
           const res = await apiClient.get('/dashboard/agent-overview');
           apiData = res.data;
           
           if (import.meta.env.DEV) {
              console.log('[Phase B Trial] Supabase vs API Agent Dashboard:', { supabaseStats, apiStats: apiData.stats });
              if (supabaseStats.tenantsCount !== apiData.stats.tenantsCount) {
                 console.warn(`[Ledger Warning] Backend Drift Detected. SB Tenants: ${supabaseStats.tenantsCount} | Node: ${apiData.stats.tenantsCount}`);
              }
           }
       } catch (err) {
           console.warn('[API Warning] Backend agent dashboard fetch failed, safely holding Supabase legacy output', err);
       }

       // 3. Fallback gracefully
       const payload = apiData || { stats: supabaseStats, data_as_of: new Date().toISOString() };

       try {
           localStorage.setItem(`agent_dashboard_${user!.id}`, JSON.stringify(payload.stats));
           await cacheDashboardData(user!.id, 'agent', payload.stats);
       } catch {}

       return payload;
    }
  });

  useEffect(() => {
    if (!user) return;
    
    // Explicit SSE Registration natively validating cache structure instantly asynchronously
    const sseSource = new EventSource(`${apiClient.defaults.baseURL}/settings/sse?token=${localStorage.getItem('access_token')}`);
    sseSource.onmessage = (event) => {
        try {
           const evData = JSON.parse(event.data);
           if (evData.type === 'INVALIDATE' && evData.keys?.includes(`agent_dashboard-${user.id}`)) {
              queryClient.invalidateQueries({ queryKey: ['agent_dashboard_overview', user.id] });
           }
        } catch(e) {}
    };

    return () => sseSource.close();
  }, [user, queryClient]);

  const refreshData = async () => { await refetch(); };

  return {
    stats: data?.stats || defaultStats,
    isLoading,
    isOfflineData: false,
    refreshData,
    lastUpdated: data?.data_as_of ? new Date(data.data_as_of) : new Date(),
    hasLoadedOnce: !!data,
  };
}
