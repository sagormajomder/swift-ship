import { useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import { Link, useNavigate } from 'react-router';
import { useAuth } from '../../contexts/AuthContext';

import imageUploadIcon from '../../assets/image-upload-icon.png';
import GoogleLogin from './GoogleLogin';

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const { registerUser, setIsLoading } = useAuth();

  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const password = watch('password', '');

  function handleRegister(data) {
    // console.log(data);
    const { displayName, email, password } = data;

    registerUser(email, password)
      .then(userCredential => {
        console.log(userCredential);

        navigate('/');
      })
      .catch(error => {
        const errorCode = error.code;
        const errorMessage = error.message;
        // console.log(errorCode);
        // console.log(errorMessage);
        if (errorCode === 'auth/email-already-in-use') {
          toast.error('User already exists in the database. Try another email');
        } else if (errorCode === 'auth/weak-password') {
          toast.error('Enter at least 6 digit password');
        } else if (errorCode === 'auth/invalid-email') {
          toast.error('Invalid email format. Please check your email address.');
        } else if (errorCode === 'auth/user-disabled') {
          toast.error('This user account has been disabled.');
        } else if (errorCode === 'auth/too-many-requests') {
          toast.error('Too many attempts. Please try again later.');
        } else if (errorCode === 'auth/network-request-failed') {
          toast.error('Network error. Please check your connection.');
        } else {
          toast.error(errorMessage || 'An unexpected error occurred.');
        }
      })
      .finally(() => setIsLoading(false));
  }

  return (
    <div className='card py-10 max-w-md mx-auto md:m-0'>
      <h2 className='heading-secondary '>Create an Account</h2>
      <p className='ml-2 text-dark'>Register with SwiftShip</p>

      <form
        className='card-body px-0 pb-1'
        onSubmit={handleSubmit(handleRegister)}>
        <fieldset className='fieldset'>
          {/* Phone Upload */}
          <div>
            <label htmlFor='image' className='label'>
              <img src={imageUploadIcon} alt='' />
              <input
                className=' file-input hidden'
                type='file'
                {...register('photoURL')}
                name=''
                id='image'
              />
            </label>
          </div>
          {/* Name */}
          <label htmlFor='name' className='label'>
            Name
          </label>
          <input
            type='text'
            {...register('displayName', { required: true })}
            className='input w-full'
            placeholder='Name'
            id='name'
          />
          {/* Email */}
          <label htmlFor='email' className='label'>
            Email
          </label>
          <input
            type='email'
            {...register('email', { required: true })}
            className='input w-full'
            placeholder='Email'
            id='email'
          />
          {errors.email?.type === 'required' && (
            <span className='text-red-400'>Email is required!</span>
          )}
          {/* Password */}
          <label htmlFor='pass' className='label'>
            Password
          </label>
          <div className='relative'>
            <input
              type={showPassword ? 'text' : 'password'}
              {...register('password', {
                required: true,
                minLength: 6,
                pattern:
                  /^(?=.*[a-z])(?=.*[A-Z]).(?=.*\d).(?=.*[^A-Za-z0-9]).+$/,
              })}
              className='input w-full '
              placeholder='Password'
              id='pass'
            />

            {password.length > 0 && (
              <button
                type='button'
                onClick={() => setShowPassword(!showPassword)}
                className='absolute top-1/2 right-3 z-10 -translate-y-1/2 cursor-pointer text-xl'>
                {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
              </button>
            )}
          </div>
          {!errors.password && (
            <p className='mt-1 text-gray-500 text-xs'>
              Password length must be at least 6 chararacter, must contain at
              least one uppercase, one lowercase letter, one digit and one
              special characters!
            </p>
          )}

          {errors.password?.type === 'required' && (
            <span className='text-red-400'>Password is required!</span>
          )}
          {errors.password?.type === 'minLength' && (
            <span className='text-red-400'>
              Password must be at least 6 characters!
            </span>
          )}
          {errors.password?.type === 'pattern' && (
            <span className='text-red-400'>
              Password must contain at least one uppercase, one lowercase
              letter, one digit and one special characters!
            </span>
          )}

          {/* Form Submit */}
          <button
            type='submit'
            className='btn btn-primary border-none text-dark mt-4'>
            Register
          </button>
        </fieldset>
      </form>
      <p>
        Already have an account?{' '}
        <Link to='/auth/login' className='text-[#8FA748]'>
          Login
        </Link>
      </p>
      <div className='text-center my-4'>Or</div>
      {/* Google Login */}
      <GoogleLogin title='Register with Google' />
    </div>
  );
}
