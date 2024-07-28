'use client';

import CustomerDetailForm from '@/components/Cards/CustomerCard';
import { signIn, useSession } from 'next-auth/react';


const CustomerCard = ({ params }: { params: { customerId: string } }) => {
    const { data: session, status } = useSession();
    if (!session) {
      signIn();
      return <p>Redirecting...</p>;
    }



    return (

        <div className="flex flex-col gap-10 p-4">
            <CustomerDetailForm customerId={params.customerId} />
        </div>

    );

};
export default CustomerCard;