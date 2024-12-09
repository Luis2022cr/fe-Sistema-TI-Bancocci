import { Outlet, Navigate } from 'react-router-dom';
import useAuth from '../useAuth';

const EmpleadoAuth = () => {
  const { accessToken, userRole } = useAuth();

  if (!accessToken || userRole !== 2) {
    return <Navigate to="/login" />;
  }

  return <Outlet />;
};

export default EmpleadoAuth;
