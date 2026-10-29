import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

export default function BasicInput() {
  return (
    <Field>
      <FieldLabel>Input</FieldLabel>
      <Input type="text" />
    </Field>
  );
}
