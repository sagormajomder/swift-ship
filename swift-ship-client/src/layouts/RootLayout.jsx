import { Outlet } from 'react-router';
import Footer from '../components/Footer';
import Main from '../components/Main';
import MyBody from '../components/MyBody';
import Navbar from '../components/Navbar';

export default function RootLayout() {
  return (
    <MyBody style='py-6'>
      <Navbar />
      <Main>
        <Outlet />
      </Main>
      <Footer />
    </MyBody>
  );
}
