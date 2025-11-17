import { Link, NavLink } from 'react-router';
import goImage from '../assets/go.png';
import Logo from './Logo';
import MyContainer from './MyContainer';

export default function Navbar() {
  const links = (
    <>
      <li>
        <NavLink>Services</NavLink>
      </li>
      <li>
        <NavLink>Coverage</NavLink>
      </li>
      <li>
        <NavLink>About Us</NavLink>
      </li>
      <li>
        <NavLink>Pricing</NavLink>
      </li>
      <li>
        <NavLink>Blog</NavLink>
      </li>
      <li>
        <NavLink>Contact</NavLink>
      </li>
    </>
  );
  return (
    <header className=''>
      <MyContainer>
        <nav className='navbar bg-base-100 rounded-lg px-6'>
          {/* START */}
          <div className='navbar-start'>
            <div className='dropdown'>
              <div
                tabIndex={0}
                role='button'
                className='btn btn-ghost lg:hidden'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  className='h-5 w-5'
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke='currentColor'>
                  {' '}
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth='2'
                    d='M4 6h16M4 12h8m-8 6h16'
                  />{' '}
                </svg>
              </div>
              <ul
                tabIndex='-1'
                className='menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow text-body'>
                {links}
              </ul>
            </div>
            <Logo />
          </div>
          {/* CENTER */}
          <div className='navbar-center hidden lg:flex'>
            <ul className='menu menu-horizontal px-1 text-body'>{links}</ul>
          </div>
          {/* END */}
          <div className='navbar-end gap-2'>
            <Link
              to='/auth/login'
              className='btn btn-outline font-semibold text-body border-gray-300'>
              Sign In
            </Link>
            <div className='flex items-center'>
              <Link
                to='/auth/register'
                className='btn btn-primary font-bold text-dark border-none'>
                Sign Up
              </Link>
              <img className='h-10' src={goImage} alt='' />
            </div>
          </div>
        </nav>
      </MyContainer>
    </header>
  );
}
