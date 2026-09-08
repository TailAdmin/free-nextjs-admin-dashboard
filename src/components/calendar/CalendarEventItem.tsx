import { cn } from "@/utils";
import type { EventDisplayInfo } from "@fullcalendar/react";
import React from "react";

export interface CalendarEventItemProps {
  eventInfo: EventDisplayInfo;
}

const CalendarEventItem: React.FC<CalendarEventItemProps> = ({ eventInfo }) => {
  const calendarLevel = (
    eventInfo.event.extendedProps?.calendar || "primary"
  ).toLowerCase();

  // Color mappings
  const colorMap: Record<
    string,
    { bg: string; dot: string; title: string; time: string }
  > = {
    success: {
      bg: "border border-success-100 bg-success-50 dark:border-success-500/20 dark:bg-success-500/15",
      dot: "bg-success-500",
      title: "text-success-700 dark:text-success-400",
      time: "text-success-600/80 dark:text-success-400/80",
    },
    danger: {
      bg: "border border-error-100 bg-error-50 dark:border-error-500/20 dark:bg-error-500/15",
      dot: "bg-error-500",
      title: "text-error-700 dark:text-error-400",
      time: "text-error-600/80 dark:text-error-400/80",
    },
    primary: {
      bg: "border border-brand-100 bg-brand-50 dark:border-brand-500/20 dark:bg-brand-500/15",
      dot: "bg-brand-500",
      title: "text-brand-700 dark:text-brand-400",
      time: "text-brand-600/80 dark:text-brand-400/80",
    },
    warning: {
      bg: "border border-orange-100 bg-orange-50 dark:border-orange-500/20 dark:bg-orange-500/15",
      dot: "bg-orange-500",
      title: "text-orange-700 dark:text-orange-400",
      time: "text-orange-600/80 dark:text-orange-400/80",
    },
  };

  const colors = colorMap[calendarLevel] ?? colorMap.primary;
  const isTimeGridView =
    !eventInfo.event?.allDay &&
    eventInfo.view?.type &&
    eventInfo.view.type.startsWith("timeGrid");

  if (isTimeGridView) {
    return (
      <div
        dir="ltr"
        className={cn(
          "event-fc-color flex h-full w-full flex-col justify-start overflow-hidden rounded-lg p-1.5 transition-colors",
          colors.bg,
        )}
      >
        <div className="flex items-center gap-1.5">
          <div className={cn("size-2 shrink-0 rounded-full", colors.dot)} />
          <div
            className={cn(
              "truncate text-xs leading-tight font-semibold",
              colors.title,
            )}
          >
            {eventInfo.event.title || ""}
          </div>
        </div>
        {eventInfo.timeText && (
          <div
            className={cn(
              "mt-0.5 truncate ps-3.5 text-[11px] leading-tight font-medium",
              colors.time,
            )}
          >
            {eventInfo.timeText}
          </div>
        )}
      </div>
    );
  }

  return (
    <div
      dir="ltr"
      className={cn(
        "event-fc-color flex items-center rounded-lg py-1.5 ps-2.5 pe-3 transition-colors",
        colors.bg,
      )}
    >
      <div
        className={cn(
          "fc-daygrid-event-dot ms-0 me-2 h-3.5 w-1 shrink-0 rounded-full border-none",
          colors.dot,
        )}
      />
      {eventInfo.timeText && (
        <div className="fc-event-time me-1.5 p-0 text-xs font-normal text-gray-500 dark:text-gray-400">
          {eventInfo.timeText}
        </div>
      )}
      <div className="fc-event-title truncate p-0 text-xs font-medium text-gray-700 dark:text-white">
        {eventInfo.event.title || ""}
      </div>
    </div>
  );
};

export default CalendarEventItem;
