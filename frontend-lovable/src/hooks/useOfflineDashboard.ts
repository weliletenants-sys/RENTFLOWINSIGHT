// Offline-first dashboard data hook for instant loading on smartphones
import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/apiClient';
import { 
  cacheDashboardData, 
  getCachedDashboardData,
  cacheRentRequests,
  getCachedRentRequests,
  cacheNotifications,
  getCachedNotifications,
} from '@/lib/offlineDataStorage';

interface DashboardStats {
  pendingRentRequests: number;
  activeRentRequests: number;
  totalRepayments: number;
  walletBalance: number;
  unreadNotifications: 0;
}

interface UseOfflineDashboardReturn {
  stats: DashboardStats | null;
  rentRequests: any[];
  notifications: any[];
  isLoading: boolean;
  isOfflineData: boolean;
  refreshData: () => Promise<void>;
  lastUpdated: Date | null;
}

const defaultStats: DashboardStats = {
  pendingRentRequests: 0,
  activeRentRequests: 0,
  totalRepayments: 0,
  walletBalance: 0,
  unreadNotifications: 0,
};

export function useOfflineDashboard(): UseOfflineDashboardReturn {
  const { user, role } = useAuth();
  const queryClient = useQueryClient();

  const loadCachedData = async () => {
    if (!user || !role) return null;
    try {
      const [stats, reqs, notifs] = await Promise.all([
        getCachedDashboardData(user.id, role),
        getCachedRentRequests(),
        getCachedNotifications(),
      ]);
      return (stats || reqs.length > 0) ? { stats, rentRequests: reqs, notifications: notifs } : null;
    } catch { return null; }
  };

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['dashboard_overview', user?.id],
    enabled: !!user && !!role,
    staleTime: 5000, 
    refetchInterval: 30000, // Background background refresh explicitly for dashboards
    initialData: () => {
       try {
           const raw = localStorage.getItem(`dash_${user?.id}`);
           return raw ? JSON.parse(raw) : undefined;
       } catch (e) {
           return undefined;
       }
    },
    queryFn: async () => {
      // 1. Control Group (Supabase Native)
      let supabaseStats: DashboardStats = { ...defaultStats };
      let supabaseRentRequests: any[] = [];
      try {
          const [rentData, walletData] = await Promise.all([
            supabase.from('rent_requests').select('*').eq('tenant_id', user!.id).order('created_at', { ascending: false }).limit(20),
            supabase.from('wallets').select('balance').eq('user_id', user!.id).maybeSingle(),
          ]);
          supabaseRentRequests = rentData.data || [];
          supabaseStats = {
            pendingRentRequests: supabaseRentRequests.filter((r: any) => r.status === 'pending').length,
            activeRentRequests: supabaseRentRequests.filter((r: any) => r.status === 'active' || r.status === 'approved').length,
            totalRepayments: supabaseRentRequests.reduce((sum: number, r: any) => sum + (r.total_repayment || 0), 0),
            walletBalance: walletData.data?.balance || 0,
            unreadNotifications: 0,
          };
      } catch (e) {}

      // 2. Experimental Group (Node API)
      let apiData = null;
      try {
          const res = await apiClient.get('/dashboard/overview');
          apiData = res.data;
          
          if (import.meta.env.DEV) {
             console.log('[Phase B Trial] Supabase vs API Dashboard:', { supabaseStats, apiStats: apiData.stats });
             if (supabaseStats.walletBalance !== apiData.stats.walletBalance) {
                console.warn(`[Ledger Warning] Backend Drift Detected. SB: ${supabaseStats.walletBalance} | Node: ${apiData.stats.walletBalance}`);
             }
          }
      } catch (err) {
          console.warn('[API Warning] Backend dashboard fetch failed, safely defaulting to Supabase legacy tree', err);
      }

      // Prioritize Node API cleanly
      const payload = apiData || {
          stats: supabaseStats,
          rentRequests: supabaseRentRequests,
          notifications: [],
          data_as_of: new Date().toISOString()
      };

      try {
        localStorage.setItem(`dash_${user?.id}`, JSON.stringify(payload));
        await Promise.all([
          cacheDashboardData(user!.id, role!, payload.stats),
          cacheRentRequests(payload.rentRequests),
        ]);
      } catch {}

      return payload;
    }
  });

  useEffect(() => {
    if (!user) return;
    
    // Explicit EventSource wiring for non-optimistic cache invalidation (correctness > latency)
    const sseSource = new EventSource(`${apiClient.defaults.baseURL}/settings/sse?token=${localStorage.getItem('access_token')}`);
    sseSource.onmessage = (event) => {
        try {
           const evData = JSON.parse(event.data);
           if (evData.type === 'INVALIDATE' && evData.keys?.includes(`dashboard-${user.id}`)) {
              queryClient.invalidateQueries({ queryKey: ['dashboard_overview', user.id] });
           }
        } catch(e) {}
    };

    return () => sseSource.close();
  }, [user, queryClient]);

  // Handle manual pulls instantly to ensure compatibility
  const refreshData = async () => { await refetch(); };

  return {
    stats: data?.stats || defaultStats,
    rentRequests: data?.rentRequests || [],
    notifications: data?.notifications || [],
    isLoading, // Handled automatically by skeleton loaders seamlessly upstream
    isOfflineData: false, 
    lastUpdated: data?.data_as_of ? new Date(data.data_as_of) : new Date(),
    refreshData,
  };
}
