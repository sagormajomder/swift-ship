import { Outlet } from 'react-router';
import Main from '../components/Main';
import MyBody from '../components/MyBody';
import MyContainer from '../components/MyContainer';
import AuthContent from '../pages/authpages/AuthContent';
import AuthHeader from '../pages/AuthPages/AuthHeader';
import AuthImage from '../pages/authpages/AuthImage';

export default function AuthLayout() {
  return (
    <MyBody style='py-6 bg-white'>
      <MyContainer style='h-[94dvh] w-full'>
        <AuthHeader />
        <Main style='flex justify-between items-center h-full '>
          <AuthContent>
            <Outlet />
          </AuthContent>
          <AuthImage />
        </Main>
      </MyContainer>
    </MyBody>
  );
}
