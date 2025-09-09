import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import Badge from "../ui/badge/Badge";
import Image from "next/image";
import { UserIcon, CalenderIcon, TimeIcon } from "@/icons";

// Simple home icon component
const HomeIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <polyline points="9 22 9 12 15 12 15 22" />
  </svg>
);

// Define the TypeScript interface for the job requests
interface JobRequest {
  id: number;
  jobTitle: string;
  customer: string;
  location: string;
  date: string;
  time: string;
  status: "Completed" | "In Progress" | "Scheduled" | "Cancelled";
  paymentStatus: "Paid" | "Pending" | "Refunded";
  maidAssigned: string;
}

// Define the table data using the interface
const jobRequests: JobRequest[] = [
  {
    id: 1,
    jobTitle: "Deep Cleaning - 3 Bedroom Apartment",
    customer: "Sarah Johnson",
    location: "123 Main St, Apt 4B",
    date: "2023-06-15",
    time: "10:00 AM",
    status: "Completed",
    paymentStatus: "Paid",
    maidAssigned: "Maria Garcia"
  },
  {
    id: 2,
    jobTitle: "Regular Cleaning - Office Space",
    customer: "TechStart Inc.",
    location: "456 Business Ave",
    date: "2023-06-16",
    time: "2:00 PM",
    status: "In Progress",
    paymentStatus: "Pending",
    maidAssigned: "James Wilson"
  },
  {
    id: 3,
    jobTitle: "Move-Out Cleaning - 2 Bedroom",
    customer: "Michael Brown",
    location: "789 Oak Lane",
    date: "2023-06-17",
    time: "9:00 AM",
    status: "Scheduled",
    paymentStatus: "Pending",
    maidAssigned: "Emily Chen"
  },
  {
    id: 4,
    jobTitle: "Post-Construction Cleaning",
    customer: "Dream Homes LLC",
    location: "321 Renovation Rd",
    date: "2023-06-18",
    time: "11:00 AM",
    status: "Scheduled",
    paymentStatus: "Paid",
    maidAssigned: "Robert Taylor"
  },
  {
    id: 5,
    jobTitle: "Weekly Cleaning - Studio",
    customer: "Alex Turner",
    location: "159 Studio St, Unit 7",
    date: "2023-06-14",
    time: "1:00 PM",
    status: "Cancelled",
    paymentStatus: "Refunded",
    maidAssigned: "Jessica Lee"
  },
];

export default function RecentOrders() {
  // Format date to be more readable
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">
      <div className="flex flex-col gap-2 mb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Recent Job Requests
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Latest job requests and their status
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-theme-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200">
            <svg
              className="stroke-current fill-white dark:fill-gray-800"
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M2.29004 5.90393H17.7067"
                stroke=""
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M17.7075 14.0961H2.29085"
                stroke=""
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M12.0826 3.33331C13.5024 3.33331 14.6534 4.48431 14.6534 5.90414C14.6534 7.32398 13.5024 8.47498 12.0826 8.47498C10.6627 8.47498 9.51172 7.32398 9.51172 5.90415C9.51172 4.48432 10.6627 3.33331 12.0826 3.33331Z"
                fill=""
                stroke=""
                strokeWidth="1.5"
              />
              <path
                d="M7.91745 11.525C6.49762 11.525 5.34662 12.676 5.34662 14.0959C5.34661 15.5157 6.49762 16.6667 7.91745 16.6667C9.33728 16.6667 10.4883 15.5157 10.4883 14.0959C10.4883 12.676 9.33728 11.525 7.91745 11.525Z"
                fill=""
                stroke=""
                strokeWidth="1.5"
              />
            </svg>
            Filter
          </button>
          <button className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-theme-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200">
            View All Jobs
          </button>
        </div>
      </div>
      <div className="max-w-full overflow-x-auto">
        <Table>
          {/* Table Header */}
          <TableHeader className="border-gray-100 dark:border-gray-800 border-y">
            <TableRow>
              <TableCell
                isHeader
                className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Job Details
              </TableCell>
              <TableCell
                isHeader
                className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Customer
              </TableCell>
              <TableCell
                isHeader
                className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Maid Assigned
              </TableCell>
              <TableCell
                isHeader
                className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Status
              </TableCell>
              <TableCell
                isHeader
                className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Payment
              </TableCell>
            </TableRow>
          </TableHeader>

          {/* Table Body */}
          <TableBody className="divide-y divide-gray-100 dark:divide-gray-800">
            {jobRequests.map((job) => (
              <TableRow key={job.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                <TableCell className="py-4">
                  <div>
                    <p className="font-medium text-gray-800 text-theme-sm dark:text-white/90">
                      {job.jobTitle}
                    </p>
                    <div className="flex items-center mt-1 text-gray-500 text-theme-xs dark:text-gray-400">
                      <HomeIcon className="w-3.5 h-3.5 mr-1.5" />
                      <span className="truncate max-w-[180px]" title={job.location}>
                        {job.location}
                      </span>
                    </div>
                    <div className="flex items-center mt-1 text-gray-500 text-theme-xs dark:text-gray-400">
                      <CalenderIcon className="w-4 h-4 text-gray-500" />
                      <span>{new Date(job.date).toLocaleDateString()}</span>
                      <TimeIcon className="w-4 h-4 text-gray-500 ml-2" />
                      <span>{job.time}</span>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="py-4">
                  <div className="flex items-center">
                    <div className="flex items-center justify-center w-8 h-8 mr-2 rounded-full bg-gray-100 dark:bg-gray-700">
                      <UserIcon className="w-4 h-4 text-gray-500 dark:text-gray-300" />
                    </div>
                    <span className="text-gray-700 text-theme-sm dark:text-gray-200">
                      {job.customer}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="py-4">
                  <div className="flex items-center">
                    <div className="flex items-center justify-center w-8 h-8 mr-2 rounded-full bg-blue-50 dark:bg-blue-900/30">
                      <UserIcon className="w-4 h-4 text-blue-500 dark:text-blue-300" />
                    </div>
                    <span className="text-gray-700 text-theme-sm dark:text-gray-200">
                      {job.maidAssigned}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="py-4">
                  <Badge
                    size="sm"
                    color={
                      job.status === "Completed"
                        ? "success"
                        : job.status === "In Progress"
                        ? "info"
                        : job.status === "Scheduled"
                        ? "warning"
                        : "error"
                    }
                  >
                    {job.status}
                  </Badge>
                </TableCell>
                <TableCell className="py-4">
                  <Badge
                    size="sm"
                    color={
                      job.paymentStatus === "Paid"
                        ? "success"
                        : job.paymentStatus === "Pending"
                        ? "warning"
                        : "error"
                    }
                  >
                    {job.paymentStatus}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
