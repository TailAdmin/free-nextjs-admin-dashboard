import { Badge } from "@/components/ui/badge";

export default function LightVariant() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
      <Badge variant="light" color="primary">
        Primary
      </Badge>
      <Badge variant="light" color="success">
        Success
      </Badge>
      <Badge variant="light" color="error">
        Error
      </Badge>
      <Badge variant="light" color="warning">
        Warning
      </Badge>
      <Badge variant="light" color="info">
        Info
      </Badge>
      <Badge variant="light" color="gray">
        Gray
      </Badge>
    </div>
  );
}
