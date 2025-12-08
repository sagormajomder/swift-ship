import Loader from '../components/Loader';
import { useAuth } from '../contexts/AuthContext';
import useRole from '../hooks/useRole';
import ForbiddenPage from './../pages/ForbiddenPage';

export default function RiderRoute({ children }) {
  const { loading, user } = useAuth();
  const { role, roleLoading } = useRole();

  if (!user || loading || roleLoading) {
    return <Loader />;
  }

  if (role !== 'rider') {
    return <ForbiddenPage />;
  }

  return children;
}
