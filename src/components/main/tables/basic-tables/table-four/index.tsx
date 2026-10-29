"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { VerticalDotsIcon } from "@/icons";
import { cn } from "@/utils";
import CampaignRow from "./campaign-row";
import { featuredCampaignsData } from "./data";
import { TableFourProps } from "./types";

export default function TableFour({
  data = featuredCampaignsData,
  className,
}: TableFourProps = {}) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-2xl border border-gray-200 bg-white px-5 pt-4 pb-3 sm:px-6 dark:border-gray-800 dark:bg-white/3",
        className,
      )}
    >
      <div className="mb-4 flex justify-between gap-2 sm:items-center">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Featured Campaigns
          </h3>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger className="dropdown-toggle">
            <VerticalDotsIcon className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-300" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40 p-2">
            <DropdownMenuItem className="flex w-full rounded-lg text-start font-normal text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300">
              View More
            </DropdownMenuItem>
            <DropdownMenuItem className="flex w-full rounded-lg text-start font-normal text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300">
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="custom-scrollbar max-w-full overflow-x-auto">
        <div className="min-w-full">
          <Table>
            {/* Table Header */}
            <TableHeader className="border-y border-gray-100 dark:border-gray-800">
              <TableRow>
                <TableCell
                  isHeader
                  className="py-3 text-start text-xs font-medium text-gray-500 dark:text-gray-400"
                >
                  Products
                </TableCell>
                <TableCell
                  isHeader
                  className="py-3 text-start text-xs font-medium text-gray-500 dark:text-gray-400"
                >
                  Campaign
                </TableCell>
                <TableCell
                  isHeader
                  className="py-3 text-start text-xs font-medium text-gray-500 dark:text-gray-400"
                >
                  Status
                </TableCell>
              </TableRow>
            </TableHeader>

            {/* Table Body */}
            <TableBody className="divide-y divide-gray-100 dark:divide-gray-800">
              {data.map((campaign) => (
                <CampaignRow key={campaign.id} campaign={campaign} />
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
