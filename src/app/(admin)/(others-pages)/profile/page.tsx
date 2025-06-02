"use client"

import { SignatureModal } from "@/components/modal/SignatureModal";
import UserInfoCard from "@/components/user-profile/UserInfoCard";
import UserMetaCard from "@/components/user-profile/UserMetaCard";
import React, { useState } from "react";


export default function Profile() {
  const [isModalOpen, setModalOpen] = useState(false);
  return (
    <div>
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
        <h3 className="mb-5 text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-7">
          Profile
        </h3>
        <div className="space-y-6">
          <UserMetaCard />
          <UserInfoCard />
          <button
            onClick={() => setModalOpen(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Upload Tanda Tangan
          </button>

          {isModalOpen && <SignatureModal isOpen={isModalOpen} onClose={() => setModalOpen(false)} />}
        </div>
      </div>
    </div>
  );
}
