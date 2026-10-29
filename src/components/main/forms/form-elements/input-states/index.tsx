import ComponentCard from "@/components/common/component-card";
import DisabledInput from "./disabled-input";
import ErrorInput from "./error-input";
import SuccessInput from "./success-input";

export default function InputStates() {
  return (
    <ComponentCard
      title="Input States"
      desc="Validation styles for error, success and disabled states on form controls."
    >
      <div className="space-y-6">
        <ErrorInput />
        <SuccessInput />
        <DisabledInput />
      </div>
    </ComponentCard>
  );
}
