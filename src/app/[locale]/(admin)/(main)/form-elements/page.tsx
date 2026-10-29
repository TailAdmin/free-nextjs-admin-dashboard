import PageBreadcrumb from "@/components/common/page-breadcrumb";
import CheckboxInputs from "@/components/main/forms/form-elements/checkbox-inputs";
import DefaultInputs from "@/components/main/forms/form-elements/default-inputs";
import Dropzone from "@/components/main/forms/form-elements/dropzone";
import FileInput from "@/components/main/forms/form-elements/file-input";
import InputGroup from "@/components/main/forms/form-elements/input-group";
import InputStates from "@/components/main/forms/form-elements/input-states";
import RadioButtons from "@/components/main/forms/form-elements/radio-buttons";
import SelectInputs from "@/components/main/forms/form-elements/select-inputs";
import TextAreaInput from "@/components/main/forms/form-elements/textarea-input";
import ToggleSwitch from "@/components/main/forms/form-elements/toggle-switch";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Next.js Form Elements | TailAdmin - Next.js Dashboard Template",
  description:
    "This is Next.js Form Elements page for TailAdmin - Next.js Tailwind CSS Admin Dashboard Template",
};

export default function FormElements() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Form Elements" />
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <div className="space-y-6">
          <DefaultInputs />
          <SelectInputs />
          <TextAreaInput />
          <InputStates />
        </div>
        <div className="space-y-6">
          <InputGroup />
          <FileInput />
          <CheckboxInputs />
          <RadioButtons />
          <ToggleSwitch />
          <Dropzone />
        </div>
      </div>
    </div>
  );
}
