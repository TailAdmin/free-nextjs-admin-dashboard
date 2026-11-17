import { useTheme } from "@/context/theme-context";
import { useMemo } from "react";

const lightColors = {
  regionFill: "#D0D5DD",
  regionStroke: "#FFFFFF",
  regionHover: "#465FFF",
  markerFill: "#465FFF",
  markerHover: "#3538CD",
  markerStroke: "#FFFFFF",
  tooltipBg: "#101828",
  tooltipText: "#FFFFFF",
  // Low -> high intensity
  heatRamp: ["#9CB9FF", "#8098F9", "#465FFF", "#3538CD"],
} as const;

const darkColors = {
  regionFill: "#344054",
  regionStroke: "#1D2939",
  regionHover: "#465FFF",
  markerFill: "#465FFF",
  markerHover: "#7592FF",
  markerStroke: "#101828",
  tooltipBg: "#344054",
  tooltipText: "#FFFFFF",
  heatRamp: ["#35459E", "#465FFF", "#7592FF", "#C2D6FF"],
} as const;

export type VectorMapColors = typeof lightColors | typeof darkColors;

/**
 * Theme-aware jsvectormap style tokens. The library draws SVG with inline
 * attributes, so colors are passed as options rather than through global CSS.
 */
export function useVectorMapTheme() {
  const { theme } = useTheme();

  return useMemo(() => {
    const isDark = theme === "dark";
    const colors: VectorMapColors = isDark ? darkColors : lightColors;

    const regionStyle = {
      initial: {
        fill: colors.regionFill,
        fillOpacity: 1,
        stroke: colors.regionStroke,
        strokeWidth: 0.5,
        strokeOpacity: 1,
      },
      hover: {
        fill: colors.regionHover,
        fillOpacity: 0.85,
        cursor: "pointer",
      },
      selected: { fill: colors.regionHover },
      selectedHover: {},
    };

    const markerStyle = {
      initial: {
        r: 5,
        fill: colors.markerFill,
        fillOpacity: 1,
        stroke: colors.markerStroke,
        strokeWidth: 2,
        strokeOpacity: 1,
      },
      hover: {
        fill: colors.markerHover,
        fillOpacity: 1,
        stroke: colors.markerStroke,
        strokeWidth: 2,
        cursor: "pointer",
      },
      selected: {},
      selectedHover: {},
    };

    return { isDark, colors, regionStyle, markerStyle };
  }, [theme]);
}
