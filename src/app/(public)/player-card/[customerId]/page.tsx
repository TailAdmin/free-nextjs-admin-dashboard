'use client';

import PlayersDetailForm from '@/components/Cards/PlayerCard';


const PlayerCard = ({ params }: { params: { userId: string } }) => {

    return (

        <div className="flex flex-col gap-10 p-4 w-full">
            <PlayersDetailForm userId={params.userId} />
        </div>

    );

};
export default PlayerCard;