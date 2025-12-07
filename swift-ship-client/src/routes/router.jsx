import { createBrowserRouter } from 'react-router';
import AuthLayout from '../layouts/AuthLayout';
import RootLayout from '../layouts/RootLayout';
import LoginPage from '../pages/authpages/LoginPage';
import RegisterPage from '../pages/authpages/RegisterPage';
import { default as BeARiderPage } from '../pages/BeARiderPage';
import ApproveRidersPage from '../pages/DashboardPages/ApproveRidersPage';
import PaymentCancelPage from '../pages/DashboardPages/PaymentCancelPage';
import PaymentHistoryPage from '../pages/DashboardPages/PaymentHistoryPage';
import PaymentPage from '../pages/DashboardPages/PaymentPage';
import PaymentSuccessPage from '../pages/DashboardPages/PaymentSuccessPage';
import DashboardLayout from './../layouts/DashboardLayout';
import MyParcelsPage from './../pages/DashboardPages/MyParcelsPage';
import UsersManagementPage from './../pages/DashboardPages/UsersManagementPage';
import HomePage from './../pages/homepage/HomePage';
import SendParcelPage from './../pages/SendParcelPage';
import AdminRoute from './AdminRoute';
import PrivateRoute from './PrivateRoute';

const router = createBrowserRouter([
  {
    path: '/',
    Component: RootLayout,
    children: [
      {
        index: true,
        Component: HomePage,
      },
      {
        path: 'be-a-rider',
        element: (
          <PrivateRoute>
            <BeARiderPage />
          </PrivateRoute>
        ),
        loader: async () => fetch('../warehouses.json'),
      },
      {
        path: 'send-parcel',
        element: (
          <PrivateRoute>
            <SendParcelPage />
          </PrivateRoute>
        ),

        loader: async () => fetch('../warehouses.json'),
      },
    ],
  },
  {
    path: '/',
    Component: AuthLayout,
    children: [
      {
        path: '/auth/login',
        element: <LoginPage />,
      },
      {
        path: '/auth/register',
        element: <RegisterPage />,
      },
    ],
  },
  {
    path: 'dashboard',
    element: (
      <PrivateRoute>
        <DashboardLayout />
      </PrivateRoute>
    ),
    children: [
      {
        path: 'my-parcels',
        Component: MyParcelsPage,
      },
      {
        path: 'payment/:parcelId',
        Component: PaymentPage,
      },
      {
        path: 'payment-success',
        Component: PaymentSuccessPage,
      },
      {
        path: 'payment-cancelled',
        Component: PaymentCancelPage,
      },
      {
        path: 'payment-history',
        Component: PaymentHistoryPage,
      },
      {
        path: 'approve-riders',
        element: (
          <AdminRoute>
            <ApproveRidersPage />
          </AdminRoute>
        ),
      },
      {
        path: 'users-management',
        element: (
          <AdminRoute>
            <UsersManagementPage />
          </AdminRoute>
        ),
      },
    ],
  },
]);

export default router;
