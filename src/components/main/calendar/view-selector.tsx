"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown";
import { ChevronDownIcon } from "@/icons";
import { cn } from "@/utils";
import React from "react";
import { createPortal } from "react-dom";
import { CALENDAR_VIEW_OPTIONS } from "./types";

export interface CalendarViewSelectProps {
  currentView: string;
  onViewChange: (viewKey: string) => void;
  portalNode: Element | null;
}

export default function CalendarViewSelect({
  currentView,
  onViewChange,
  portalNode,
}: CalendarViewSelectProps) {
  const activeOption =
    CALENDAR_VIEW_OPTIONS.find((v) => v.key === currentView) ||
    CALENDAR_VIEW_OPTIONS.find((v) => v.key === "dayGridMonth") ||
    CALENDAR_VIEW_OPTIONS[1];

  if (!portalNode) return null;

  return createPortal(
    <div className="calendar-view-dropdown relative">
      <DropdownMenu>
        <DropdownMenuTrigger className="calendar-view-btn group flex h-9 w-full min-w-18 items-center justify-center gap-1 rounded-lg border border-gray-300 ps-2.5 pe-1.5 text-xs font-medium text-gray-700 shadow-xs sm:min-w-20 sm:gap-1.5 sm:ps-3 sm:pe-2 sm:text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400">
          <span className="calendar-view-label">{activeOption.label}</span>
          <ChevronDownIcon className="calendar-view-chevron h-4 w-4 transition-transform duration-200 group-data-popup-open:rotate-180 sm:h-4.5 sm:w-4.5" />
        </DropdownMenuTrigger>

        <DropdownMenuContent
          align="end"
          side="bottom"
          sideOffset={6}
          className="calendar-view-menu w-36 min-w-0 max-w-[calc(100vw-32px)] gap-0.5 rounded-xl border border-gray-200 bg-white p-1.5 shadow-theme-lg sm:w-38 dark:border-gray-700 dark:bg-gray-900"
        >
          {CALENDAR_VIEW_OPTIONS.map((view) => (
            <DropdownMenuItem
              key={view.key}
              data-view-key={view.key}
              onClick={() => onViewChange(view.key)}
              className={cn(
                "calendar-view-option w-full rounded-lg px-2.5 py-1.5 text-start text-xs text-gray-700 hover:bg-gray-100 sm:text-sm dark:text-gray-300 dark:hover:bg-white/5",
                currentView === view.key
                  ? "bg-gray-100 font-medium dark:bg-white/5"
                  : "font-normal",
              )}
            >
              {view.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>,
    portalNode,
  );
}
