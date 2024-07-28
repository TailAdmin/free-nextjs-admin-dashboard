'use client';

import TableTransaction from "@/components/Tables/TableTransactions";
import { signIn, useSession } from "next-auth/react";



const TablesPage = () => {

  const { data: session, status } = useSession();
  if (!session) {
    signIn();
    return <p>Redirecting...</p>;
  }
  return (


      <div className="flex flex-col gap-10">
        <TableTransaction />
      </div>

  );
};

export default TablesPage;
