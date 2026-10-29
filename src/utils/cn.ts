import { type ClassValue, clsx } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

type AdditionalClassGroupIds =
  | "menu-item-state"
  | "menu-item-icon-state"
  | "menu-item-arrow-state"
  | "menu-dropdown-item-state"
  | "menu-dropdown-badge-state"
  | "menu-dropdown-badge-pro-state"
  | "docs-menu-item-state"
  | "docs-border-item-state"
  | "nav-icon-item-state";

const customTwMerge = extendTailwindMerge<AdditionalClassGroupIds>({
  extend: {
    classGroups: {
      "font-size": [
        "text-heading-one",
        "text-heading-two",
        "text-heading-three",
        "text-heading-four",
        "text-heading-five",
        "text-heading-six",
        "text-title-sm",
        "text-title-lg",
      ],
      shadow: [
        "shadow-theme-xs",
        "shadow-theme-sm",
        "shadow-theme-md",
        "shadow-theme-lg",
        "shadow-theme-xl",
        "shadow-datepicker",
        "shadow-focus-ring",
        "shadow-slider-navigation",
        "shadow-tooltip",
      ],
      "menu-item-state": ["menu-item-active", "menu-item-inactive"],
      "menu-item-icon-state": [
        "menu-item-icon-active",
        "menu-item-icon-inactive",
      ],
      "menu-item-arrow-state": [
        "menu-item-arrow-active",
        "menu-item-arrow-inactive",
      ],
      "menu-dropdown-item-state": [
        "menu-dropdown-item-active",
        "menu-dropdown-item-inactive",
      ],
      "menu-dropdown-badge-state": [
        "menu-dropdown-badge-active",
        "menu-dropdown-badge-inactive",
      ],
      "menu-dropdown-badge-pro-state": [
        "menu-dropdown-badge-pro-active",
        "menu-dropdown-badge-pro-inactive",
      ],
      "docs-menu-item-state": [
        "docs-menu-item-active",
        "docs-menu-item-inactive",
      ],
      "docs-border-item-state": [
        "docs-border-item-active",
        "docs-border-item-inactive",
      ],
      "nav-icon-item-state": [
        "nav-icon-item-active",
        "nav-icon-item-inactive",
      ],
    },
  },
});

export function cn(...inputs: ClassValue[]) {
  return customTwMerge(clsx(...inputs));
}
