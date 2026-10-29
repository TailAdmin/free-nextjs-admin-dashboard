import ComponentCard from "@/components/common/component-card";
import PageBreadcrumb from "@/components/common/page-breadcrumb";
import { ButtonGroupDemo } from "@/components/others/ui-elements/buttons/button-group";
import ButtonSizes from "@/components/others/ui-elements/buttons/sizes";
import ButtonVariants from "@/components/others/ui-elements/buttons/variants";
import ButtonsWithIcon from "@/components/others/ui-elements/buttons/with-icon";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Next.js Buttons | TailAdmin - Next.js Dashboard Template",
  description:
    "This is Next.js Buttons page for TailAdmin - Next.js Tailwind CSS Admin Dashboard Template",
};

export default function Buttons() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Buttons" />
      <div className="space-y-5 sm:space-y-6">
        <ComponentCard title="Button Variants">
          <ButtonVariants />
        </ComponentCard>
        <ComponentCard title="Button Sizes">
          <ButtonSizes />
        </ComponentCard>
        <ComponentCard title="Button with Icon">
          <ButtonsWithIcon />
        </ComponentCard>
        <ComponentCard title="Button Group">
          <ButtonGroupDemo />
        </ComponentCard>
      </div>
    </div>
  );
}
