import { Navigate, useLocation } from 'react-router';
import Loader from '../components/Loader';
import { useAuth } from '../contexts/AuthContext';

export default function PrivateRoute({ children }) {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) return <Loader />;

  if (!user)
    return <Navigate to='/auth/login' state={location.pathname} replace />;

  return children;
}
