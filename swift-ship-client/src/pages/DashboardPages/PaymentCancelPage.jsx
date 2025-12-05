import React from 'react';
import { Link } from 'react-router';

export default function PaymentCancelPage() {
  return (
    <div>
      <h2>Payment is cancelled. Please Try again</h2>
      <Link className='btn btn-primary text-black' to='/dashboard/my-parcels'>
        Try Again
      </Link>
    </div>
  );
}
