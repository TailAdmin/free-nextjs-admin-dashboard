"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
import jsVectorMap from "jsvectormap";
import { useVectorMapTheme } from "@/hooks/use-vector-map-theme";
import {
  useEffect,
  useId,
  useMemo,
  useRef,
  type CSSProperties,
  type RefObject,
} from "react";

if (typeof window !== "undefined") {
  (window as unknown as { jsVectorMap: typeof jsVectorMap }).jsVectorMap =
    jsVectorMap;
}

import "jsvectormap/dist/maps/world.js";

export type VectorMapMarker = {
  name?: string;
  coords?: [number, number];
  latLng?: [number, number];
  style?: Record<string, unknown>;
  [key: string]: unknown;
};

export type VectorMapProps = {
  map?: string | Record<string, unknown>;
  containerStyle?: CSSProperties;
  containerClassName?: string;
  backgroundColor?: string;
  draggable?: boolean;
  zoomOnScroll?: boolean;
  zoomOnScrollSpeed?: number;
  zoomMax?: number;
  zoomMin?: number;
  zoomAnimate?: boolean;
  zoomStep?: number;
  zoomButtons?: boolean;
  markers?: VectorMapMarker[];
  markerStyle?: Record<string, unknown>;
  markersSelectable?: boolean;
  markersSelectableOne?: boolean;
  selectedMarkers?: Array<string | number>;
  regionStyle?: Record<string, unknown>;
  regionLabelStyle?: Record<string, unknown>;
  regionsSelectable?: boolean;
  regionsSelectableOne?: boolean;
  selectedRegions?: string[];
  labels?: Record<string, unknown>;
  lines?: unknown[];
  lineStyle?: Record<string, unknown>;
  series?: Record<string, unknown>;
  visualizeData?: Record<string, unknown>;
  focusOn?: Record<string, unknown>;
  onLoaded?: (map: unknown) => void;
  onRegionClick?: (event: MouseEvent, code: string) => void;
  onMarkerClick?: (event: MouseEvent, index: string) => void;
  onRegionSelected?: (
    code: string,
    isSelected: boolean,
    selectedRegions: string[],
  ) => void;
  onMarkerSelected?: (
    index: string,
    isSelected: boolean,
    selectedMarkers: string[],
  ) => void;
  onRegionTipShow?: (e: unknown, el: unknown, code: string) => void;
  onMarkerTipShow?: (e: unknown, el: unknown, index: number) => void;
  onRegionTooltipShow?: (
    event: MouseEvent,
    tooltip: unknown,
    code: string,
  ) => void;
  onMarkerTooltipShow?: (
    event: MouseEvent,
    tooltip: unknown,
    index: string,
  ) => void;
  onViewportChange?: (scale: number, transX: number, transY: number) => void;
  onDestroyed?: () => void;
  mapRef?: RefObject<any> | { current: any };
  style?: CSSProperties;
  className?: string;
};

