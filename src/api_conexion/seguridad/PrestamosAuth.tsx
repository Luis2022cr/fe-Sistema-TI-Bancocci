import { Outlet, Navigate } from 'react-router-dom';
import useAuth from '../useAuth';

const PrestamosAuth = () => {
  const { accessToken, userRole } = useAuth();

  if (!accessToken || userRole !== 4) {
    return <Navigate to="/login" />;
  }

  return <Outlet />;
};

export default PrestamosAuth;
