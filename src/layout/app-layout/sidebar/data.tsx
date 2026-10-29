import {
  BoxIcon,
  CalendarIcon,
  LayoutGridIcon,
  ListIcon,
  PageIcon,
  PieChartIcon,
  PluginIcon,
  TableIcon,
  UserCircleIcon,
} from "@/icons";
import type { NavItem } from "./types";

export const navItems: NavItem[] = [
  {
    icon: <LayoutGridIcon className="size-6" />,
    key: "dashboard",
    subItems: [{ key: "ecommerceHome", path: "/" }],
  },
  {
    icon: <CalendarIcon className="size-6" />,
    key: "calendar",
    path: "/calendar",
  },
  {
    icon: <UserCircleIcon className="size-6" />,
    key: "userProfile",
    path: "/profile",
  },
  {
    key: "forms",
    icon: <ListIcon className="size-6" />,
    subItems: [{ key: "formElements", path: "/form-elements", pro: false }],
  },
  {
    key: "tables",
    icon: <TableIcon className="size-6" />,
    subItems: [{ key: "basicTables", path: "/basic-tables", pro: false }],
  },
  {
    key: "pages",
    icon: <PageIcon className="size-6" />,
    subItems: [
      { key: "blankPage", path: "/blank" },
      { key: "error404", path: "/error-404" },
    ],
  },
];

export const othersItems: NavItem[] = [
  {
    icon: <PieChartIcon className="size-6" />,
    key: "charts",
    subItems: [
      { key: "lineChart", path: "/line-chart", pro: false },
      { key: "barChart", path: "/bar-chart", pro: false },
    ],
  },
  {
    icon: <BoxIcon className="size-6" />,
    key: "uiElements",
    subItems: [
      { key: "alerts", path: "/alerts" },
      { key: "avatar", path: "/avatars" },
      { key: "badge", path: "/badge" },
      { key: "buttons", path: "/buttons" },
      { key: "images", path: "/images" },
      { key: "videos", path: "/videos" },
    ],
  },
  {
    icon: <PluginIcon className="size-6" />,
    key: "authentication",
    subItems: [
      { key: "signIn", path: "/signin", pro: false },
      { key: "signUp", path: "/signup", pro: false },
    ],
  },
];

export const supportItems: NavItem[] = [];
