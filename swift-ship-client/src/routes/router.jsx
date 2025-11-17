import { createBrowserRouter } from 'react-router';
import AuthLayout from '../layouts/AuthLayout';
import RootLayout from '../layouts/RootLayout';
import LoginPage from '../pages/authpages/LoginPage';
import RegisterPage from '../pages/authpages/RegisterPage';
import PrivateRoute from './PrivateRoute';

const router = createBrowserRouter([
  {
    path: '/',
    Component: RootLayout,
  },
  {
    path: '/',
    Component: AuthLayout,
    children: [
      {
        path: '/auth/login',
        element: (
          <PrivateRoute>
            <LoginPage />
          </PrivateRoute>
        ),
      },
      {
        path: '/auth/register',
        element: (
          <PrivateRoute>
            <RegisterPage />
          </PrivateRoute>
        ),
      },
    ],
  },
]);

export default router;
