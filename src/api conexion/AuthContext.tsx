// api/AuthContext.tsx
import { createContext, useState, ReactNode, useEffect } from 'react';

export interface AuthContextType {
  accessToken: string | null;
  userRole: number | null;
  email: string | null;
  login: (token: string, role: number, email: string) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [accessToken, setAccessToken] = useState<string | null>(sessionStorage.getItem('accessToken'));
  const [userRole, setUserRole] = useState<number | null>(() => {
    const role = sessionStorage.getItem('userRole');
    return role ? Number(role) : null;
  });
  const [email, setEmail] = useState<string | null>(sessionStorage.getItem('email'));

  useEffect(() => {
    if (accessToken) {
      sessionStorage.setItem('accessToken', accessToken);
    } else {
      sessionStorage.removeItem('accessToken');
    }
  }, [accessToken]);

  useEffect(() => {
    if (userRole !== null) {
      sessionStorage.setItem('userRole', userRole.toString());
    } else {
      sessionStorage.removeItem('userRole');
    }
  }, [userRole]);

  useEffect(() => {
    if (email) {
      sessionStorage.setItem('email', email);
    } else {
      sessionStorage.removeItem('email');
    }
  }, [email]);

  const login = (token: string, role: number, email: string) => {
    setAccessToken(token);
    setUserRole(role);
    setEmail(email);
  };

  const logout = () => {
    setAccessToken(null);
    setUserRole(null);
    setEmail(null);
  };

  return (
    <AuthContext.Provider value={{ accessToken, userRole, email, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
