import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

export default function SuccessInput() {
  return (
    <Field>
      <FieldLabel>Email</FieldLabel>
      <Input
        type="email"
        defaultValue="demoemail@gmail.com"
        data-success="true"
      />
      <p className="text-xs text-green-600 dark:text-green-400">
        This is an success message.
      </p>
    </Field>
  );
}
