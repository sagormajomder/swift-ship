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

  if (isPending) return <Loader />;

  return (
    <div>
      <button className='btn btn-primary text-black '>Pay</button>
    </div>
  );
}
