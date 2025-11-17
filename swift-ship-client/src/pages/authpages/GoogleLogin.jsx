import { FcGoogle } from 'react-icons/fc';

export default function GoogleLogin({ title }) {
  return (
    <button className='btn  text-black bg-[#E9ECF1]'>
      <FcGoogle />
      {title}
    </button>
  );
}
