import { Field, FieldLabel } from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";

export default function DisabledTextarea() {
  return (
    <Field>
      <FieldLabel className="text-gray-400 dark:text-gray-500">
        Description
      </FieldLabel>
      <Textarea placeholder="Enter a description..." rows={6} disabled />
    </Field>
  );
}
