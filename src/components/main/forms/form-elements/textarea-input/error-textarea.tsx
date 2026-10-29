import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";

export default function ErrorTextarea() {
  return (
    <Field>
      <FieldLabel>Description</FieldLabel>
      <Textarea
        placeholder="Enter a description..."
        rows={6}
        aria-invalid="true"
      />
      <FieldError className="text-xs">
        Please enter a message in the textarea.
      </FieldError>
    </Field>
  );
}
