export interface DemographicCountry {
  id: string;
  nameKey: "usa" | "france" | "yemen";
  /** ISO 3166-1 alpha-2 code used to highlight the country on the map */
  code: string;
  name: string;
  customerCount: string;
  percentage: string;
  flag: string;
  latLng: [number, number];
}

export const demographicData: DemographicCountry[] = [
  {
    id: "usa",
    nameKey: "usa",
    code: "US",
    name: "USA",
    customerCount: "2,379",
    percentage: "70.38%",
    flag: "/images/flag/usa.png",
    latLng: [37.2580397, -104.657039],
  },
  {
    id: "france",
    nameKey: "france",
    code: "FR",
    name: "France",
    customerCount: "589",
    percentage: "17.43%",
    flag: "/images/flag/france.png",
    latLng: [46.2276, 2.2137],
  },
  {
    id: "yemen",
    nameKey: "yemen",
    code: "YE",
    name: "Yemen",
    customerCount: "412",
    percentage: "12.19%",
    flag: "/images/flag/yemen.png",
    latLng: [15.5527, 48.5164],
  },
];
