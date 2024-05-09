import { useState, useEffect } from "react";
import axios from "axios";
import dynamic from 'next/dynamic';

interface Location {
  jobid: number;
  applied: string;
}

const TableOne = () => {
  const url = "http://localhost:8000/joblisting";
  const [application, setApplication] = useState<Location[]>([]);
  const [editingRow, setEditingRow] = useState<number | null>(null);
  const [editedStatus, setEditedStatus] = useState("");
  const [appliedJobsCount, setAppliedJobsCount] = useState<number>(0);

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

    axios
      .get("http://localhost:8000/applied-jobs-count")
      .then((res) => {
        setAppliedJobsCount(res.data.count);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <div className="rounded-sm border border-stroke bg-white px-5 pb-2.5 pt-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
      <div className="max-w-full overflow-x-auto">
        <h4 className="text-xl font-semibold text-black dark:text-white mb-6">
          Application's Summary List
        </h4>
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-gray-2 text-left dark:bg-meta-4">
              <th className="min-w-[220px] px-4 py-4 font-medium text-black dark:text-white xl:pl-11">
                Number of Applied Jobs
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border-b border-[#eee] px-4 py-5 pl-9 dark:border-strokedark xl:pl-11">
                <h5 className="font-medium text-black dark:text-white">
                  {appliedJobsCount}
                </h5>
              </td>
            </tr>
          </tbody>
        </table>
        {/* Rest of your table structure and logic */}
      </div>
    </div>
  );
};

export default dynamic(() => Promise.resolve(TableOne), {
  ssr: false,
});