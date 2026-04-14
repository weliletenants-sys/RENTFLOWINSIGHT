import { useEffect, useState, useCallback, useRef, Suspense, lazy, memo } from 'react';

import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth, AppRole } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import AddRoleDialog from '@/components/AddRoleDialog';
import BottomRoleSwitcher from '@/components/BottomRoleSwitcher';
// FloatingChatButton removed — chat accessible only via nav

import { ISOLATED_ROLES, roleDashboardRoutes } from '@/components/layout/executiveSidebarConfig';

import { Loader2, WifiOff, RefreshCw, ShieldAlert } from 'lucide-react';

import { getCachedUserRoles, cacheUserRoles } from '@/lib/offlineDataStorage';
import { getPreloadedRoles } from '@/lib/sessionCache';
import { getPreferredDefaultRole, areAllRolesUnlocked } from '@/hooks/useAppPreferences';
import { useDeployedCapital } from '@/hooks/useDeployedCapital';
import { useToast } from '@/hooks/use-toast';
import { useConfetti } from '@/components/Confetti';
import { Button } from '@/components/ui/button';
// Lazy load dashboards for faster initial load
const TenantDashboard = lazy(() => import('@/components/dashboards/TenantDashboard'));
const AgentDashboard = lazy(() => import('@/components/dashboards/AgentDashboard'));
const SupporterDashboard = lazy(() => import('@/components/dashboards/SupporterDashboard'));
const LandlordDashboard = lazy(() => import('@/components/dashboards/LandlordDashboard'));
const ManagerDashboard = lazy(() => import('@/components/dashboards/ManagerDashboard'));

