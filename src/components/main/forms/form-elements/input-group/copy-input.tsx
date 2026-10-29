"use client";

import { Field, FieldLabel } from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { CheckIcon, CopyIcon } from "@/icons";
import { useState } from "react";

export default function CopyInput() {
  const [value, setValue] = useState("www.tailadmin.com");
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  return (
    <Field>
      <FieldLabel>Website</FieldLabel>
      <InputGroup className="overflow-hidden">
        <InputGroupInput
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="www.tailadmin.com"
        />
        <InputGroupAddon
          align="inline-end"
          className="self-stretch border-s border-gray-200 p-0 dark:border-gray-800"
        >
          <button
            type="button"
            onClick={handleCopy}
            className="flex h-full cursor-pointer items-center gap-1.5 rounded-e-[10px] px-3.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 hover:text-gray-900 focus:outline-hidden dark:text-gray-300 dark:hover:bg-white/5 dark:hover:text-white"
          >
            {copied ? (
              <>
                <CheckIcon className="size-4 text-green-500" />
                <span className="text-green-500">Copied!</span>
              </>
            ) : (
              <>
                <CopyIcon className="size-4 text-gray-500 dark:text-gray-400" />
                <span>Copy</span>
              </>
            )}
          </button>
        </InputGroupAddon>
      </InputGroup>
    </Field>
  );
}
