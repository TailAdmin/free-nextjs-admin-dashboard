import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

export default function ErrorInput() {
  return (
    <Field>
      <FieldLabel>Email</FieldLabel>
      <Input
        type="email"
        placeholder="demo-email@tailadmin.com"
        aria-invalid="true"
      />
      <FieldError className="text-xs">Clear guidance for users.</FieldError>
    </Field>
  );
}
