import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';

export type Role = 'TENANT' | 'AGENT' | 'LANDLORD' | 'FUNDER' | null;

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: Role;
}

interface AuthContextType {
  user: User | null;
  role: Role;
  login: (userData: User) => void;
  logout: () => void;
  switchRoleMode: (newRole: Role) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  // Start with a mock user as "TENANT" for easy testing
  const [user, setUser] = useState<User | null>({
    id: 'mock-uuid',
    email: 'tenant@welile.com',
    firstName: 'Paul',
    lastName: 'Ndlovu',
    role: 'TENANT'
  });

  const login = (userData: User) => setUser(userData);
  const logout = () => setUser(null);
  
  // The magic mock method to switch dashboards quickly
  const switchRoleMode = (newRole: Role) => {
    if (user) {
      setUser({ ...user, role: newRole });
    } else {
      setUser({
        id: 'mock-uuid',
        email: `mock@${newRole?.toLowerCase()}.com`,
        firstName: 'Test',
        lastName: 'User',
        role: newRole
      });
    }
  };

  return (
    <AuthContext.Provider value={{ user, role: user?.role || null, login, logout, switchRoleMode }}>
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
