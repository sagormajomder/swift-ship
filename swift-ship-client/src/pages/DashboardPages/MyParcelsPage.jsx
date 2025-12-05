import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../../contexts/AuthContext';
import useAxiosSecure from '../../hooks/useAxiosSecure';

export default function MyParcelsPage() {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const {
    data: parcels = [],
    isPending,
    isError,
  } = useQuery({
    queryKey: ['myParcels', user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/parcels?email=${user.email}`);
      return res.data;
    },
  });
  return (
    <div className='overflow-x-auto rounded-box border border-base-content/5 bg-base-100'>
      <table className='table'>
        {/* head */}
        <thead>
          <tr>
            <th></th>
            <th>Type</th>
            <th>Parcel Name</th>
            <th>Parcel Weight</th>
            <th>Receiver Name</th>
            <th>Receiver Email</th>
            <th>Cost</th>
          </tr>
        </thead>
        <tbody>
          {/* row 1 */}
          {parcels.map((parcel, i) => (
            <tr key={parcel._id}>
              <th>{i + 1}</th>
              <td>{parcel.percelType}</td>
              <td>{parcel.parcelName}</td>
              <td>{parcel.parcelWeight}</td>
              <td>{parcel.reciverName}</td>
              <td>{parcel.receiverEmail}</td>
              <td>{parcel.cost}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
