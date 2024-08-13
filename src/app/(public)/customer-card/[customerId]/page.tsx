'use client';

import CustomerDetailForm from '@/components/Cards/CustomerCard';


const CustomerCard = ({ params }: { params: { customerId: string } }) => {

    return (

        <div className="flex flex-col gap-10 p-4 w-full">
            <CustomerDetailForm customerId={params.customerId} />
        </div>

    );

};
export default CustomerCard;