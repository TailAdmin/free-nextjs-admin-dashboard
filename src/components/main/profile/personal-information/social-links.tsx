import { Button } from "@/components/ui/button";
import {
  FacebookIcon,
  InstagramIcon,
  LinkedinIcon,
  TwitterXIcon,
} from "@/icons";
import { cn } from "@/utils";
import { SocialLinksProps } from "./types";

export default function SocialLinks({
  socialLinks,
  className,
}: SocialLinksProps) {
  const links = [
    {
      name: "Facebook",
      href: socialLinks.facebook || "#",
      icon: <FacebookIcon className="size-5 fill-current" />,
    },
    {
      name: "X",
      href: socialLinks.x || "#",
      icon: <TwitterXIcon className="size-5 fill-current" />,
    },
    {
      name: "LinkedIn",
      href: socialLinks.linkedin || "#",
      icon: <LinkedinIcon className="size-5 fill-current" />,
    },
    {
      name: "Instagram",
      href: socialLinks.instagram || "#",
      icon: <InstagramIcon className="size-5 fill-current" />,
    },
  ];

  return (
    <div className={cn("flex flex-col gap-2 sm:gap-3", className)}>
      <p className="text-xs font-normal text-gray-500 sm:text-sm dark:text-gray-400">
        Social links
      </p>
      <div className="flex flex-wrap items-center gap-2">
        {links.map((link) => {
          const hasLink = Boolean(link.href && link.href.trim());
          return hasLink ? (
            <Button
              key={link.name}
              variant="outline"
              size="icon"
              nativeButton={false}
              aria-label={link.name}
              render={<a href={link.href} target="_blank" rel="noreferrer" />}
              className="rounded-full"
            >
              {link.icon}
            </Button>
          ) : (
            <div
              key={link.name}
              aria-label={link.name}
              className="flex size-10 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-400 shadow-theme-xs sm:size-11 dark:border-gray-800 dark:bg-gray-800 dark:text-gray-600"
            >
              {link.icon}
            </div>
          );
        })}
      </div>
    </div>
  );
}
