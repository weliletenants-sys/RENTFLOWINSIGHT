import { useState, useEffect, useRef, createContext, useContext, ReactNode } from 'react';
import type { AppRole, AuthContextType, User, Session } from './auth/types';
import { authService } from '@/services/authService';
import { userService } from '@/services/userService';
import { getAuthToken } from '@/services/apiClient';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [role, setRole] = useState<AppRole | null>(null);
  const [roles, setRoles] = useState<AppRole[]>([]);
  const rolesRef = useRef<AppRole[]>([]);
  const [loading, setLoading] = useState(true);

  const setRolesWithRef = (newRoles: AppRole[]) => {
    rolesRef.current = newRoles;
    setRoles(newRoles);
  };

  useEffect(() => {
    let isMounted = true;

    const initializeAuth = async () => {
      const token = getAuthToken();
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const profile = await userService.getCurrentProfile();
        if (!isMounted) return;

        const sessionUser: User = {
          id: profile.id,
          email: profile.email,
          phone: profile.phone,
          fullName: `${profile.first_name || ''} ${profile.last_name || ''}`.trim(),
        };

        setUser(sessionUser);
        setSession({ access_token: token, user: sessionUser });

        const userRoles = profile.roles as AppRole[] || [];
        setRolesWithRef(userRoles);
        
        if (userRoles.length > 0) {
          const lastRole = localStorage.getItem('welile_last_role') as AppRole;
          setRole(userRoles.includes(lastRole) ? lastRole : userRoles[0]);
        }
      } catch (err) {
        console.warn('[Auth] Token invalid, clearing session');
        authService.logout();
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    initializeAuth();

    // Listen to custom auth events
    const handleUnauthorized = () => {
      if (isMounted) {
        setUser(null);
        setSession(null);
        setRolesWithRef([]);
        setRole(null);
      }
    };

    window.addEventListener('auth:unauthorized', handleUnauthorized);

    return () => {
      isMounted = false;
      window.removeEventListener('auth:unauthorized', handleUnauthorized);
    };
  }, []);

  const switchRole = (newRole: AppRole) => {
    if (rolesRef.current.includes(newRole)) {
      setRole(newRole);
      try { localStorage.setItem('welile_last_role', newRole); } catch {}
    }
  };

  const addRole = async (newRole: AppRole) => {
    // Implement API call to add role
    return { error: null };
  };

  const grantAndSwitchRole = async (newRole: AppRole) => {
    if (!rolesRef.current.includes(newRole)) {
      await addRole(newRole);
    }
    setRole(newRole);
    return { error: null };
  };

  const signOut = async () => {
    await authService.logout();
    setUser(null);
    setSession(null);
    setRole(null);
    setRolesWithRef([]);
  };

  const signIn = async (email: string, password: string) => {
    try {
      const data = await authService.login({ email, password });
      // Reload page to trigger initializeAuth which fetches profile
      window.location.reload();
      return { error: null };
    } catch (err: any) {
      return { error: new Error(err.message) };
    }
  };

  const signUp = async (email: string, password: string, fullName: string, phone: string, role: AppRole) => {
    try {
      const [firstName, ...rest] = fullName.split(' ');
      const lastName = rest.join(' ');
      await authService.register({ email, password, phone, role, firstName, lastName });
      window.location.reload();
      return { error: null };
    } catch (err: any) {
      return { error: new Error(err.message) };
    }
  };

  const signUpWithoutRole = async (email: string, password: string, fullName: string, phone: string) => {
    return signUp(email, password, fullName, phone, 'tenant'); // default
  };

  const signInWithGoogle = async () => ({ error: new Error('Not implemented') });
  const signInWithApple = async () => ({ error: new Error('Not implemented') });
  
  const resetPassword = async (email: string) => {
    // API logic for requesting reset
    return { error: null };
  };

  return (
    <AuthContext.Provider
      value={{
        user, session, role, roles, loading,
        signUp,
        signUpWithoutRole,
        signIn,
        signInWithGoogle,
        signInWithApple,
        signOut,
        switchRole,
        addRole,
        grantAndSwitchRole,
        resetPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
