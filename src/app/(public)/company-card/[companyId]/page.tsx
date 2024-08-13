'use client';

import CompanyDetailForm from '@/components/Cards/CompanyCard';

const CustomerCard = ({ params }: { params: { companyId: string } }) => {




    return (

        <div className="flex flex-col gap-10 p-4 w-full">
            <CompanyDetailForm companyId={params.companyId} />
        </div>

    );

};
export default CustomerCard;