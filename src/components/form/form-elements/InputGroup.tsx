"use client";

import { EnvelopeIcon } from "../../../icons";
import ComponentCard from "../../common/ComponentCard";
import Label from "../Label";
import PhoneInput from "../group-input/PhoneInput";
import Input from "../input/InputField";
import CopyInput from "./CopyInput";
import UrlPrefixInput from "./UrlPrefixInput";

export default function InputGroup() {
  const countries = [
    { code: "US", label: "+1" },
    { code: "GB", label: "+44" },
    { code: "CA", label: "+1" },
    { code: "AU", label: "+61" },
  ];
  const handlePhoneNumberChange = (phoneNumber: string) => {
    console.log("Updated phone number:", phoneNumber);
  };

  return (
    <ComponentCard title="Input Group">
      <div className="space-y-6">
        <div>
          <Label htmlFor="email">Email</Label>
          <div className="relative">
            <Input
              id="email"
              placeholder="info@gmail.com"
              type="text"
              className="ps-[62px]"
            />
            <span className="absolute start-0 top-1/2 -translate-y-1/2 border-e border-gray-200 px-3.5 py-3 text-gray-500 dark:border-gray-800 dark:text-gray-400">
              <EnvelopeIcon />
            </span>
          </div>
        </div>

        <div>
          <Label htmlFor="phone">Phone</Label>
          <PhoneInput
            selectPosition="start"
            countries={countries}
            placeholder="+1 (555) 000-0000"
            onChange={handlePhoneNumberChange}
          />
        </div>

        <div>
          <Label>Website</Label>
          <PhoneInput
            selectPosition="end"
            countries={countries}
            placeholder="+1 (555) 000-0000"
            onChange={handlePhoneNumberChange}
          />
        </div>

        <div>
          <Label>URL</Label>
          <UrlPrefixInput />
        </div>
        <div>
          <Label>Website</Label>
          <CopyInput />
        </div>
      </div>
    </ComponentCard>
  );
}
