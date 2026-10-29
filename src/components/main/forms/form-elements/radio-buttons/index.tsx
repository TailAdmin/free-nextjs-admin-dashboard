import ComponentCard from "@/components/common/component-card";
import DefaultRadioButtons from "./default-radio-buttons";
import LabeledRadioButtons from "./labeled-radio-buttons";

export default function RadioButtons() {
  return (
    <ComponentCard title="Radio Buttons">
      <div className="space-y-6">
        <DefaultRadioButtons />
        <LabeledRadioButtons />
      </div>
    </ComponentCard>
  );
}
