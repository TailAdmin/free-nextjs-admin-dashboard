import { useState, useEffect } from "react";
import axios from "axios";
import dynamic from 'next/dynamic';

interface Location {
  applicationID:number;
  userid: number;
  jobid: number;

}

const TableOne = () => {
  const url = "http://localhost:8000/application/summary";
  const [application, setApplication] = useState<Location[]>([]);
  
   

  useEffect(() => {
    axios
    .get(url)
    .then((res) => {
    setApplication(res.data);
    console.log(res);
    })
    .catch((err) => {
    console.log(err);
    });
    }, []);
    
  
    
    return (
      <div className="rounded-sm border border-stroke bg-white px-5 pb-2.5 pt-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
        <div className="max-w-full overflow-x-auto">
        <div className="flex justify-between items-center mb-6">
  <h4 className="text-xl font-semibold text-black dark:text-white">
    Detailed Summury 
  </h4>
 
</div>
          <table className="w-full table-auto">
            <thead>
              <tr className="bg-gray-2 text-left dark:bg-meta-4">
               
                <th className="min-w-[150px] px-4 py-4 font-medium text-black dark:text-white">
                  User ID
                </th>
                <th className="min-w-[120px] px-4 py-4 font-medium text-black dark:text-white">
                  Job IDs
                </th>
                
              </tr>
            </thead>
            <tbody>
              {application.map((item, key) => (
                <tr key={key}>
                  
                <td className="border-b border-[#eee] px-4 py-5 pl-9 dark:border-strokedark xl:pl-11">
                  <h5 className="font-medium text-black dark:text-white">
                    {item.userid}
                  </h5>
                  
                </td>
                <td className="border-b border-[#eee] px-4 py-5 pl-9 dark:border-strokedark xl:pl-11">
                <h5 className="font-medium text-black dark:text-white">
        {Array.isArray(item.jobid) ? item.jobid.join(', ') : item.jobid || 'No Job IDs'}
      </h5>
                  
                </td>
                
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
  );
};

export default dynamic(() => Promise.resolve(TableOne), {
  ssr: false,
});
