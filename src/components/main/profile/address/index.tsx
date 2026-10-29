"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PencilIcon } from "@/icons";
import { useState } from "react";
import AddressItem from "./address-item";
import { defaultAddressData } from "./data";
import EditAddressModal from "./edit-address-modal";
import { AddressData } from "./types";

export default function AddressSection() {
  const [address, setAddress] = useState<AddressData>(defaultAddressData);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSave = (updatedData: AddressData) => {
    setAddress(updatedData);
  };

  return (
    <>
      <Card className="rounded-2xl border border-gray-200 p-5 lg:p-6 dark:border-gray-700">
        <div className="flex flex-col gap-6 sm:flex-row lg:items-start lg:justify-between">
          <div className="flex-1">
            <h4 className="mb-4 text-lg font-semibold text-gray-800 lg:mb-6 dark:text-white/90">
              Address
            </h4>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:gap-7 2xl:gap-x-32">
              <AddressItem label="Country" value={address.country} />
              <AddressItem label="City/State" value={address.cityState} />
              <AddressItem label="Postal Code" value={address.postalCode} />
              <AddressItem label="TAX ID" value={address.taxId} />
            </div>
          </div>

          <div>
            <Button
              variant="outline"
              onClick={() => setIsModalOpen(true)}
              className="w-full lg:w-auto"
            >
              <PencilIcon className="size-5" />
              Edit
            </Button>
          </div>
        </div>
      </Card>

      <EditAddressModal
        isOpen={isModalOpen}
        onOpenChange={setIsModalOpen}
        initialData={address}
        onSave={handleSave}
      />
    </>
  );
}
