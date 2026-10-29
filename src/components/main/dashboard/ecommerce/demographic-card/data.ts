export interface DemographicCountry {
  id: string;
  nameKey: "usa" | "france" | "yemen" | "uk";
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
    name: "USA",
    customerCount: "2,379",
    percentage: "40.99%",
    flag: "/images/flag/usa.png",
    latLng: [37.2580397, -104.657039],
  },
  {
    id: "france",
    nameKey: "france",
    name: "France",
    customerCount: "589",
    percentage: "59.01%",
    flag: "/images/flag/france.png",
    latLng: [46.2276, 2.2137],
  },
  {
    id: "yemen",
    nameKey: "yemen",
    name: "Yeman",
    customerCount: "412",
    percentage: "32.40%",
    flag: "/images/flag/yemen.png",
    latLng: [1.3521, 103.8198],
  },
  {
    id: "uk",
    nameKey: "uk",
    name: "United Kingdom",
    customerCount: "320",
    percentage: "25.10%",
    flag: "/images/flag/japan.png",
    latLng: [55.3781, -3.436],
  },
];
