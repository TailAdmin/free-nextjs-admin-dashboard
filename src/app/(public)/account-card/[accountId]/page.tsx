'use client';

import AccountDetailForm from '@/components/Cards/AccountCard';

const AccountCard = ({ params }: { params: { accountId: string } }) => {




    return (

        <div className="flex flex-col gap-10 p-4 w-full">
            <AccountDetailForm accountId={params.accountId} />
        </div>

    );

};
export default AccountCard;