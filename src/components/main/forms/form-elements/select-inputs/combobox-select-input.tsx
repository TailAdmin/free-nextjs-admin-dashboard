"use client";

import { Field, FieldLabel } from "@/components/ui/field";
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox";

const frameworks = [
  "Next.js",
  "React",
  "Vue.js",
  "Svelte",
  "Angular",
  "Nuxt.js",
  "Remix",
  "Astro",
  "Gatsby",
];

export default function ComboboxSelectInput() {
  return (
    <Field>
      <FieldLabel>Searchable Select (Combobox)</FieldLabel>
      <Combobox items={frameworks}>
        <ComboboxInput
          placeholder="Select framework..."
          showTrigger
          showClear
        />
        <ComboboxContent>
          <ComboboxEmpty>No framework found.</ComboboxEmpty>
          <ComboboxList>
            {(item: string) => (
              <ComboboxItem key={item} value={item}>
                {item}
              </ComboboxItem>
            )}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
    </Field>
  );
}
