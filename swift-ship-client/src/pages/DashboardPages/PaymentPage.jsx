import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router';
import Loader from '../../components/Loader';
import useAxiosSecure from '../../hooks/useAxiosSecure';

export default function PaymentPage() {
  const { parcelId } = useParams();

  const axiosSecure = useAxiosSecure();

  const { isPending, data: parcel = {} } = useQuery({
    queryKey: ['parcel', parcelId],
    queryFn: async () => {
      const res = await axiosSecure.get(`/parcel/${parcelId}`);
      return res.data;
    },
  });

  // console.log(parcel)

  const { senderEmail, _id, parcelName, cost } = parcel;

  if (isPending) return <Loader />;

  function handlePayment() {
    const paymentInfo = {
      parcelId: _id,
      cost,
      parcelName,
      senderEmail,
    };

    axiosSecure.post(`/create-checkout-session`, paymentInfo).then(result => {
      const { url } = result.data;
      window.location.href = url;
    });
  }

  return (
    <div>
      <p>
        Please pay ${cost} for: {parcelName}
      </p>
      <button onClick={handlePayment} className='btn btn-primary text-black '>
        Pay
      </button>
    </div>
  );
}
