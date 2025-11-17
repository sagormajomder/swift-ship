import toast from 'react-hot-toast';
import { FcGoogle } from 'react-icons/fc';
import { useLocation, useNavigate } from 'react-router';
import { useAuth } from '../../contexts/AuthContext';

export default function GoogleLogin({ title }) {
  const { googleSignIn, setIsLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  function handleGoogleLogin() {
    googleSignIn()
      .then(result => {
        // console.log(result);
        navigate(location.state ?? '/');
        toast.success('User login with Google is successfull!');
      })
      .catch(error => {
        const errorCode = error.code;
        const errorMessage = error.message;
        // console.log(errorCode);
        // console.log(errorMessage);
        if (errorCode === 'auth/email-already-in-use') {
          toast.error('User already exists in the database. Try another email');
        } else if (
          errorCode === 'auth/account-exists-with-different-credential'
        ) {
          toast.error('Same email used with diffent social login');
        } else if (errorCode === 'auth/user-disabled') {
          toast.error('This user account has been disabled.');
        } else if (errorCode === 'auth/too-many-requests') {
          toast.error('Too many attempts. Please try again later.');
        } else if (errorCode === 'auth/operation-not-allowed') {
          toast.error('Operation not allowed. Please contact support.');
        } else if (errorCode === 'auth/network-request-failed') {
          toast.error('Network error. Please check your connection.');
        } else if (errorCode === 'auth/popup-closed-by-user') {
          toast.error('User closed the gooogle login popup.');
        } else {
          toast.error(errorMessage || 'An unexpected error occurred.');
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  }
  return (
    <button
      onClick={handleGoogleLogin}
      className='btn  text-black bg-[#E9ECF1]'>
      <FcGoogle />
      {title}
    </button>
  );
}
