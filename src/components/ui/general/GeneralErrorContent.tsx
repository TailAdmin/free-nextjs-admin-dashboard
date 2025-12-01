import { cn } from "@/lib/utils";
import { CircleXIcon } from "lucide-react";
import { type QueryObserverResult, type RefetchOptions } from "@tanstack/react-query";
import { Button } from "../button";

export function GeneralErrorContent({className, refetch, title=true, errorMessage }: {className?: string, title?:boolean, refetch?: (options?: RefetchOptions) => Promise<QueryObserverResult<any, Error>>, errorMessage?: string}) {
    return (
        <div className={cn("w-full text-destructive bg-destructive/20 rounded-lg gap-2 justify-center flex flex-col items-center h-full min-h-[120px]", className)}>
            <CircleXIcon size={24} strokeWidth={2} />
            {title && <span className="text-base font-medium">Error al cargar los datos</span>}
            {errorMessage && <span className="text-sm text-destructive">{errorMessage}</span>}
            {refetch && (
                <Button variant={"secondary"} size={"sm"} className="text-foreground" onClick={() => refetch()}>Reintentar</Button>
            )}
        </div>
    );
}
