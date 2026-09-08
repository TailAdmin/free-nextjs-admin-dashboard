"use client";

import { useClickOutside } from "@/hooks/useClickOutside";
import { cn } from "@/utils";
import React, { useRef, useState } from "react";
import { createPortal } from "react-dom";
import { CALENDAR_VIEW_OPTIONS } from "./types";

export interface CalendarViewSelectProps {
  currentView: string;
  onViewChange: (viewKey: string) => void;
  portalNode: Element | null;
}

const CalendarViewSelect: React.FC<CalendarViewSelectProps> = ({
  currentView,
  onViewChange,
  portalNode,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useClickOutside(dropdownRef, () => setIsOpen(false));

  const activeOption =
    CALENDAR_VIEW_OPTIONS.find((v) => v.key === currentView) ||
    CALENDAR_VIEW_OPTIONS.find((v) => v.key === "dayGridMonth") ||
    CALENDAR_VIEW_OPTIONS[1];

  const handleSelect = (viewKey: string) => {
    onViewChange(viewKey);
    setIsOpen(false);
  };

  if (!portalNode) return null;

  return createPortal(
    <div className="calendar-view-dropdown relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="calendar-view-btn flex h-9 w-full min-w-20 items-center justify-center gap-1.5 rounded-lg border border-gray-300 ps-3 pe-2 text-sm font-medium text-gray-700 shadow-xs dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        <span className="calendar-view-label">{activeOption.label}</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={cn(
            "calendar-view-chevron h-4.5 w-4.5 transition-transform duration-200",
            {
              "rotate-180": isOpen,
            },
          )}
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>

      {isOpen && (
        <div className="calendar-view-menu absolute inset-e-0 z-50 mt-1.5 w-38 space-y-0.5 rounded-xl border border-gray-200 bg-white p-1.5 shadow-lg dark:border-gray-700 dark:bg-gray-900">
          {CALENDAR_VIEW_OPTIONS.map((view) => (
            <button
              key={view.key}
              type="button"
              data-view-key={view.key}
              onClick={() => handleSelect(view.key)}
              className={cn(
                "calendar-view-option w-full rounded-lg px-2.5 py-1.5 text-start text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-white/5",
                currentView === view.key
                  ? "bg-gray-100 font-medium dark:bg-white/5"
                  : "font-normal",
              )}
            >
              {view.label}
            </button>
          ))}
        </div>
      )}
    </div>,
    portalNode,
  );
};

export default CalendarViewSelect;
