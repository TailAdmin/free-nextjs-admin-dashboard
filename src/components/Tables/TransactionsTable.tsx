'use client'

import { useEffect, useState } from "react";
import {useTransactions} from '@/hooks/useTransactions';
import Loader from "../common/Loader";
import BaseTable from "./BaseTable";

const TableTransaction = () => {


  const[currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(25);
  const [filterValue, setFilterValue] = useState('');
  const { transactions, isLoading, error, total, fetchTransactions} = useTransactions(currentPage, pageSize);

  useEffect(() =>{
    fetchTransactions()
  },[currentPage])

  const totalPages = Math.ceil(total / pageSize);
  console.log( `totalPages: ${total}` );

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };
  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilterValue(e.target.value);
  };

  const handleFilterSubmit = () => {
    fetchTransactions(JSON.parse(`{"selectedFields":"${filterValue}"}`));
  };

  const columns = [
    { key: 'company_id', label: 'Company ID' },
    { key: 'game_id', label: 'Game ID' },
    { key: 'user_id', label: 'User ID' },
    { key: 'player_id', label: 'Player ID' },
    { key: 'user_name', label: 'User Nsme' },
    { key: 'player_name', label: 'Player Name' },
    { key: 'item_id', label: 'Item ID' },
    { key: 'item_name', label: 'Item name' },
    { key: 'payment_id', label: 'Payment ID' },
    { key: 'status', label: 'Status' },
    { key: 'payment_method_id', label: 'Payment method ID' },
    { key: 'payment_method_name', label: 'Payment method name' },
    { key: 'amount', label: 'Amount' },
    { key: 'currency', label: 'Currency' },
    { key: 'country', label: 'Country' },
    { key: 'order_id', label: 'Order ID' },
    { key: 'status_order', label: 'Status order' },
  
];

  if (error) {
    return <div>Error loading customers {error}</div>; 
  }

  if (isLoading) {
    return <Loader /> ;
  }


  return (

    <div>
    <BaseTable
        data={transactions}
        columns={columns}
        currentPage={currentPage}
        totalPages={totalPages}
        isLoading={isLoading}
        error={error}
        filterValue={filterValue}
        onNextPage={handleNextPage}
        onPreviousPage={handlePreviousPage}
        onFilterChange={handleFilterChange}
        onFilterSubmit={handleFilterSubmit}


    />
</div>

//     <div className="rounded-sm border border-stroke bg-white px-5 pb-2.5 pt-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
//       <h4 className="mb-6 text-xl font-semibold text-black dark:text-white">
//         Transactions
//       </h4>

//       <div className="flex flex-col">
//       <div className="overflow-x-auto">
//       <div className="min-w-[1000px]">

//         <div className="grid grid-cols-6 rounded-sm bg-gray-2 dark:bg-meta-4 sm:grid-cols-6">

//           <div className="p-2.5 text-center xl:p-5">
//             <h5 className="text-sm font-medium uppercase xsm:text-base">
//               Company ID
//             </h5>
//           </div>
//           <div className="p-2.5 text-center xl:p-5">
//             <h5 className="text-sm font-medium uppercase xsm:text-base">
//               Game ID
//             </h5>
//           </div>

//           <div className="p-2.5 text-center xl:p-5">
//             <h5 className="text-sm font-medium uppercase xsm:text-base">
//               Payment ID
//             </h5>
//           </div>

//           <div className="p-2.5 text-center xl:p-5">
//             <h5 className="text-sm font-medium uppercase xsm:text-base">
//               Item Name
//             </h5>
//           </div>

//           <div className="p-2.5 text-center xl:p-5">
//             <h5 className="text-sm font-medium uppercase xsm:text-base">
//               Amount
//             </h5>
//           </div>

//           <div className="p-2.5 text-center xl:p-5">
//             <h5 className="text-sm font-medium uppercase xsm:text-base">
//               Currency
//             </h5>
//           </div>

//         </div>

//         {transactions.map((transaction, key) => (
//           <div
//             className={`grid grid-cols-6 sm:grid-cols-6 ${
//               key === transactions.length - 1
//                 ? ""
//                 : "border-b border-stroke dark:border-strokedark"
//             }`}
//             key={key}
//           >
//             <div className="flex items-center gap-3 p-2.5 xl:p-5">
 
//               <p className="hidden text-black dark:text-white sm:block">
//                 {transaction.company_id}
//               </p>
//             </div>

//             <div className="flex items-center justify-center p-2.5 xl:p-5">
//               <p className="text-black dark:text-white">{transaction.game_id}</p>
//             </div>

//             <div className="flex items-center justify-center p-2.5 xl:p-5 overflow-hidden text-ellipsis whitespace-nowrap w-1/2">
//               <p className="text-meta-3">{transaction.payment_id}</p>
//             </div>  

//             <div className="flex items-center justify-center p-2.5 xl:p-5 overflow-hidden text-ellipsis whitespace-nowrap">
//               <p className="text-meta-3">{transaction.item_name}</p>
//             </div>


//             <div className="flex items-center justify-center p-2.5 xl:p-5">
//               <p className="text-meta-3">{transaction.amount}</p>
//             </div>


//             <div className="flex items-center justify-center p-2.5 xl:p-5">
//               <p className="text-meta-3">{transaction.currency}</p>
//             </div>
//           </div>
//         ))}

      
// </div>
//     </div>


//     <div className="flex justify-between mt-4">
//         <button
//           onClick={handlePreviousPage}
//           disabled={currentPage === 1}
//           className="px-4 py-2 bg-gray-200 text-black rounded disabled:opacity-50"
//         >
//           Previous
//         </button>
//         <span className="self-center">
//           Page {currentPage} of {totalPages}
//         </span>
//         <button
//           onClick={handleNextPage}
//           disabled={currentPage === totalPages}
//           className="px-4 py-2 bg-gray-200 text-black rounded disabled:opacity-50"
//         >
//           Next
//         </button>
//       </div> 



//       </div>
//     </div>
  );
};

export default TableTransaction;
