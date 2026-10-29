import { Badge } from "@/components/ui/badge";
import { PlusIcon } from "./icons";

export default function LightVariantWithLeadingIcon() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
      <Badge variant="light" color="primary">
        <PlusIcon />
        <span>Primary</span>
      </Badge>
      <Badge variant="light" color="success">
        <PlusIcon />
        <span>Success</span>
      </Badge>
      <Badge variant="light" color="error">
        <PlusIcon />
        <span>Error</span>
      </Badge>
      <Badge variant="light" color="warning">
        <PlusIcon />
        <span>Warning</span>
      </Badge>
      <Badge variant="light" color="info">
        <PlusIcon />
        <span>Info</span>
      </Badge>
      <Badge variant="light" color="gray">
        <PlusIcon />
        <span>Gray</span>
      </Badge>
    </div>
  );
}
