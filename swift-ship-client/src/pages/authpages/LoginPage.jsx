import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import { Link } from 'react-router';
import GoogleLogin from './GoogleLogin';

export default function LoginPage() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();
  const [showPassword, setShowPassword] = useState(false);
  function handleLogin(data) {
    console.log(data);
  }

  const password = watch('password', '');

  return (
    <div className='card py-10 max-w-md mx-auto md:m-0'>
      <h2 className='heading-secondary '>Welcome Back</h2>
      <p className='ml-2 text-dark'>Login with SwiftShip</p>
      <form
        className='card-body px-0 pb-1'
        onSubmit={handleSubmit(handleLogin)}>
        <fieldset className='fieldset'>
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
          {/* Forget Password */}
          <div>
            <a className='link link-hover underline'>Forgot password?</a>
          </div>
          {/* Form Submit */}
          <button
            type='submit'
            className='btn btn-primary border-none text-dark mt-4'>
            Login
          </button>
        </fieldset>
      </form>
      <p>
        Don't have any account?{' '}
        <Link to='/auth/register' className='text-[#8FA748]'>
          Register
        </Link>
      </p>
      <div className='text-center my-4'>Or</div>
      {/* Google Login */}
      <GoogleLogin title='Login with Google' />
    </div>
  );
}
