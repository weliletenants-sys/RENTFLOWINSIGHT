import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import { logoutUser } from '../services/authApi';

export type Role = 'TENANT' | 'AGENT' | 'LANDLORD' | 'FUNDER' | 'SUPER_ADMIN' | 'CEO' | 'CFO' | 'COO' | 'CTO' | 'CMO' | 'CRM' | 'ADMIN' | null;

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: Role;
  phone?: string;
  isVerified?: boolean;
  avatar_url?: string;
}

interface AuthContextType {
  user: User | null;
  profile?: any;
  role: Role;
  login: (userData: User) => void;
  logout: () => void;
  switchRoleMode: (newRole: Role) => void;
  updateSession: (token: string, userData: User) => void;
  originalRole: Role;
  intendedRole: Role;
  setIntendedRole: (role: Role) => void;
  rentAmount: string;
  setRentAmount: (amount: string) => void;
  updateUserLocally: (updates: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  // Initialize user from local storage if available, otherwise null
  const [user, setUser] = useState<User | null>(() => {
    const token = localStorage.getItem('access_token');
    const storedUser = localStorage.getItem('user_data');
    
    if (token && storedUser) {
      try {
        return JSON.parse(storedUser);
      } catch (e) {
        // Fallback below
      }
    }
    
    if (token) {
      return {
        id: 'restored-session',
        email: 'restored@welile.com',
        firstName: 'Active',
        lastName: 'User',
        role: 'FUNDER',
      };
    }
    return null;
  });
  
  // Track the absolute original role so we don't lose admin privileges when switching views
  const [originalRole, setOriginalRole] = useState<Role>(() => {
    const storedUser = localStorage.getItem('user_data');
    if (storedUser) {
      try {
        return JSON.parse(storedUser).role;
      } catch(e) {}
    }
    return user?.role || null;
  });

  const [intendedRole, setIntendedRole] = useState<Role>('TENANT');
  const [rentAmount, setRentAmount] = useState<string>('');

  const login = (userData: User) => setUser(userData);
  
  const logout = async () => {
    const token = localStorage.getItem('access_token');
    const isFunder = user?.role === 'FUNDER';
    
    if (token) {
      try {
        await logoutUser(token);
      } catch (err: any) {
        console.error('Network logout tracking failed:', err);
      }
    }
    localStorage.removeItem('access_token');
    localStorage.removeItem('user_data');
    setUser(null);
    
    if (isFunder) {
       window.location.replace('/funder/login');
    } else {
       window.location.replace('/login');
    }
  };
  
  // The magic mock method to switch dashboards quickly
  const switchRoleMode = (newRole: Role) => {
    if (user) {
      setUser({ ...user, role: newRole });
    }
  };

  // Real JWT-based session update for role switching
  const updateSession = (token: string, userData: User) => {
    localStorage.setItem('access_token', token);
    localStorage.setItem('user_data', JSON.stringify(userData));
    setUser(userData);
    setOriginalRole(userData.role);
  };

  const updateUserLocally = (updates: Partial<User>) => {
    if (user) {
      const newUser = { ...user, ...updates };
      setUser(newUser);
      localStorage.setItem('user_data', JSON.stringify(newUser));
    }
  };

  return (
    <AuthContext.Provider value={{ user, role: user?.role || intendedRole, originalRole, login, logout, switchRoleMode, updateSession, intendedRole, setIntendedRole, rentAmount, setRentAmount, updateUserLocally }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
