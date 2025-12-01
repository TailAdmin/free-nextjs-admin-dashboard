import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type CardLoadingProps = {
    className?: string;
    icon?: boolean;
    description?: boolean
    title?: boolean;
    children?: React.ReactNode;
    content?: boolean;
};

export default function GeneralCardLoading({ className, icon, description, title, children, content = true }: CardLoadingProps) {

  return (
    <Card className={cn("w-full h-full min-h-fit bg-foreground/10 p-4 sm:px-6 overflow-hidden", className)}>
        <div className="flex flex-col h-full min-h-fit gap-4" >
            <CardHeader className="flex flex-col items-start gap-0 p-0 pt-2 ">
                <CardTitle className="text-xl font-bold flex gap-2 items-center">
                    {icon && <div className="animate-pulse bg-foreground/10 size-5 rounded-sm"/>}
                    {title && <div className="animate-pulse bg-foreground/10 h-4 w-52 rounded-full"/>}
                </CardTitle>
                <CardDescription>{description && <div className="animate-pulse mt-2 bg-foreground/10 h-4 w-64 sm:w-96 rounded-full"/>}</CardDescription>
            </CardHeader>
            <CardContent style={{containerType: "size"}} className="flex p-0 flex-col h-full min-h-[120px]">
                {(children && content) ? children : <div className="animate-pulse bg-foreground/10 h-[100cqh] min-h-[120px] !aspect-autow-full rounded-md"/>}
            </CardContent>
        </div>
    </Card>
  )
}
