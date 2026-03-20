import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import { logoutUser } from '../services/authApi';

export type Role = 'TENANT' | 'AGENT' | 'LANDLORD' | 'FUNDER' | 'SUPER_ADMIN' | 'CEO' | 'CFO' | 'COO' | 'CTO' | 'CMO' | 'CRM' | null;

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: Role;
  phone?: string;
  isVerified?: boolean;
}

interface AuthContextType {
  user: User | null;
  role: Role;
  login: (userData: User) => void;
  logout: () => void;
  switchRoleMode: (newRole: Role) => void;
  updateSession: (token: string, userData: User) => void;
  intendedRole: Role;
  setIntendedRole: (role: Role) => void;
  rentAmount: string;
  setRentAmount: (amount: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  // Initialize user from local storage if available, otherwise null
  const [user, setUser] = useState<User | null>(() => {
    const token = localStorage.getItem('access_token');
    if (token) {
      // Decode JWT token logic here if needed, but for now we rely on a temporary object
      // since the true user context should be fetched from /me endpoint in production.
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
  const [intendedRole, setIntendedRole] = useState<Role>('TENANT');
  const [rentAmount, setRentAmount] = useState<string>('');

  const login = (userData: User) => setUser(userData);
  
  const logout = async () => {
    const token = localStorage.getItem('access_token');
    if (token) {
      try {
        await logoutUser(token);
      } catch (err: any) {
        console.error('Network logout tracking failed:', err);
      }
    }
    localStorage.removeItem('access_token');
    setUser(null);
    window.location.replace('/login');
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
    setUser(userData);
  };

  return (
    <AuthContext.Provider value={{ user, role: user?.role || intendedRole, login, logout, switchRoleMode, updateSession, intendedRole, setIntendedRole, rentAmount, setRentAmount }}>
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
