export type StatisticTab = "overview" | "sales" | "revenue";

export const monthKeys = [
  "jan",
  "feb",
  "mar",
  "apr",
  "may",
  "jun",
  "jul",
  "aug",
  "sep",
  "oct",
  "nov",
  "dec",
] as const;

export const salesData = [
  180, 190, 170, 160, 175, 165, 170, 205, 230, 210, 240, 235,
];

export const revenueData = [
  40, 30, 50, 40, 55, 40, 70, 100, 110, 120, 150, 140,
];

export const getStatisticsSeries = (
  tab: StatisticTab,
  t: (key: "sales" | "revenue") => string,
  dateRangeFactor: number = 1,
) => {
  const scaledSales = salesData.map((val) => Math.round(val * dateRangeFactor));
  const scaledRevenue = revenueData.map((val) =>
    Math.round(val * dateRangeFactor),
  );

  switch (tab) {
    case "sales":
      return [
        {
          name: t("sales"),
          data: scaledSales,
        },
      ];
    case "revenue":
      return [
        {
          name: t("revenue"),
          data: scaledRevenue,
        },
      ];
    case "overview":
    default:
      return [
        {
          name: t("sales"),
          data: scaledSales,
        },
        {
          name: t("revenue"),
          data: scaledRevenue,
        },
      ];
  }
};
