import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';

export type Role = 'TENANT' | 'AGENT' | 'LANDLORD' | 'FUNDER' | null;

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
  intendedRole: Role;
  setIntendedRole: (role: Role) => void;
  rentAmount: string;
  setRentAmount: (amount: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  // Start with a mock verified user to bypass auth walls during frontend dev
  const [user, setUser] = useState<User | null>({
    id: 'usr_front_123',
    email: 'frontend@welile.com',
    firstName: 'Frontend',
    lastName: 'Developer',
    role: 'FUNDER',
    isVerified: true,
  });
  const [intendedRole, setIntendedRole] = useState<Role>('TENANT');
  const [rentAmount, setRentAmount] = useState<string>('');

  const login = (userData: User) => setUser(userData);
  const logout = () => setUser(null);
  
  // The magic mock method to switch dashboards quickly
  const switchRoleMode = (newRole: Role) => {
    if (user) {
      setUser({ ...user, role: newRole });
    }
  };

  return (
    <AuthContext.Provider value={{ user, role: user?.role || intendedRole, login, logout, switchRoleMode, intendedRole, setIntendedRole, rentAmount, setRentAmount }}>
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
