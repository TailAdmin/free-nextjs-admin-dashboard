"use client";

import CardHeader from "./card-header";
import CountryList from "./country-list";
import CountryMap, { Marker } from "./country-map";
import { demographicData } from "./data";

export default function DemographicCard() {
  const mapMarkers: Marker[] = demographicData.map((country) => ({
    latLng: country.latLng,
    name: country.name,
    style: {
      fill: "#465FFF",
      borderWidth: 1,
      borderColor: "white",
    },
  }));

  return (
    <div className="h-full rounded-2xl border border-gray-200 bg-white p-5 sm:p-6 dark:border-gray-800 dark:bg-white/3">
      <CardHeader />

      <div className="my-6 overflow-hidden rounded-2xl border border-gray-200 bg-gray-50 px-4 py-6 sm:px-6 dark:border-gray-800 dark:bg-gray-900">
        <div
          id="mapOne"
          className="mapOne map-btn -mx-4 -my-6 h-53 w-63 2xsm:w-76.75 xsm:w-89.5 sm:-mx-6 md:w-167 lg:w-158.5 xl:w-98.25 2xl:w-138.5"
        >
          <CountryMap markers={mapMarkers} />
        </div>
      </div>

      <CountryList />
    </div>
  );
}
