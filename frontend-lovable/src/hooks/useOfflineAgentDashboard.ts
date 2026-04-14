// Offline-first agent dashboard data hook for instant loading
import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
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
  lastUpdated: number | null;
  hasLoadedOnce: boolean;
  isSyncing: boolean;
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
  const [stats, setStats] = useState<AgentDashboardStats>(defaultStats);
  const [isLoading, setIsLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isOfflineData, setIsOfflineData] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<number | null>(null);
  const [hasLoadedOnce, setHasLoadedOnce] = useState(false);
  const fetchInProgress = useRef(false);

  // Load cached data immediately for instant display
  const loadCachedData = useCallback(async () => {
    if (!user) return false;

    try {
      // Try IndexedDB first
      const cachedStats = await getCachedDashboardData(user.id, 'agent');
      
      if (cachedStats) {
        setStats(prev => ({ ...prev, ...cachedStats }));
        setLastUpdated(cachedStats.timestamp || null);
        setIsOfflineData(true);
        setHasLoadedOnce(true);
        return true;
      }
      
      const CACHE_KEY = `agent_dashboard_v2_${user.id}`;
      // Fallback to localStorage
      const cached = localStorage.getItem(CACHE_KEY);
      if (cached) {
        const data = JSON.parse(cached);
        setStats(prev => ({ ...prev, ...data.stats }));
        setLastUpdated(data.timestamp || null);
        setIsOfflineData(true);
        setHasLoadedOnce(true);
        return true;
      }

      return false;
    } catch (error) {
      console.warn('[useOfflineAgentDashboard] Failed to load cached data:', error);
      return false;
    }
  }, [user]);

  // Fetch fresh data from server
  const fetchFreshData = useCallback(async () => {
    if (!user || fetchInProgress.current) return;

    fetchInProgress.current = true;

    try {
      // Only fetch rent request count (core). Wallet balance comes from useWallet to avoid duplicate DB calls.
      const requestsRes = await supabase
        .from('rent_requests')
        .select('id', { count: 'exact', head: true })
        .eq('agent_id', user.id);

      // Wallet balance is read from cache or useWallet — no duplicate query
      const cachedWalletBalance = await (async () => {
        try {
          const { getCachedWallet } = await import('@/lib/offlineDataStorage');
          const cached = await getCachedWallet(user.id);
          return cached?.balance || 0;
        } catch { return 0; }
      })();

      const newStats: AgentDashboardStats = {
        tenantsCount: requestsRes.count || 0,
        referralCount: snapshot.referralCount || 0,
        subAgentCount: snapshot.subAgents?.length || 0,
        subAgentEarnings: 0, // Derived from snapshot if needed
        walletBalance: cachedWalletBalance,
        totalEarnings: 0,
      };

      // Update state
      const now = Date.now();
      setStats(newStats);
      setIsOfflineData(false);
      setLastUpdated(now);
      setHasLoadedOnce(true);

      // Cache for offline use
      const CACHE_KEY = `agent_dashboard_v2_${user.id}`;
      await cacheDashboardData(user.id, 'agent', { ...newStats, timestamp: now });
      localStorage.setItem(CACHE_KEY, JSON.stringify({ stats: newStats, timestamp: now }));
      
    } catch (error) {
      console.error('[useOfflineAgentDashboard] Failed to fetch data:', error);
    } finally {
      fetchInProgress.current = false;
    }
  }, [user, snapshot]);

  // Main data loading function
  const refreshData = useCallback(async () => {
    if (!user) {
      setStats(defaultStats);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    // Load cached data first for instant display
    const hasCachedData = await loadCachedData();
    
    if (hasCachedData) {
      // Show cached data immediately, loading state off
      setIsLoading(false);
    }

    // Fetch fresh data in background if online
    if (navigator.onLine) {
      setIsSyncing(true);
      await fetchFreshData();
      setIsSyncing(false);
    }

    setIsLoading(false);
  }, [user, loadCachedData, fetchFreshData]);

  // Initial load
  useEffect(() => {
    refreshData();
  }, [refreshData]);

  // Listen for online/offline changes
  useEffect(() => {
    const handleOnline = () => {
      // Refresh when coming back online
      fetchFreshData();
    };

    window.addEventListener('online', handleOnline);
    return () => window.removeEventListener('online', handleOnline);
  }, [fetchFreshData]);

  return {
    stats,
    isLoading,
    isOfflineData,
    refreshData,
    lastUpdated,
    hasLoadedOnce,
    isSyncing,
  };
}
