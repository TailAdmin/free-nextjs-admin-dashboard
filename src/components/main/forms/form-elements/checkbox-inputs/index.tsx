import ComponentCard from "@/components/common/component-card";
import DefaultCheckbox from "./default-checkbox";
import LabeledCheckbox from "./labeled-checkbox";

export default function CheckboxInputs() {
  return (
    <ComponentCard title="Checkboxes">
      <div className="space-y-6">
        <DefaultCheckbox />
        <LabeledCheckbox />
      </div>
    </ComponentCard>
  );
}
