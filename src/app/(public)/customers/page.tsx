'use client';
import TableCustomer from "@/components/Tables/CustomersTable";
import { useSession, signIn } from 'next-auth/react';


const TablesPage = () => {
  const { data: session, status } = useSession();
  if (!session) {
    signIn();
    return <p>Redirecting...</p>;
  }
  return (

      <div className="flex flex-col gap-10">
        <TableCustomer />
      </div>

  );
};

export default TablesPage;
