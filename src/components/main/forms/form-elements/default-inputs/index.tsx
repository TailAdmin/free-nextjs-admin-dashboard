import ComponentCard from "@/components/common/component-card";
import BasicInput from "./basic-input";
import DatePickerInput from "./date-picker-input";
import InputWithPlaceholder from "./input-with-placeholder";
import PasswordInput from "./password-input";
import PaymentInput from "./payment-input";
import SelectInput from "./select-input";
import TimeSelectInput from "./time-select-input";

export default function DefaultInputs() {
  return (
    <ComponentCard title="Default Inputs">
      <div className="space-y-6">
        <BasicInput />
        <InputWithPlaceholder />
        <SelectInput />
        <PasswordInput />
        <DatePickerInput />
        <TimeSelectInput />
        <PaymentInput />
      </div>
    </ComponentCard>
  );
}
