"use client";

import { Field, FieldLabel } from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { ChevronDownIcon } from "@/icons";

export default function PhoneInputEnd() {
  return (
    <Field>
      <FieldLabel>Phone</FieldLabel>
      <InputGroup className="overflow-hidden">
        <InputGroupInput type="tel" placeholder="+1 (555) 000-0000" />
        <InputGroupAddon
          align="inline-end"
          className="relative self-stretch border-s border-gray-200 p-0 dark:border-gray-800"
        >
          <div className="relative flex h-full items-center">
            <select
              defaultValue="US"
              onClick={(e) => e.stopPropagation()}
              className="h-full cursor-pointer appearance-none border-0 border-none bg-transparent py-0 ps-3.5 pe-8 text-sm font-medium text-gray-700 shadow-none outline-hidden focus:border-0 focus:border-none focus:outline-hidden focus:ring-0 dark:text-gray-300 dark:hover:text-white dark:focus:text-white"
            >
              <option
                value="US"
                className="text-gray-700 dark:bg-gray-900 dark:text-gray-300"
              >
                US
              </option>
              <option
                value="GB"
                className="text-gray-700 dark:bg-gray-900 dark:text-gray-300"
              >
                GB
              </option>
              <option
                value="CA"
                className="text-gray-700 dark:bg-gray-900 dark:text-gray-300"
              >
                CA
              </option>
              <option
                value="AU"
                className="text-gray-700 dark:bg-gray-900 dark:text-gray-300"
              >
                AU
              </option>
            </select>
            <ChevronDownIcon className="pointer-events-none absolute inset-e-2.5 size-4 text-gray-500 dark:text-gray-400" />
          </div>
        </InputGroupAddon>
      </InputGroup>
    </Field>
  );
}
