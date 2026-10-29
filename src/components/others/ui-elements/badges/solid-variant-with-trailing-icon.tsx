import { Badge } from "@/components/ui/badge";
import { PlusIcon } from "./icons";

export default function SolidVariantWithTrailingIcon() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
      <Badge variant="solid" color="primary">
        <span>Primary</span>
        <PlusIcon />
      </Badge>
      <Badge variant="solid" color="success">
        <span>Success</span>
        <PlusIcon />
      </Badge>
      <Badge variant="solid" color="error">
        <span>Error</span>
        <PlusIcon />
      </Badge>
      <Badge variant="solid" color="warning">
        <span>Warning</span>
        <PlusIcon />
      </Badge>
      <Badge variant="solid" color="info">
        <span>Info</span>
        <PlusIcon />
      </Badge>
      <Badge variant="solid" color="gray">
        <span>Gray</span>
        <PlusIcon />
      </Badge>
    </div>
  );
}
