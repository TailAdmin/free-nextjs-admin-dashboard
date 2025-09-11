import MaidProfileCard from "@/components/user-profile/MaidProfileCard";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Maid Profile | CityMaid",
  description: "Manage your maid profile information",
};

export default function Profile() {
  return (
    <div>
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
        <h3 className="mb-5 text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-7">
          Maid Profile
        </h3>
        <div className="space-y-6">
          <MaidProfileCard />
        </div>
      </div>
    </div>
  );
}
