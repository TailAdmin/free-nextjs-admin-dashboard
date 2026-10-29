import { Badge } from "@/components/ui/badge";
import { PlusIcon } from "./icons";

export default function LightVariantWithTrailingIcon() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
      <Badge variant="light" color="primary">
        <span>Primary</span>
        <PlusIcon />
      </Badge>
      <Badge variant="light" color="success">
        <span>Success</span>
        <PlusIcon />
      </Badge>
      <Badge variant="light" color="error">
        <span>Error</span>
        <PlusIcon />
      </Badge>
      <Badge variant="light" color="warning">
        <span>Warning</span>
        <PlusIcon />
      </Badge>
      <Badge variant="light" color="info">
        <span>Info</span>
        <PlusIcon />
      </Badge>
      <Badge variant="light" color="gray">
        <span>Gray</span>
        <PlusIcon />
      </Badge>
    </div>
  );
}
