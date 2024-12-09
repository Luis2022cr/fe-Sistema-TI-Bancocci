import { Outlet, Navigate } from 'react-router-dom';
import useAuth from '../useAuth';

const AdminAuth = () => {
  const { accessToken, userRole } = useAuth();

  if (!accessToken || userRole !== 1) {
    return <Navigate to="/login" />;
  }

  return <Outlet />;
};

export default AdminAuth;
