import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

export default function DisabledInput() {
  return (
    <Field>
      <FieldLabel className="text-gray-400 dark:text-gray-500">
        Email
      </FieldLabel>
      <Input type="email" defaultValue="info@tailadmin.com" disabled />
    </Field>
  );
}
