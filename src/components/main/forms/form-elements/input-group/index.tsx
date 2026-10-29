import ComponentCard from "@/components/common/component-card";
import CopyInput from "./copy-input";
import EmailInput from "./email-input";
import PhoneInputEnd from "./phone-input-end";
import PhoneInputStart from "./phone-input-start";
import UrlInput from "./url-input";

export default function InputGroup() {
  return (
    <ComponentCard title="Input Group">
      <div className="space-y-6">
        <EmailInput />
        <PhoneInputStart />
        <PhoneInputEnd />
        <UrlInput />
        <CopyInput />
      </div>
    </ComponentCard>
  );
}
