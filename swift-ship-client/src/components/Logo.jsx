import { Link } from 'react-router';
import logoShape from '../assets/logo.png';

export default function Logo() {
  return (
    <Link
      to='/'
      className=' text-xl font-bold text-[#303030] flex items-center relative'>
      <img className='w-6 absolute -top-2 -left-3.5' src={logoShape} alt='' />
      SwiftShip
    </Link>
  );
}