export function VectorMap({
  map = "world",
  containerStyle,
  containerClassName,
  backgroundColor = "transparent",
  draggable = true,
  zoomOnScroll = false,
  zoomOnScrollSpeed,
  zoomMax = 12,
  zoomMin = 1,
  zoomAnimate = true,
  zoomStep = 1.5,
  zoomButtons = false,
  markers,
  markerStyle,
  markersSelectable,
  markersSelectableOne,
  selectedMarkers,
  regionStyle,
  regionLabelStyle,
  regionsSelectable,
  regionsSelectableOne,
  selectedRegions,
  labels,
  lines,
  lineStyle,
  series,
  visualizeData,
  focusOn,
  onLoaded,
  onRegionClick,
  onMarkerClick,
  onRegionSelected,
  onMarkerSelected,
  onRegionTipShow,
  onMarkerTipShow,
  onRegionTooltipShow,
  onMarkerTooltipShow,
  onViewportChange,
  onDestroyed,
  mapRef,
  style,
  className,
}: VectorMapProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const tooltipClass = `vm-tooltip-${useId().replace(/[^a-zA-Z0-9_-]/g, "")}`;
  const theme = useVectorMapTheme();

  // Options are serialized so inline object literals from callers don't tear
  // the map down on every render. Pass JSON-serializable values only.
  const configKey = useMemo(
    () =>
      JSON.stringify({
        backgroundColor,
        draggable,
        zoomOnScroll,
        zoomOnScrollSpeed,
        zoomMax,
        zoomMin,
        zoomAnimate,
        zoomStep,
        zoomButtons,
        markers,
        markerStyle: markerStyle ?? theme.markerStyle,
        markersSelectable,
        markersSelectableOne,
        selectedMarkers,
        regionStyle: regionStyle ?? theme.regionStyle,
        regionLabelStyle,
        regionsSelectable,
        regionsSelectableOne,
        selectedRegions,
        labels,
        lines,
        lineStyle,
        series,
        visualizeData,
        focusOn,
      }),
    [
      backgroundColor,
      draggable,
      zoomOnScroll,
      zoomOnScrollSpeed,
      zoomMax,
      zoomMin,
      zoomAnimate,
      zoomStep,
      zoomButtons,
      markers,
      markerStyle,
      markersSelectable,
      markersSelectableOne,
      selectedMarkers,
      regionStyle,
      regionLabelStyle,
      regionsSelectable,
      regionsSelectableOne,
      selectedRegions,
      labels,
      lines,
      lineStyle,
      series,
      visualizeData,
      focusOn,
      theme,
    ],
  );

  // Latest callbacks, so handler identity changes never rebuild the map.
  const handlers = {
    onLoaded,
    onRegionClick,
    onMarkerClick,
    onRegionSelected,
    onMarkerSelected,
    onRegionTipShow,
    onMarkerTipShow,
    onRegionTooltipShow,
    onMarkerTooltipShow,
    onViewportChange,
    onDestroyed,
  };
  const handlersRef = useRef(handlers);
  useEffect(() => {
    handlersRef.current = handlers;
  });

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    node.innerHTML = "";

    const config = JSON.parse(configKey) as Omit<
      VectorMapProps,
      "map" | "mapRef" | "style" | "className" | "containerStyle"
    >;

    let mapName = "world";
    if (typeof map === "string") {
      if (map === "world" || map === "worldMill" || map === "worldMerc") {
        mapName = "world";
      } else if (map === "usAea" || map === "us_aea" || map === "us_aea_en") {
        mapName = "us_aea_en";
      } else {
        mapName = map;
      }
    } else if (map && typeof map === "object") {
      const mapObj = map as {
        name?: string;
        content?: Parameters<typeof jsVectorMap.addMap>[1];
        paths?: Record<string, unknown>;
      };
      if (mapObj.name) {
        mapName = mapObj.name;
      }
      const mapData = (mapObj.content || map) as Parameters<
        typeof jsVectorMap.addMap
      >[1];
      const existingMap = (
        jsVectorMap as unknown as {
          maps?: Record<string, { paths?: unknown }>;
        }
      ).maps?.[mapName];
      if (!existingMap?.paths) {
        jsVectorMap.addMap(mapName, mapData);
      }
    }

    const normalizedMarkers = config.markers?.map((marker) => {
      const coords = marker.coords || marker.latLng || [0, 0];
      let itemStyle = marker.style;
      if (
        itemStyle &&
        typeof itemStyle === "object" &&
        !("initial" in itemStyle)
      ) {
        const { borderWidth, borderColor, ...rest } = itemStyle as Record<
          string,
          unknown
        >;
        itemStyle = {
          initial: {
            ...rest,
            ...(borderWidth !== undefined ? { strokeWidth: borderWidth } : {}),
            ...(borderColor !== undefined ? { stroke: borderColor } : {}),
          },
        };
      }
      return {
        ...marker,
        coords,
        style: itemStyle,
      };
    });

    const h = () => handlersRef.current;
    let mapInstance: any = null;

    try {
      mapInstance = new jsVectorMap({
        selector: node,
        map: mapName,
        backgroundColor: config.backgroundColor,
        draggable: config.draggable,
        zoomButtons: config.zoomButtons,
        zoomOnScroll: config.zoomOnScroll,
        ...(config.zoomOnScrollSpeed !== undefined
          ? { zoomOnScrollSpeed: config.zoomOnScrollSpeed }
          : {}),
        zoomMax: config.zoomMax,
        zoomMin: config.zoomMin,
        zoomAnimate: config.zoomAnimate,
        zoomStep: config.zoomStep,
        ...(config.markers ? { markers: normalizedMarkers as any } : {}),
        markerStyle: config.markerStyle as any,
        markersSelectable:
          config.markersSelectable ??
          Boolean(config.selectedMarkers && config.selectedMarkers.length > 0),
        ...(config.markersSelectableOne !== undefined
          ? { markersSelectableOne: config.markersSelectableOne }
          : {}),
        ...(config.selectedMarkers
          ? { selectedMarkers: config.selectedMarkers }
          : {}),
        regionStyle: config.regionStyle as any,
        ...(config.regionLabelStyle
          ? { regionLabelStyle: config.regionLabelStyle as any }
          : {}),
        regionsSelectable:
          config.regionsSelectable ??
          Boolean(config.selectedRegions && config.selectedRegions.length > 0),
        ...(config.regionsSelectableOne !== undefined
          ? { regionsSelectableOne: config.regionsSelectableOne }
          : {}),
        ...(config.selectedRegions
          ? { selectedRegions: config.selectedRegions }
          : {}),
        ...(config.labels ? { labels: config.labels as any } : {}),
        ...(config.lines ? { lines: config.lines as any } : {}),
        ...(config.lineStyle ? { lineStyle: config.lineStyle as any } : {}),
        ...(config.series ? { series: config.series as any } : {}),
        ...(config.visualizeData
          ? { visualizeData: config.visualizeData as any }
          : {}),
        ...(config.focusOn ? { focusOn: config.focusOn as any } : {}),
        onLoaded: (m: unknown) => h().onLoaded?.(m),
        onRegionClick: (e: MouseEvent, code: string) =>
          h().onRegionClick?.(e, code),
        onMarkerClick: (e: MouseEvent, index: string) =>
          h().onMarkerClick?.(e, index),
        onRegionSelected: (
          code: string,
          isSelected: boolean,
          selected: string[],
        ) => h().onRegionSelected?.(code, isSelected, selected),
        onMarkerSelected: (
          index: string,
          isSelected: boolean,
          selected: string[],
        ) => h().onMarkerSelected?.(index, isSelected, selected),
        onRegionTooltipShow: (event: any, tooltip: any, code: string) => {
          const cur = h();
          if (cur.onRegionTooltipShow) {
            cur.onRegionTooltipShow(event, tooltip, code);
          } else {
            cur.onRegionTipShow?.(event, tooltip, code);
          }
        },
        onMarkerTooltipShow: (event: any, tooltip: any, index: string) => {
          const cur = h();
          if (cur.onMarkerTooltipShow) {
            cur.onMarkerTooltipShow(event, tooltip, index);
          } else {
            cur.onMarkerTipShow?.(event, tooltip, Number(index));
          }
        },
        onViewportChange: (scale: number, x: number, y: number) =>
          h().onViewportChange?.(scale, x, y),
        onDestroyed: () => h().onDestroyed?.(),
      });

      // The tooltip lives on document.body; tag it so the scoped <style>
      // below can theme it.
      mapInstance._tooltip?._tooltip?.classList.add(tooltipClass);

      // Compatibility helpers for custom zoom buttons
      if (typeof mapInstance.setScale !== "function") {
        mapInstance.setScale = function (
          scale: number,
          anchorX?: number,
          anchorY?: number,
          isCentered?: boolean,
          animate?: boolean,
        ) {
          if (typeof (this as any)._setScale === "function") {
            (this as any)._setScale(
              scale,
              anchorX,
              anchorY,
              isCentered,
              animate,
            );
          }
        };
      }

      if (!Object.prototype.hasOwnProperty.call(mapInstance, "width")) {
        Object.defineProperty(mapInstance, "width", {
          get() {
            return (this as any)._width ?? node?.clientWidth ?? 0;
          },
          configurable: true,
        });
      }

      if (!Object.prototype.hasOwnProperty.call(mapInstance, "height")) {
        Object.defineProperty(mapInstance, "height", {
          get() {
            return (this as any)._height ?? node?.clientHeight ?? 0;
          },
          configurable: true,
        });
      }

      if (mapRef) {
        mapRef.current = mapInstance;
      }
    } catch (err) {
      console.error("Failed to initialize jsVectorMap:", err);
    }

    return () => {
      if (mapRef) {
        mapRef.current = null;
      }
      if (mapInstance) {
        try {
          mapInstance.destroy();
        } catch {
          // ignore
        }
      }
      if (node) {
        node.innerHTML = "";
      }
    };
  }, [map, configKey, mapRef, tooltipClass]);

  const combinedClassName = [containerClassName, className]
    .filter(Boolean)
    .join(" ");

  const { colors } = theme;

  return (
    <>
      <style>{`
        .${tooltipClass} {
          position: absolute;
          display: none;
          z-index: 99999;
          pointer-events: none;
          white-space: nowrap;
          padding: 4px 8px;
          border-radius: 8px;
          font: 500 12px/16px Outfit, sans-serif;
          color: ${colors.tooltipText};
          background: ${colors.tooltipBg};
          box-shadow: 0 4px 8px -2px rgba(16, 24, 40, 0.1);
        }
        .${tooltipClass}.active {
          display: block;
        }
      `}</style>
      <div
        ref={ref}
        className={combinedClassName || undefined}
        style={{ width: "100%", height: "100%", ...containerStyle, ...style }}
      />
    </>
  );
}

export default VectorMap;
