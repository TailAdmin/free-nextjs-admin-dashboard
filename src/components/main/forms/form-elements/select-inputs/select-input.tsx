import { Field, FieldLabel } from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function SelectInput() {
  return (
    <Field>
      <FieldLabel>Select Input</FieldLabel>
      <Select>
        <SelectTrigger>
          <SelectValue placeholder="Select Option" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="option-1">Option 1</SelectItem>
          <SelectItem value="option-2">Option 2</SelectItem>
          <SelectItem value="option-3">Option 3</SelectItem>
          <SelectItem value="option-4">Option 4</SelectItem>
          <SelectItem value="option-5">Option 5</SelectItem>
        </SelectContent>
      </Select>
    </Field>
  );
}
