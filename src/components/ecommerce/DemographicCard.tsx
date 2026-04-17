"use client";
import Image from "next/image";
import CountryMap from "./CountryMap";
import { useState } from "react";
import { MoreDotIcon } from "@/icons";
import { Dropdown } from "../ui/dropdown/Dropdown";
import { DropdownItem } from "../ui/dropdown/DropdownItem";

interface CountryData {
  name: string;
  flag: string;
  customers: number;
  percentage: number;
  color: string;
}

const countryData: CountryData[] = [
  {
    name: "United States",
    flag: "/images/country/country-01.svg",
    customers: 2379,
    percentage: 63,
    color: "bg-brand-500",
  },
  {
    name: "France",
    flag: "/images/country/country-02.svg",
    customers: 589,
    percentage: 16,
    color: "bg-success-500",
  },
  {
    name: "Germany",
    flag: "/images/country/country-03.svg",
    customers: 425,
    percentage: 11,
    color: "bg-orange-500",
  },
  {
    name: "Japan",
    flag: "/images/country/country-04.svg",
    customers: 287,
    percentage: 8,
    color: "bg-blue-light-500",
  },
  {
    name: "Others",
    flag: "/images/country/country-05.svg",
    customers: 102,
    percentage: 2,
    color: "bg-gray-400",
  },
];

export default function DemographicCard() {
  const [isOpen, setIsOpen] = useState(false);

  function toggleDropdown() {
    setIsOpen(!isOpen);
  }

  function closeDropdown() {
    setIsOpen(false);
  }

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] sm:p-6">
      <div className="flex justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Customers by Location
          </h3>
          <p className="mt-1 text-gray-500 text-theme-sm dark:text-gray-400">
            Geographic distribution of your customer base
          </p>
        </div>

        <div className="relative inline-block">
          <button onClick={toggleDropdown} className="dropdown-toggle">
            <MoreDotIcon className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-300" />
          </button>
          <Dropdown
            isOpen={isOpen}
            onClose={closeDropdown}
            className="w-40 p-2"
          >
            <DropdownItem
              onItemClick={closeDropdown}
              className="flex w-full font-normal text-left text-gray-500 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
            >
              View Details
            </DropdownItem>
            <DropdownItem
              onItemClick={closeDropdown}
              className="flex w-full font-normal text-left text-gray-500 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
            >
              Export Data
            </DropdownItem>
          </Dropdown>
        </div>
      </div>

      <div className="px-4 py-6 my-6 overflow-hidden border border-gray-200 rounded-2xl bg-gray-50 dark:border-gray-800 dark:bg-gray-900 sm:px-6">
        <div
          id="mapOne"
          className="mapOne map-btn -mx-4 -my-6 h-[212px] w-[252px] 2xsm:w-[307px] xsm:w-[358px] sm:-mx-6 md:w-[668px] lg:w-[634px] xl:w-[393px] 2xl:w-[554px]"
        >
          <CountryMap />
        </div>
      </div>

      <div className="space-y-4">
        {countryData.map((country, index) => (
          <div key={index} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="items-center w-full rounded-full max-w-8">
                <Image
                  width={48}
                  height={48}
                  src={country.flag}
                  alt={country.name}
                  className="w-full"
                />
              </div>
              <div>
                <p className="font-semibold text-gray-800 text-theme-sm dark:text-white/90">
                  {country.name}
                </p>
                <span className="block text-gray-500 text-theme-xs dark:text-gray-400">
                  {country.customers.toLocaleString()} Customers
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative block h-2 w-24 rounded-sm bg-gray-200 dark:bg-gray-800">
                <div
                  className={`absolute left-0 top-0 flex h-full items-center justify-center rounded-sm ${country.color} text-xs font-medium text-white`}
                  style={{ width: `${country.percentage}%` }}
                ></div>
              </div>
              <p className="w-10 text-right font-medium text-gray-800 text-theme-sm dark:text-white/90">
                {country.percentage}%
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
