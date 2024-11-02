import { createContext, useState, ReactNode, useEffect } from 'react';

export interface Usuario {
  nombre: string;
  correo: string;
  rol: string; // Cambia esto si es necesario
}

export interface AuthContextType {
  accessToken: string | null;
  userRole: number | null;
  usuario: Usuario | null;
  login: (token: string, role: number, usuario: Usuario) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [accessToken, setAccessToken] = useState<string | null>(sessionStorage.getItem('accessToken'));
  const [userRole, setUserRole] = useState<number | null>(() => {
    const role = sessionStorage.getItem('userRole');
    return role ? Number(role) : null;
  });
  const [usuario, setUsuario] = useState<Usuario | null>(null);

  useEffect(() => {
    const usuarioString = sessionStorage.getItem('usuario');
    if (usuarioString) {
      try {
        setUsuario(JSON.parse(usuarioString)); // Intenta parsear solo si es un JSON válido
      } catch (error) {
        console.error("Error al parsear usuario:", error);
        setUsuario(null); // Restablece el usuario si el parseo falla
      }
    }
  }, []);

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
      sessionStorage.setItem('usuario', JSON.stringify(usuario)); // Guarda como JSON
    } else {
      sessionStorage.removeItem('usuario');
    }
  }, [usuario]);

  const login = (token: string, role: number, usuarioData: Usuario) => {
    setAccessToken(token);
    setUserRole(role);
    setUsuario(usuarioData); // Cambia a objeto

    sessionStorage.setItem('accessToken', token);
    sessionStorage.setItem('userRole', role.toString());
    sessionStorage.setItem('usuario', JSON.stringify(usuarioData)); // Guarda como JSON
  };

  const logout = () => {
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
