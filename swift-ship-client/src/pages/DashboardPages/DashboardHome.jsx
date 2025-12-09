import Loader from '../../components/Loader';
import useRole from './../../hooks/useRole';
import AdminDashboardHome from './AdminDashboardHome';
import RiderDashboardHome from './RiderDashboardHome';
import UserDashboardHome from './UserDashboardHome';

export default function DashboardHome() {
  const { role, roleLoading } = useRole();

  if (roleLoading) return <Loader />;

  if (role === 'admin') return <AdminDashboardHome />;

  if (role === 'rider') return <RiderDashboardHome />;

  if (role === 'user') return <UserDashboardHome />;

  return <div>DashboardHome</div>;
}
