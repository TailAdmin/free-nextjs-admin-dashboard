'use client';

import CompanyDetailForm from '@/components/Cards/CompanyCard';
import { signIn, useSession } from 'next-auth/react';


const CustomerCard = ({ params }: { params: { companyId: string } }) => {
    const { data: session, status } = useSession();
    if (!session) {
    signIn();
    return <></>;
    }



    return (

        <div className="flex flex-col gap-10 p-4 w-full">
            <CompanyDetailForm companyId={params.companyId} />
        </div>

    );

};
export default CustomerCard;