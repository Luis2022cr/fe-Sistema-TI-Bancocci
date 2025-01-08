import { Outlet, Navigate } from 'react-router-dom';
import useAuth from '../useAuth';

const TiAuth = () => {
  const { accessToken, userRole } = useAuth();

  // Permitir acceso si el usuario tiene rol 1 (admin) o rol 2 (empleado)
  if (!accessToken || (userRole !== 1 && userRole !== 2)) {
    return <Navigate to="/login" />;
  }

  return <Outlet />;
};

export default TiAuth;
