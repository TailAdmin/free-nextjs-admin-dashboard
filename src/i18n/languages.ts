import { UsFlagIcon } from "@/icons";

import type { Locale } from "./routing";

export interface Language {
  id: Locale;
  name: string;
  shortName: string;
  dir: "ltr" | "rtl";
  FlagIcon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  badge?: string;
}

export const languages: Language[] = [
  {
    id: "en",
    name: "English",
    shortName: "English",
    dir: "ltr",
    FlagIcon: UsFlagIcon,
  },
  // Add languages according to requirement
  // {
  //   id: "ar",
  //   name: "Arabic (Saudi)",
  //   shortName: "Arabic",
  //   dir: "rtl",
  //   FlagIcon: SaFlagIcon,
  //   badge: "RTL",
  // },
  // {
  //   id: "es",
  //   name: "Español",
  //   shortName: "Español",
  //   dir: "ltr",
  //   FlagIcon: EsFlagIcon,
  // },
  // {
  //   id: "de",
  //   name: "Deutsch",
  //   shortName: "Deutsch",
  //   dir: "ltr",
  //   FlagIcon: DeFlagIcon,
  // },
];

export function getLanguage(locale: Locale): Language {
  return languages.find((l) => l.id === locale) || languages[0];
}

export function isRtl(locale: Locale): boolean {
  return getLanguage(locale).dir === "rtl";
}
