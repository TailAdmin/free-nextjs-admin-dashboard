import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["en"], // expand when multilang is needed
  defaultLocale: "en",
  localePrefix: "never",
});

export type Locale = (typeof routing.locales)[number];
