import { useQuery } from '@tanstack/react-query';
import { FaRegTrashAlt } from 'react-icons/fa';
import { FiEdit } from 'react-icons/fi';
import { HiMagnifyingGlass } from 'react-icons/hi2';
import { Link } from 'react-router';
import Swal from 'sweetalert2';
import { useAuth } from '../../contexts/AuthContext';
import useAxiosSecure from '../../hooks/useAxiosSecure';

export default function MyParcelsPage() {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const {
    data: parcels = [],
    isPending,
    isError,
    refetch,
  } = useQuery({
    queryKey: ['myParcels', user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/parcels?email=${user.email}`);
      return res.data;
    },
  });

  function handleParcelDelete(id) {
    console.log(id);

    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then(result => {
      if (result.isConfirmed) {
        axiosSecure.delete(`/parcels/${id}`).then(res => {
          console.log(res.data);

          if (res.data.deletedCount) {
            // refresh the data in the ui
            refetch();

            Swal.fire({
              title: 'Deleted!',
              text: 'Your parcel request has been deleted.',
              icon: 'success',
            });
          }
        });
      }
    });
  }

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
            <th>Payment </th>
            <th>Tracking ID</th>
            <th>Delivery Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {/* row 1 */}
          {parcels.map((parcel, i) => (
            <tr key={parcel._id}>
              <th>{i + 1}</th>
              <td>{parcel.parcelType}</td>
              <td>{parcel.parcelName}</td>
              <td>{parcel.parcelWeight}</td>
              <td>{parcel.receiverName}</td>
              <td>{parcel.receiverEmail}</td>
              <td>{parcel.cost}</td>
              <td>
                {parcel.paymentStatus === 'paid' ? (
                  <span className='text-green-400'>Paid</span>
                ) : (
                  <Link to={`/dashboard/payment/${parcel._id}`}>
                    <button className='btn btn-primary text-black btn-sm'>
                      Pay
                    </button>
                  </Link>
                )}
              </td>
              <td>{parcel.trackingId}</td>
              <td>{parcel.deliveryStatus}</td>
              <td className='space-x-1'>
                <button className='btn btn-square hover:bg-primary'>
                  <HiMagnifyingGlass />
                </button>
                <button className='btn btn-square hover:bg-primary'>
                  <FiEdit />
                </button>
                <button
                  onClick={() => handleParcelDelete(parcel._id)}
                  className='btn btn-square hover:bg-primary'>
                  <FaRegTrashAlt />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
