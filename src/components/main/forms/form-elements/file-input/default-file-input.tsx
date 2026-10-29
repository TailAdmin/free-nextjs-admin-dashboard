"use client";

import { Field, FieldLabel } from "@/components/ui/field";
import { FileInput } from "@/components/ui/file-input";

export default function DefaultFileInput() {
  return (
    <Field>
      <FieldLabel>Upload file</FieldLabel>
      <FileInput />
    </Field>
  );
}
