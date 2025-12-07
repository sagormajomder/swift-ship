import axios from 'axios';
import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../contexts/AuthContext';

const AxiosInstance = axios.create({
  baseURL: 'http://localhost:3000',
});

export default function useAxiosSecure() {
  const { user, signOutUser } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    // intercept request
    const reqInterceptor = AxiosInstance.interceptors.request.use(config => {
      config.headers.Authorization = `Bearer ${user?.accessToken}`;
      return config;
    });

    // interceptor response
    const resInterceptor = AxiosInstance.interceptors.response.use(
      response => {
        return response;
      },
      error => {
        console.log(error);

        const statusCode = error.status;
        if (statusCode === 401 || statusCode === 403) {
          signOutUser().then(() => {
            navigate('/auth/login');
          });
        }

        return Promise.reject(error);
      }
    );

    return () => {
      AxiosInstance.interceptors.request.eject(reqInterceptor);
      AxiosInstance.interceptors.response.eject(resInterceptor);
    };
  }, [user, signOutUser, navigate]);
  return AxiosInstance;
}
