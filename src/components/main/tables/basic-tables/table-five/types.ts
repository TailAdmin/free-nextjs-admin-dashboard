export type AnalyticsOrderCategory =
  | "uiKits"
  | "templates"
  | "saas"
  | "UI Kits"
  | "Templates"
  | "SaaS";

export interface AnalyticsOrder {
  id: number;
  name: string;
  category: AnalyticsOrderCategory | string;
  country: string;
  cr: string;
  value: string;
}

export interface TableFiveProps {
  data?: AnalyticsOrder[];
  className?: string;
}

