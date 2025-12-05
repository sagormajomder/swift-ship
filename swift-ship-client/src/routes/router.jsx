import { createBrowserRouter } from 'react-router';
import AuthLayout from '../layouts/AuthLayout';
import RootLayout from '../layouts/RootLayout';
import LoginPage from '../pages/authpages/LoginPage';
import RegisterPage from '../pages/authpages/RegisterPage';
import { default as BeARiderPage } from '../pages/BeARiderPage';
import HomePage from './../pages/homepage/HomePage';
import SendParcelPage from './../pages/SendParcelPage';
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
]);

export default router;
