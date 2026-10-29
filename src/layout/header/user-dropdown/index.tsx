"use client";

import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown";
import { getLanguage, languages } from "@/i18n/languages";
import { Link, usePathname, useRouter } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import {
  ChevronDownIcon,
  GearIcon,
  GlobeIcon,
  InfoCircleIcon,
  LogOutIcon,
  UserCircleIcon,
} from "@/icons";
import { cn } from "@/utils";
import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";
import { useState } from "react";

export default function UserDropdown() {
  const t = useTranslations("userDropdown");
  const locale = useLocale() as Locale;
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const currentLang = getLanguage(locale);
  const CurrentFlagIcon = currentLang.FlagIcon;

  const handleSelectLanguage = (id: Locale) => {
    router.replace(pathname, { locale: id });
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger className="dropdown-toggle flex items-center text-gray-700 dark:text-gray-400">
        <span className="me-3 h-11 w-11 overflow-hidden rounded-lg">
          <Image
            width={44}
            height={44}
            src="/images/user/owner.png"
            alt="User"
          />
        </span>

        <span className="me-1 block text-sm font-medium">Musharof</span>

        <ChevronDownIcon
          className={cn(
            "size-5 text-gray-500 duration-200 dark:text-gray-400",
            isOpen ? "rotate-180" : "rotate-0",
          )}
        />
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" sideOffset={12} className="w-65 p-3">
        <div className="px-3 py-2">
          <span className="block text-sm font-medium text-gray-700 dark:text-gray-400">
            Musharof Chowdhury
          </span>
          <span className="mt-0.5 block text-xs text-gray-500 dark:text-gray-400">
            randomuser@pimjo.com
          </span>
        </div>

        <DropdownMenuSeparator />

        <DropdownMenuItem render={<Link href="/profile" />}>
          <UserCircleIcon className="size-6" />
          {t("editProfile")}
        </DropdownMenuItem>

        <DropdownMenuItem render={<Link href="/profile" />}>
          <GearIcon className="size-6" />
          {t("accountSettings")}
        </DropdownMenuItem>

        <DropdownMenuItem render={<Link href="/profile" />}>
          <InfoCircleIcon className="size-6" />
          {t("support")}
        </DropdownMenuItem>

        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            <GlobeIcon className="size-6" />
            <span>{t("language")}</span>
            <Badge
              variant="light"
              color="gray"
              size="sm"
              className="ms-auto me-1 h-auto gap-1.5 border border-gray-200 bg-gray-50 px-2 py-1 text-xs font-medium text-gray-700 text-shadow-none dark:border-gray-800 dark:bg-white/3 dark:text-gray-300 dark:text-shadow-none [&>svg]:size-3.5"
            >
              <span>{currentLang.shortName}</span>
              <CurrentFlagIcon className="size-3.5 shrink-0 overflow-hidden rounded-full" />
            </Badge>
          </DropdownMenuSubTrigger>

          <DropdownMenuPortal>
            <DropdownMenuSubContent className="w-56 p-2">
              {languages.map((language) => {
                const isSelected = locale === language.id;
                const FlagIcon = language.FlagIcon;

                return (
                  <DropdownMenuItem
                    key={language.id}
                    onClick={() => handleSelectLanguage(language.id)}
                    className={cn(
                      "flex items-center justify-between gap-2",
                      isSelected &&
                        "bg-brand-50 text-brand-600 dark:bg-brand-500/15 dark:text-brand-400",
                    )}
                  >
                    <span className="flex items-center gap-2">
                      <span
                        className={cn(
                          "size-1.5 shrink-0 rounded-full transition-opacity",
                          isSelected
                            ? "bg-brand-500 opacity-100 dark:bg-brand-400"
                            : "opacity-0",
                        )}
                      />
                      <FlagIcon className="size-5 shrink-0 overflow-hidden rounded-full" />
                      <span className="truncate">{language.name}</span>
                    </span>

                    {language.badge && (
                      <Badge
                        variant="light"
                        color="warning"
                        className="rounded text-xs"
                      >
                        {language.badge}
                      </Badge>
                    )}
                  </DropdownMenuItem>
                );
              })}
            </DropdownMenuSubContent>
          </DropdownMenuPortal>
        </DropdownMenuSub>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          variant="destructive"
          render={<Link href="/signin" />}
        >
          <LogOutIcon />
          {t("signOut")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
