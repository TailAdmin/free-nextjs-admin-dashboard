'use client';
import CompaniesTable from "@/components/Tables/CompaniesTable";
import { useSession, signIn } from 'next-auth/react';


const CompaniesTablePage = () => {
  const { data: session, status } = useSession();
  if (!session) {
    signIn();
    return <p>Redirecting...</p>;
  }
  return (

      <div className="flex flex-col gap-10">
        <CompaniesTable />
      </div>

  );
};

export default CompaniesTablePage;
