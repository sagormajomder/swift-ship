import authImage from '../../assets/authImage.png';
export default function AuthImage() {
  return (
    <figure className='flex-1 hidden md:block'>
      <img className='ml-auto object-cover' src={authImage} alt='' />
    </figure>
  );
}