// Progressive reveal loading layout matches App.tsx Smart Shell
const DashboardLoadingFallback = memo(({ role }: { role?: AppRole | null }) => {
  const [offlineMode, setOfflineMode] = useState(false);
  const [cachedName, setCachedName] = useState('');
  
  useEffect(() => {
    const timer = setTimeout(() => setOfflineMode(true), 8000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    try {
      const authStr = localStorage.getItem('sb-wirntoujqoyjobfhyelc-auth-token');
      if (authStr) {
        const { user } = JSON.parse(authStr);
        if (user?.user_metadata?.full_name) {
          setCachedName(user.user_metadata.full_name.split(' ')[0]);
        }
      }
    } catch {}
  }, []);

  // Dedicated Funder (Supporter) Skeleton to maintain vibrant purple PWA aesthetic
  if (role === 'supporter') {
    return (
      <div className="h-dvh bg-background flex flex-col overflow-hidden pb-24">
        {/* Top Funder Header Area */}
        <div className="h-14 flex items-center justify-between px-4 border-b border-border bg-[#7c3aed]">
          <div className="w-24 h-6 bg-white/20 rounded-md animate-pulse"></div>
          <div className="flex gap-3 text-white/50">
            <div className="w-6 h-6 rounded-md bg-white/20 animate-pulse"></div>
            <div className="w-6 h-6 rounded-md bg-white/20 animate-pulse"></div>
          </div>
        </div>

        <div className="px-3 xs:px-4 py-4 xs:py-5 space-y-5 max-w-lg mx-auto w-full">
          {/* Centered Avatar Greet */}
          <div className="flex flex-col items-center gap-2 py-2">
            <div className="w-[56px] h-[56px] rounded-full bg-muted/60 animate-pulse border-2 border-primary/20"></div>
            <div className="flex flex-col items-center gap-1">
              <div className="w-20 h-4 bg-muted/60 rounded animate-pulse"></div>
              <div className="w-16 h-2 bg-muted/60 rounded animate-pulse"></div>
            </div>
            <div className="w-32 h-6 bg-muted/40 rounded-full animate-pulse mt-2"></div>
          </div>

          {/* Purple Wallet Hero Skeleton */}
          <div className="w-full rounded-[24px] bg-[#6116ca] overflow-hidden shadow-xl p-5 relative animate-pulse flex flex-col gap-6">
            <div className="flex justify-between items-start">
               <div className="w-32 h-4 bg-white/20 rounded"></div>
               <div className="w-16 h-5 bg-white/30 rounded-full"></div>
            </div>
            
            <div className="w-32 h-7 bg-white/20 rounded"></div>
            
            <div className="grid grid-cols-3 gap-2 mt-4">
              <div className="h-[60px] bg-white/10 rounded-xl"></div>
              <div className="h-[60px] bg-white/10 rounded-xl"></div>
              <div className="h-[60px] bg-white/10 rounded-xl"></div>
            </div>
          </div>

          {/* Buttons Area */}
          <div className="flex gap-2">
            <div className="flex-1 h-12 bg-primary/20 rounded-2xl animate-pulse"></div>
            <div className="w-[100px] h-12 bg-muted/60 rounded-2xl animate-pulse border-2 border-border/60"></div>
            <div className="w-16 h-12 bg-muted/60 rounded-2xl animate-pulse border-2 border-border/60"></div>
          </div>

          <div className="space-y-4">
            <div className="w-40 h-6 bg-muted/60 rounded animate-pulse"></div>
            <div className="h-16 bg-card/40 border border-border/60 rounded-xl animate-pulse"></div>
            <div className="h-16 bg-card/40 border border-border/60 rounded-xl animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  // Fallback generic grey skeleton for tenants/agents/etc
  return (
    <div className="min-h-screen bg-background relative font-sans antialiased pb-24">
      {/* Structural Top Bar Anchor */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-border bg-card">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-muted/80 animate-pulse"></div>
          <div className="flex flex-col gap-1.5">
            <div className="w-32 h-3 rounded-md bg-muted/80 animate-pulse"></div>
          </div>
        </div>
        <div className="w-8 h-8 rounded-full bg-muted/80 animate-pulse"></div>
      </div>
      
      <div className="p-5 flex-1 flex flex-col gap-6 max-w-lg mx-auto w-full">
        <div>
          <h1 className="text-xl font-bold">👋 Welcome back{cachedName ? `, ${cachedName}` : ''}</h1>
        </div>

        <div className="w-full rounded-3xl bg-card border shadow-sm p-5 relative overflow-hidden">
          <div className="flex justify-between items-start mb-4">
            <div className="text-sm font-medium text-muted-foreground">Balance</div>
            <div className="flex items-center gap-1.5 text-[10px] bg-muted px-2.5 py-1 rounded-full text-foreground/70">
               {offlineMode ? <>Limited connectivity</> : <><div className="w-2 h-2 rounded-full border border-current border-t-transparent animate-spin"/> syncing...</>}
            </div>
          </div>
          {/* Shimmer skeleton replaces fake balance to preserve trust */}
          <div className="w-48 h-10 bg-muted/60 rounded-lg animate-pulse mb-6"></div>
          <div className="flex gap-3">
            <div className="flex-1 h-11 bg-muted/40 rounded-xl flex items-center justify-center text-xs font-semibold text-muted-foreground/50 border border-border/50">Send</div>
            <div className="flex-1 h-11 bg-muted/40 rounded-xl flex items-center justify-center text-xs font-semibold text-muted-foreground/50 border border-border/50">Receive</div>
          </div>
        </div>
        
        <div>
          <h2 className="text-sm font-bold mb-3">Recent Activity</h2>
          <div className="space-y-3">
            {[1, 2].map((i) => (
              <div key={i} className="flex gap-3 items-center p-3 rounded-2xl border bg-card/40">
                <div className="w-10 h-10 rounded-full bg-muted/60 animate-pulse" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 bg-muted/60 rounded w-1/3 animate-pulse" />
                  <div className="h-2 bg-muted/60 rounded w-1/4 animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
});
DashboardLoadingFallback.displayName = 'DashboardLoadingFallback';

// Offline fallback when dashboard can't load
const OfflineFallback = ({ cachedRole, onRetry }: { cachedRole?: AppRole | null; onRetry: () => void }) => (
  <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4 p-6">
    <div className="w-16 h-16 rounded-full bg-warning/20 flex items-center justify-center">
      <WifiOff className="h-8 w-8 text-warning" />
    </div>
    <div className="text-center space-y-2 max-w-sm">
      <h1 className="text-xl font-semibold">You're Offline</h1>
      <p className="text-muted-foreground text-sm">
        {cachedRole 
          ? `Your ${cachedRole} dashboard will load with cached data when connection is restored.`
          : 'Please check your internet connection and try again.'
        }
      </p>
    </div>
    <Button onClick={onRetry} className="gap-2">
      <RefreshCw className="h-4 w-4" />
      Retry Connection
    </Button>
    <p className="text-xs text-muted-foreground/60 text-center mt-4">
      The app works best with an internet connection, but cached data is available when offline.
    </p>
  </div>
);

function DashboardContent() {
  const { user, role, roles, loading, signOut, switchRole, addRole, grantAndSwitchRole } = useAuth();
  const [pendingRole, setPendingRole] = useState<AppRole | null>(null);

  // Clear pendingRole when the active role matches it
  useEffect(() => {
    if (pendingRole && role === pendingRole) {
      setPendingRole(null);
    }
  }, [role, pendingRole]);

  const handlePublicRoleSwitch = useCallback(async (newRole: AppRole) => {
    if (newRole === role && !pendingRole) return;
    if (pendingRole) return; // Already switching, ignore taps
    
    const publicRoles: AppRole[] = ['tenant', 'agent', 'landlord', 'supporter'];
    if (!publicRoles.includes(newRole) && !roles.includes(newRole)) {
      return; // Non-public role they don't have — block
    }

    setPendingRole(newRole);

    if (publicRoles.includes(newRole)) {
      // Use atomic grant-and-switch to avoid race condition
      const { error } = await grantAndSwitchRole(newRole);
      if (error) {
        console.warn('[Dashboard] Failed to switch role:', error.message);
        setPendingRole(null);
        return;
      }
    } else {
      switchRole(newRole);
    }
  }, [role, roles, pendingRole, switchRole, grantAndSwitchRole]);

  const { profile } = useProfile();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  
  // INSTANT: Use preloaded session cache for immediate display
  const preloadedRoles = getPreloadedRoles() as AppRole[] | null;
  const [cachedRoles, setCachedRoles] = useState<AppRole[]>(preloadedRoles || []);
  const [showCachedUI, setShowCachedUI] = useState(!!preloadedRoles?.length);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const { toast } = useToast();
  const { fireSuccess } = useConfetti();
  const { isQualifiedInvestor } = useDeployedCapital(user?.id);

  // Derive frozen state from profile (no separate DB call)
  const isFrozen = profile?.is_frozen ?? false;
  const frozenReason = profile?.frozen_reason || 'Your account has been frozen for violating platform policies.';
  

  // Monitor online status
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

  // Auto-default qualified investors (≥100K deployed) to Funder dashboard on INITIAL load only
  const hasAutoDefaulted = useRef(false);
  useEffect(() => {
    if (loading || !user || roles.length === 0) return;
    if (hasAutoDefaulted.current) return; // Only auto-default once per session
    if (!isQualifiedInvestor) return;
    if (areAllRolesUnlocked()) return;
    const preferred = getPreferredDefaultRole();
    if (preferred !== 'auto') return;
    if (role !== 'supporter' && roles.includes('supporter')) {
      switchRole('supporter');
    }
    hasAutoDefaulted.current = true;
  }, [loading, user, roles, role, isQualifiedInvestor, switchRole]);

  // Handle role switch via URL param (e.g. after tenant/supporter activation)
  // Gate on !loading && roles.length > 0 to prevent race with fetchUserRoles
  useEffect(() => {
    if (loading || roles.length === 0 || !user) return;
    const requestedRole = searchParams.get('role') as AppRole | null;
    if (!requestedRole) return;
    const validRoles: AppRole[] = ['tenant', 'agent', 'landlord', 'supporter', 'manager'];
    if (validRoles.includes(requestedRole) && roles.includes(requestedRole)) {
      switchRole(requestedRole);
    }
    searchParams.delete('role');
    setSearchParams(searchParams, { replace: true });
  }, [searchParams, user, loading, roles, switchRole, setSearchParams]);

  // Redirect executive/internal roles to their isolated dashboards
  useEffect(() => {
    if (!user || loading || !role) return;
    if (ISOLATED_ROLES.includes(role)) {
      const route = roleDashboardRoutes[role];
      if (route) {
        navigate(route, { replace: true });
      }
    }
  }, [user, loading, role, navigate]);

   // Handle investment account activation via link (investment_accounts table removed)
  useEffect(() => {
    const activateAccountId = searchParams.get('activate_account');
    if (!activateAccountId || !user) return;

    // investment_accounts table removed - just clear the param
    searchParams.delete('activate_account');
    setSearchParams(searchParams, { replace: true });
  }, [searchParams, user, toast, fireSuccess, setSearchParams]);

  // Try to load cached roles for instant display
  useEffect(() => {
    const loadCachedRoles = async () => {
      if (user && roles.length === 0 && loading) {
        try {
          const cached = await getCachedUserRoles(user.id);
          if (cached.length > 0) {
            setCachedRoles(cached as AppRole[]);
            setShowCachedUI(true);
          }
        } catch (e) {
          console.warn('[Dashboard] Failed to load cached roles:', e);
        }
      }
    };
    loadCachedRoles();
  }, [user, roles, loading]);

  // Cache roles when loaded
  useEffect(() => {
    if (user && roles.length > 0) {
      cacheUserRoles(user.id, roles).catch(console.warn);
      setShowCachedUI(false);
    }
  }, [user, roles]);

  // Safety redirect: wait briefly for roles to arrive before redirecting
  useEffect(() => {
    if (loading) return;

    if (!user) {
      navigate('/auth', { replace: true });
      return;
    }

    // Roles may still be loading asynchronously after auth loading finishes.
    // Wait 1.5s before concluding user has no roles to prevent flash redirect.
    if (user && roles.length === 0 && cachedRoles.length === 0) {
      const timeout = setTimeout(() => {
        // Re-check: roles may have arrived during the wait
        if (roles.length === 0 && cachedRoles.length === 0) {
          navigate('/select-role', { replace: true });
        }
      }, 1500);
      return () => clearTimeout(timeout);
    }
  }, [user, loading, roles, cachedRoles, navigate]);

  // Use cached role for instant display while loading
  const getDefaultRole = (availableRoles: AppRole[]): AppRole | null => {
    if (availableRoles.length === 0) return null;
    // Check user's preferred default role
    const preferred = getPreferredDefaultRole();
    if (preferred !== 'auto' && availableRoles.includes(preferred as AppRole)) return preferred as AppRole;
    // Fallback to supporter
    if (availableRoles.includes('supporter')) return 'supporter';
    return availableRoles[0];
  };
  
  const displayRole = role || (showCachedUI && cachedRoles.length > 0 ? getDefaultRole(cachedRoles) : null);
  const displayRoles = roles.length > 0 ? roles : cachedRoles;

  // 🚫 FROZEN ACCOUNT - Block all access
  if (isFrozen) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
        <div className="max-w-md w-full space-y-6 text-center">
          <div className="w-20 h-20 rounded-full bg-destructive/20 flex items-center justify-center mx-auto">
            <ShieldAlert className="h-10 w-10 text-destructive" />
          </div>
          <div className="bg-destructive/10 border-2 border-destructive rounded-xl p-6 space-y-3">
            <h1 className="text-xl font-bold text-destructive">🚫 Account Frozen</h1>
            <p className="text-destructive font-medium text-sm leading-relaxed">
              {frozenReason}
            </p>
          </div>
          <div className="bg-destructive/5 border border-destructive/30 rounded-lg p-4 space-y-2">
            <p className="text-sm font-semibold text-destructive">⚠️ All transactions are blocked</p>
            <p className="text-xs text-muted-foreground">
              Deposits, withdrawals, transfers, and all other operations have been suspended pending investigation.
            </p>
          </div>
          <div className="bg-card border rounded-lg p-4 space-y-2">
            <p className="text-sm font-medium">Need help? Contact Support on WhatsApp</p>
            <a href="https://wa.me/256708257899" target="_blank" rel="noopener noreferrer" className="block text-lg font-bold text-green-600 underline">
              💬 0708 257 899
            </a>
            <p className="text-xs text-muted-foreground">
              WhatsApp only
            </p>
          </div>
          <button
            onClick={() => signOut()}
            className="text-xs text-muted-foreground underline hover:text-foreground"
          >
            Sign out
          </button>
        </div>
      </div>
    );
  }

// Allow dashboards to render with cached data when offline
  // Only show offline fallback if we have no cached roles at all
  if (loading && !showCachedUI && !isOnline && cachedRoles.length === 0) {
    return <OfflineFallback cachedRole={null} onRetry={() => window.location.reload()} />;
  }

  // If loading but offline with cached roles, skip loading and show cached UI
  if (loading && !isOnline && cachedRoles.length > 0) {
    // Use cached roles directly
    const cachedDisplayRole = cachedRoles[0];
    const dashboardProps = { 
      user: user!, 
      signOut, 
      currentRole: cachedDisplayRole, 
      availableRoles: cachedRoles, 
      onRoleChange: switchRole,
      addRoleComponent: <AddRoleDialog availableRoles={cachedRoles} onAddRole={addRole} />
    };

    return (
      <>
        <Suspense fallback={<DashboardLoadingFallback role={cachedDisplayRole} />}>
          {cachedDisplayRole === 'tenant' && <TenantDashboard {...dashboardProps} />}
          {cachedDisplayRole === 'agent' && <AgentDashboard {...dashboardProps} />}
          {cachedDisplayRole === 'supporter' && <SupporterDashboard {...dashboardProps} />}
          {cachedDisplayRole === 'landlord' && <LandlordDashboard {...dashboardProps} />}
          {cachedDisplayRole === 'manager' && <ManagerDashboard {...dashboardProps} />}
        </Suspense>
      </>
    );
  }

  if ((loading && !showCachedUI) || pendingRole) {
    return (
      <>
        <DashboardLoadingFallback role={pendingRole || displayRole} />
        {/* Keep bottom nav visible during transition for continuity */}
        {pendingRole && displayRole && ['tenant', 'agent', 'landlord', 'supporter'].includes(pendingRole) && (
          <BottomRoleSwitcher currentRole={pendingRole} onRoleChange={handlePublicRoleSwitch} />
        )}
      </>
    );
  }

  // If no user and not loading, the redirect effect above will handle it.
  // Show loading fallback briefly while redirect kicks in.
  if (!user || !displayRole) {
    return <DashboardLoadingFallback role={displayRole} />;
  }

  const isPublicRole = ['tenant', 'agent', 'landlord', 'supporter'].includes(displayRole);

  const dashboardProps = { 
    user, 
    signOut, 
    currentRole: displayRole, 
    availableRoles: displayRoles, 
    onRoleChange: handlePublicRoleSwitch,
    addRoleComponent: <AddRoleDialog availableRoles={displayRoles} onAddRole={addRole} />
  };

  const renderDashboard = () => {
    switch (displayRole) {
      case 'tenant':
        return <TenantDashboard {...dashboardProps} />;
      case 'agent':
        return <AgentDashboard {...dashboardProps} />;
      case 'supporter':
        return <SupporterDashboard {...dashboardProps} />;
      case 'landlord':
        return <LandlordDashboard {...dashboardProps} />;
      case 'manager':
        return <ManagerDashboard {...dashboardProps} />;
      default:
        return (
          <div className="min-h-screen bg-background flex items-center justify-center">
            <p>Unknown role. Please contact support.</p>
          </div>
        );
    }
  };

  return (
    <>
      <Suspense fallback={<DashboardLoadingFallback role={displayRole} />}>
        {renderDashboard()}
      </Suspense>
      {isPublicRole && (
        <BottomRoleSwitcher currentRole={displayRole} onRoleChange={handlePublicRoleSwitch} />
      )}
    </>
  );
}

// Main Dashboard component — LocationPermissionGate removed (was a passthrough)
export default function Dashboard() {
  return <DashboardContent />;
}
