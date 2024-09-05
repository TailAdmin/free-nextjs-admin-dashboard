'use client';

import GameDetailForm from '@/components/Cards/GameCard';

const CompanyCard = ({ params }: { params: { gameId: string } }) => {




    return (

        <div className="flex flex-col gap-10 p-4 w-full">
            <GameDetailForm gameId={params.gameId} />
        </div>

    );

};
export default CompanyCard;