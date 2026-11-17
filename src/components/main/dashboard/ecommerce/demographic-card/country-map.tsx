"use client";

import VectorMap, {
  type VectorMapMarker,
} from "@/components/common/vector-map";
import { useVectorMapTheme } from "@/hooks/use-vector-map-theme";
import { useMemo } from "react";

export type Marker = VectorMapMarker;

interface CountryMapProps {
  markers?: Marker[];
  /** ISO country codes tinted on the map */
  highlightedRegions?: string[];
}

// Region, marker and tooltip colors come from the theme-aware defaults in
// the shared VectorMap wrapper; highlighted countries use the heat ramp.
export default function CountryMap({
  markers,
  highlightedRegions,
}: CountryMapProps) {
  const { colors } = useVectorMapTheme();

  const series = useMemo(
    () =>
      highlightedRegions?.length
        ? {
            regions: [
              {
                attribute: "fill",
                scale: { highlight: colors.heatRamp[0] },
                values: Object.fromEntries(
                  highlightedRegions.map((code) => [code, "highlight"]),
                ),
              },
            ],
          }
        : undefined,
    [colors, highlightedRegions],
  );

  return <VectorMap map="world" markers={markers} series={series} />;
}
