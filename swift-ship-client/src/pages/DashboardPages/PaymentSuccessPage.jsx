import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router';
import useAxiosSecure from '../../hooks/useAxiosSecure';

export default function PaymentSuccessPage() {
  const [searchParams] = useSearchParams();
  const [paymentInfo, setPaymentInfo] = useState({});
  const axiosSecure = useAxiosSecure();
  const sessionId = searchParams.get('session_id');
  // console.log(sessionId);

  useEffect(
    function () {
      axiosSecure
        .patch(`/payment-success?session_id=${sessionId}`)
        .then(res => {
          console.log(res.data);
          setPaymentInfo({
            transactionId: res.data.transactionId,
            trackingId: res.data.trackingId,
          });
        });
    },
    [sessionId, axiosSecure]
  );

  return (
    <div>
      <h2 className='text-4xl'>Payment Successful</h2>
      <p>Your TransactionId: {paymentInfo.transactionId}</p>
      <p>Your Parcel Tracking id: {paymentInfo.trackingId}</p>
    </div>
  );
}
