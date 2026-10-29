import ComponentCard from "@/components/common/component-card";
import PageBreadcrumb from "@/components/common/page-breadcrumb";
import GhostVariant from "@/components/others/ui-elements/badges/ghost-variant";
import GhostVariantWithLeadingIcon from "@/components/others/ui-elements/badges/ghost-variant-with-leading-icon";
import GhostVariantWithTrailingIcon from "@/components/others/ui-elements/badges/ghost-variant-with-trailing-icon";
import LightVariant from "@/components/others/ui-elements/badges/light-variant";
import LightVariantWithLeadingIcon from "@/components/others/ui-elements/badges/light-variant-with-leading-icon";
import LightVariantWithTrailingIcon from "@/components/others/ui-elements/badges/light-variant-with-trailing-icon";
import SolidBadgeVariant from "@/components/others/ui-elements/badges/solid-variant";
import SolidVariantWithLeadingIcon from "@/components/others/ui-elements/badges/solid-variant-with-leading-icon";
import SolidVariantWithTrailingIcon from "@/components/others/ui-elements/badges/solid-variant-with-trailing-icon";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Next.js Badge | TailAdmin - Next.js Dashboard Template",
  description:
    "This is Next.js Badge page for TailAdmin - Next.js Tailwind CSS Admin Dashboard Template",
};

export default function BadgePage() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Badges" />
      <div className="space-y-5 sm:space-y-6">
        <ComponentCard title="With Solid Background">
          <SolidBadgeVariant />
        </ComponentCard>

        <ComponentCard title="With Light Background">
          <LightVariant />
        </ComponentCard>

        <ComponentCard title="Ghost Variant">
          <GhostVariant />
        </ComponentCard>

        <ComponentCard title="Solid Background with Leading Icon">
          <SolidVariantWithLeadingIcon />
        </ComponentCard>

        <ComponentCard title="Light Background with Leading Icon">
          <LightVariantWithLeadingIcon />
        </ComponentCard>

        <ComponentCard title="Ghost Variant with Leading Icon">
          <GhostVariantWithLeadingIcon />
        </ComponentCard>

        <ComponentCard title="Solid Background with Trailing Icon">
          <SolidVariantWithTrailingIcon />
        </ComponentCard>

        <ComponentCard title="Light Background with Trailing Icon">
          <LightVariantWithTrailingIcon />
        </ComponentCard>

        <ComponentCard title="Ghost Variant with Trailing Icon">
          <GhostVariantWithTrailingIcon />
        </ComponentCard>
      </div>
    </div>
  );
}
