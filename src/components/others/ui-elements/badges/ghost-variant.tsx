import { Badge } from "@/components/ui/badge";

export default function GhostVariant() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
      <Badge variant="ghost" color="primary">
        Primary
      </Badge>
      <Badge variant="ghost" color="success">
        Success
      </Badge>
      <Badge variant="ghost" color="error">
        Error
      </Badge>
      <Badge variant="ghost" color="warning">
        Warning
      </Badge>
      <Badge variant="ghost" color="info">
        Info
      </Badge>
      <Badge variant="ghost" color="gray">
        Gray
      </Badge>
    </div>
  );
}
