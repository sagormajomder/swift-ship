import { useSearchParams } from 'react-router';

export default function PaymentSuccessPage() {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');
  console.log(sessionId);
  return (
    <div>
      <h2 className='text-4xl'>Payment Successful</h2>
    </div>
  );
}
