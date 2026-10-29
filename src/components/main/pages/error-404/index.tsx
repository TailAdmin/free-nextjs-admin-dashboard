import GridShape from "@/components/common/grid-shape";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { cn } from "@/utils";
import Image from "next/image";
import { Error404Props } from "./types";

export default function Error404({
  title = "ERROR",
  description = "We can’t seem to find the page you are looking for!",
  homeLinkText = "Back to Home Page",
  homeHref = "/",
  className,
}: Error404Props) {
  return (
    <div
      className={cn(
        "relative z-1 flex min-h-screen flex-col items-center justify-center overflow-hidden p-6",
        className,
      )}
    >
      <GridShape />
      <div className="mx-auto w-full max-w-60.5 text-center sm:max-w-118">
        <h1 className="text-title-md xl:text-title-2xl mb-8 font-bold text-gray-800 dark:text-white/90">
          {title}
        </h1>

        <Image
          src="/images/error/404.svg"
          alt="404"
          className="dark:hidden"
          width={472}
          height={152}
          priority
        />
        <Image
          src="/images/error/404-dark.svg"
          alt="404"
          className="hidden dark:block"
          width={472}
          height={152}
          priority
        />

        <p className="mt-10 mb-6 text-base text-gray-700 sm:text-lg dark:text-gray-400">
          {description}
        </p>

        <Button
          size="lg"
          variant="outline"
          className="h-12.5 bg-white"
          nativeButton={false}
          render={<Link href={homeHref} />}
        >
          {homeLinkText}
        </Button>
      </div>

      <p className="absolute inset-s-1/2 bottom-6 -translate-x-1/2 text-center text-sm text-gray-500 rtl:translate-x-1/2 dark:text-gray-400">
        &copy; {new Date().getFullYear()} - TailAdmin
      </p>
    </div>
  );
}
