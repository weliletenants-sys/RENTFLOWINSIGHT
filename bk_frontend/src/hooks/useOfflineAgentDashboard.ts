import { useState, useEffect, useCallback } from 'react';

interface AgentStats {
  visitsToday: number;
  collectionsTodayTotal: number;
  collectionsCount: number;
  floatLimit: number;
  floatCollected: number;
  walletBalance: number;
  tenantsCount: number;
}

const DEFAULT_STATS: AgentStats = {
  visitsToday: 0,
  collectionsTodayTotal: 0,
  collectionsCount: 0,
  floatLimit: 500000,
  floatCollected: 0,
  walletBalance: 0,
  tenantsCount: 0,
};

const CACHE_KEY = 'welile_agent_stats_cache';

export function useOfflineAgentDashboard() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [stats, setStats] = useState<AgentStats>(() => {
    const cached = localStorage.getItem(CACHE_KEY);
    return cached ? JSON.parse(cached) : DEFAULT_STATS;
  });

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const refreshData = useCallback(async () => {
    if (!isOnline) return;
    setIsRefreshing(true);
    try {
      // In a real implementation, this would fetch from the NestJS backend
      // await fetchWithAuth('/agent/stats')
      
      // Mocking a network delay for the offline-resilient refresh simulation
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const newStats: AgentStats = {
        visitsToday: Math.floor(Math.random() * 10),
        collectionsTodayTotal: 120000 + Math.floor(Math.random() * 20000),
        collectionsCount: 4,
        floatLimit: 500000,
        floatCollected: 120000,
        walletBalance: 450000,
        tenantsCount: 15,
      };

      setStats(newStats);
      localStorage.setItem(CACHE_KEY, JSON.stringify(newStats));
    } catch (error) {
      console.error('Failed to refresh data', error);
    } finally {
      setIsRefreshing(false);
    }
  }, [isOnline]);

  useEffect(() => {
    if (isOnline) {
      refreshData();
    }
  }, [isOnline, refreshData]);

  return {
    isOnline,
    isRefreshing,
    stats,
    refreshData,
  };
}
