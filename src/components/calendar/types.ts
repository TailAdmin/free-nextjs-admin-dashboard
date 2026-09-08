import type { EventInput } from "@fullcalendar/react";

export type CalendarEventLevel = "Danger" | "Success" | "Primary" | "Warning";

export interface CalendarEvent extends EventInput {
  extendedProps: {
    calendar: string;
  };
}

export interface CalendarViewOption {
  key: string;
  label: string;
}

export interface EventFormData {
  title: string;
  start: string;
  end: string;
  level: string;
}

export const CALENDAR_EVENT_LEVELS: Record<CalendarEventLevel, string> = {
  Danger: "danger",
  Success: "success",
  Primary: "primary",
  Warning: "warning",
};

export const CALENDAR_VIEW_OPTIONS: CalendarViewOption[] = [
  { key: "multiMonthYear", label: "Year" },
  { key: "dayGridMonth", label: "Month" },
  { key: "timeGridWeek", label: "Week" },
  { key: "timeGridDay", label: "Day" },
];
