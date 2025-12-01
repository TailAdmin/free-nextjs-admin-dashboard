import { cn } from "@/lib/utils";
import { CircleSlashIcon } from "lucide-react";

export function GeneralEmptyContent({className}: {className?: string}) {
    return (
        <div className={cn("w-full bg-foreground/5 rounded-lg gap-2 justify-center flex flex-col text-muted-foreground items-center h-full min-h-[120px]", className)}>
            <CircleSlashIcon size={24} strokeWidth={2} />
            <span className="text-base font-medium">Sin Datos</span>
        </div>
    );
}
