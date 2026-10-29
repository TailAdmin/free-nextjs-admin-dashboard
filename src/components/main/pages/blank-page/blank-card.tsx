import { Card } from "@/components/ui/card";
import { cn } from "@/utils";
import { BlankCardProps } from "./types";

export default function BlankCard({
  title = "Card Title Here",
  description = "Start putting content on grids or panels, you can also use different combinations of grids. Please check out the dashboard and other pages",
  className,
}: BlankCardProps) {
  return (
    <Card
      className={cn(
        "flex min-h-screen items-center justify-center rounded-2xl border border-gray-200 bg-white px-5 py-7 shadow-none xl:px-10 xl:py-12 dark:border-gray-800 dark:bg-white/3",
        className,
      )}
    >
      <div className="mx-auto w-full max-w-157.5 text-center">
        <h3 className="text-theme-xl mb-4 font-semibold text-gray-800 sm:text-2xl dark:text-white/90">
          {title}
        </h3>
        <p className="text-sm text-gray-500 sm:text-base dark:text-gray-400">
          {description}
        </p>
      </div>
    </Card>
  );
}
