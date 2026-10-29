import { Badge } from "@/components/ui/badge";
import { PlusIcon } from "./icons";

export default function GhostVariantWithLeadingIcon() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
      <Badge variant="ghost" color="primary">
        <PlusIcon />
        Primary
      </Badge>
      <Badge variant="ghost" color="success">
        <PlusIcon />
        Success
      </Badge>
      <Badge variant="ghost" color="error">
        <PlusIcon />
        Error
      </Badge>
      <Badge variant="ghost" color="warning">
        <PlusIcon />
        Warning
      </Badge>
      <Badge variant="ghost" color="info">
        <PlusIcon />
        Info
      </Badge>
      <Badge variant="ghost" color="gray">
        <PlusIcon />
        Gray
      </Badge>
    </div>
  );
}
