import ComponentCard from "@/components/common/component-card";
import DefaultTextarea from "./default-textarea";
import DisabledTextarea from "./disabled-textarea";
import ErrorTextarea from "./error-textarea";
import InputGroupTextareaExample from "./input-group-textarea";

export default function TextAreaInput() {
  return (
    <ComponentCard title="Textarea input field">
      <div className="space-y-6">
        <DefaultTextarea />
        <DisabledTextarea />
        <ErrorTextarea />
        <InputGroupTextareaExample />
      </div>
    </ComponentCard>
  );
}
