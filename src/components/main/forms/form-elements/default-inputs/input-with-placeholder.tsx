import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

export default function InputWithPlaceholder() {
  return (
    <Field>
      <FieldLabel>Input with Placeholder</FieldLabel>
      <Input type="text" placeholder="info@gmail.com" />
    </Field>
  );
}
