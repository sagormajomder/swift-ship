import { Outlet } from 'react-router';
import Main from '../components/Main';
import MyBody from '../components/MyBody';
import MyContainer from '../components/MyContainer';
import AuthContent from '../pages/authpages/AuthContent';
import AuthHeader from '../pages/AuthPages/AuthHeader';
import AuthImage from '../pages/authpages/AuthImage';

export default function AuthLayout() {
  return (
    <MyBody style='py-6'>
      <MyContainer>
        <AuthHeader />
        <Main style='flex justify-between items-center'>
          <AuthContent>
            <Outlet />
          </AuthContent>
          <AuthImage />
        </Main>
      </MyContainer>
    </MyBody>
  );
}
