import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../../contexts/AuthContext';
import useAxiosSecure from '../../hooks/useAxiosSecure';

export default function PaymentHistoryPage() {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const { data: payments = [] } = useQuery({
    queryKey: ['payments', user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/payments?email=${user.email}`);

      return res.data;
    },
  });

  console.log(payments);

  return (
    <div className='overflow-x-auto rounded-box border border-base-content/5 bg-base-100'>
      <table className='table'>
        {/* head */}
        <thead>
          <tr>
            <th></th>
            <th>Parcel Name</th>
            <th>Amount</th>
            <th>Transaction ID</th>
            <th>Tracking ID</th>
          </tr>
        </thead>
        <tbody>
          {/* row 1 */}
          {payments.map((payment, i) => (
            <tr key={payment._id}>
              <th>{i + 1}</th>
              <td>{payment.parcelName}</td>
              <td>
                {payment.amount} {payment.currency}
              </td>
              <td>{payment.transactionId}</td>
              <td>{payment.trackingId}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
