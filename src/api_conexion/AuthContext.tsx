// api/AuthContext.tsx
import { createContext, useState, ReactNode, useEffect } from 'react';


export interface AuthContextType {
  accessToken: string | null;
  userRole: number | null;
  usuario: string | null;
  login: (token: string, role: number, usuario: string) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [accessToken, setAccessToken] = useState<string | null>(sessionStorage.getItem('accessToken'));
  const [userRole, setUserRole] = useState<number | null>(() => {
    const role = sessionStorage.getItem('userRole');
    return role ? Number(role) : null;
  });
  const [usuario, setUsuario] = useState<string | null>(sessionStorage.getItem('usuario'));
  

  // Persistir los valores en sessionStorage cada vez que cambian
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
    if (usuario) {
      sessionStorage.setItem('usuario', usuario);
    } else {
      sessionStorage.removeItem('usuario');
    }
  }, [usuario]);

  const login = (token: string, role: number, usuario: string) => {
    // Guardar los valores en el estado y en sessionStorage
    setAccessToken(token);
    setUserRole(role);
    setUsuario(usuario);


    sessionStorage.setItem('accessToken', token);
    sessionStorage.setItem('userRole', role.toString());
    sessionStorage.setItem('usuario', usuario);
  };

  const logout = () => {
    // Borrar el estado y el almacenamiento
    setAccessToken(null);
    setUserRole(null);
    setUsuario(null);

    sessionStorage.removeItem('accessToken');
    sessionStorage.removeItem('userRole');
    sessionStorage.removeItem('usuario');
  };

  return (
    <AuthContext.Provider value={{ accessToken, userRole, usuario, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
