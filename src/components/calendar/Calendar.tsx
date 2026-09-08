"use client";

import { useModal } from "@/hooks/useModal";
import { isRtl } from "@/i18n/languages";
import type { Locale } from "@/i18n/routing";
import type {
  DateSelectInfo,
  EventClickInfo,
  EventDisplayInfo,
} from "@fullcalendar/react";
import FullCalendar, { CalendarRef } from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/react/daygrid";
import interactionPlugin from "@fullcalendar/react/interaction";
import multiMonthPlugin from "@fullcalendar/react/multimonth";
import themePlugin from "@fullcalendar/react/themes/classic";
import timeGridPlugin from "@fullcalendar/react/timegrid";
import { useLocale } from "next-intl";
import React, { useEffect, useRef, useState } from "react";
import CalendarEventItem from "./CalendarEventItem";
import CalendarEventModal from "./CalendarEventModal";
import CalendarViewSelect from "./CalendarViewSelect";
import {
  BookmarkIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CloseIcon,
} from "./icons";
import type { CalendarEvent, EventFormData } from "./types";

const INITIAL_EVENTS: CalendarEvent[] = [
  {
    id: "1",
    title: "Event Conf.",
    start: new Date().toISOString().split("T")[0],
    extendedProps: { calendar: "Danger" },
  },
  {
    id: "2",
    title: "Meeting",
    start: new Date(Date.now() + 86400000).toISOString().split("T")[0],
    extendedProps: { calendar: "Success" },
  },
  {
    id: "3",
    title: "Workshop",
    start: new Date(Date.now() + 172800000).toISOString().split("T")[0],
    end: new Date(Date.now() + 259200000).toISOString().split("T")[0],
    extendedProps: { calendar: "Primary" },
  },
];

const Calendar: React.FC = () => {
  const locale = useLocale();
  const isRtlLayout = isRtl(locale as Locale);

  const [events, setEvents] = useState<CalendarEvent[]>(INITIAL_EVENTS);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(
    null,
  );
  const [selectedStartDate, setSelectedStartDate] = useState("");
  const [selectedEndDate, setSelectedEndDate] = useState("");
  const [currentView, setCurrentView] = useState("dayGridMonth");
  const [portalNode, setPortalNode] = useState<Element | null>(null);

  const calendarRef = useRef<CalendarRef>(null);
  const calendarContainerRef = useRef<HTMLDivElement>(null);
  const { isOpen, openModal, closeModal } = useModal();

  const handleViewChange = (viewKey: string) => {
    setCurrentView(viewKey);
    calendarRef.current?.getApi()?.changeView(viewKey);
  };

  const handleOpenAddModal = () => {
    const currentDate = new Date();
    const yyyy = currentDate.getFullYear();
    const mm = String(currentDate.getMonth() + 1).padStart(2, "0");
    const dd = String(currentDate.getDate()).padStart(2, "0");
    const combineDate = `${yyyy}-${mm}-${dd}`;

    setSelectedEvent(null);
    setSelectedStartDate(combineDate);
    setSelectedEndDate(combineDate);
    openModal();
  };

  const handleDateSelect = (selectInfo: DateSelectInfo) => {
    const startStr = selectInfo.startStr
      ? selectInfo.startStr.split("T")[0]
      : "";
    const endStr = selectInfo.endStr
      ? selectInfo.endStr.split("T")[0]
      : startStr;

    setSelectedEvent(null);
    setSelectedStartDate(startStr);
    setSelectedEndDate(endStr);
    openModal();
  };

  const handleEventClick = (clickInfo: EventClickInfo) => {
    const event = clickInfo.event;
    if (event.url) {
      window.open(event.url);
      clickInfo.jsEvent?.preventDefault();
      return;
    }

    const startStr = event.startStr ? event.startStr.split("T")[0] : "";
    const endStr = event.endStr ? event.endStr.split("T")[0] : startStr;

    setSelectedEvent({
      id: event.id,
      title: event.title,
      start: event.startStr,
      end: event.endStr,
      extendedProps: { calendar: event.extendedProps?.calendar || "Primary" },
    });
    setSelectedStartDate(startStr);
    setSelectedEndDate(endStr);
    openModal();
  };

  const handleSaveEvent = (formData: EventFormData) => {
    const titleVal =
      formData.title.trim() || (selectedEvent ? "Event" : "New Event");
    const startDateVal = formData.start;
    const endDateVal = formData.end || startDateVal;
    const levelVal = formData.level || "Primary";

    if (selectedEvent) {
      setEvents((prevEvents) =>
        prevEvents.map((ev) =>
          String(ev.id) === String(selectedEvent.id)
            ? {
                ...ev,
                title: titleVal,
                start: startDateVal,
                end: endDateVal || startDateVal,
                extendedProps: { calendar: levelVal },
              }
            : ev,
        ),
      );
    } else {
      const newEvent: CalendarEvent = {
        id: Date.now().toString(),
        title: titleVal,
        start: startDateVal,
        end: endDateVal || startDateVal,
        allDay: true,
        extendedProps: { calendar: levelVal },
      };
      setEvents((prevEvents) => [...prevEvents, newEvent]);
    }
    closeModal();
  };

  useEffect(() => {
    const frameId = requestAnimationFrame(() => {
      const el = calendarContainerRef.current?.querySelector(
        ".ta-toolbar-section:last-child",
      );
      if (el) {
        setPortalNode(el);
      }
    });
    return () => cancelAnimationFrame(frameId);
  }, [isRtlLayout]);

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/3">
      <div className="custom-calendar relative" ref={calendarContainerRef}>
        <FullCalendar
          key={isRtlLayout ? "rtl" : "ltr"}
          ref={calendarRef}
          plugins={[
            themePlugin,
            dayGridPlugin,
            timeGridPlugin,
            interactionPlugin,
            multiMonthPlugin,
          ]}
          initialView="dayGridMonth"
          direction={isRtlLayout ? "rtl" : "ltr"}
          // Toolbar Header configuration
          headerToolbar={{
            start: "prev,next addEventButton",
            center: "title",
            end: "",
          }}
          headerToolbarClass="sticky top-0! flex-col gap-4 z-20! [padding-inline:24px]! pt-6 sm:flex-row"
          toolbarTitleClass="text-lg! font-medium! text-gray-800 dark:text-white/90"
          toolbarSectionClass="ta-toolbar-section"
          buttonGroupClass="gap-2"
          buttons={{
            prev: {
              iconContent: () => (
                <ChevronLeftIcon className="size-6 bg-transparent text-gray-700 rtl:rotate-180 dark:text-gray-400" />
              ),
              className:
                "flex size-10! p-0! items-center justify-center! rounded-lg! border! bg-transparent! border-gray-200! text-gray-700 hover:border-gray-200 hover:bg-gray-50! focus:shadow-none active:border-gray-200! active:bg-transparent! active:shadow-none! dark:border-gray-800! dark:text-gray-400 dark:hover:border-gray-800 dark:hover:bg-gray-900! dark:active:border-gray-800!",
            },
            next: {
              iconContent: () => (
                <ChevronRightIcon className="size-6 bg-transparent text-gray-700 rtl:rotate-180 dark:text-gray-400" />
              ),
              className:
                "flex size-10! p-0! items-center justify-center! rounded-lg! border! bg-transparent! border-gray-200! text-gray-700 hover:border-gray-200 hover:bg-gray-50! focus:shadow-none active:border-gray-200! active:bg-transparent! active:shadow-none! dark:border-gray-800! dark:text-gray-400 dark:hover:border-gray-800 dark:hover:bg-gray-900! dark:active:border-gray-800!",
            },
            addEventButton: {
              text: "Add Event +",
              click: () => handleOpenAddModal(),
              className:
                "rounded-lg! border-0! bg-brand-500! px-4! py-2.5! text-sm! font-medium! text-white hover:bg-brand-600! focus:shadow-none! w-auto!",
            },
          }}
          // View configurations
          views={{
            multiMonthYear: {
              aspectRatio: 1.2,
              contentHeight: "auto",
              height: "auto",
              multiMonthMaxColumns: 3,
              tableClass: "overflow-hidden! rounded-lg!",
              singleMonthMinWidth: 320,
              showNonCurrentDates: true,
              singleMonthHeaderInnerClass:
                "text-sm font-medium! text-gray-800 dark:text-white/90",
              dayHeaderClass: (data: any) =>
                data.inPopover
                  ? "relative! border-b! border-gray-200! bg-gray-50/70! px-4! py-3! text-start! dark:border-gray-800! dark:bg-gray-800/50!"
                  : "border-0! bg-gray-50 py-2! dark:bg-gray-900",
              dayHeaderInnerClass: (data: any) =>
                data.inPopover
                  ? "text-sm! font-semibold! text-gray-800! dark:text-white/90!"
                  : "py-1 text-xs font-medium text-gray-400 uppercase",
              dayCellClass: (data: any) => {
                if (data.inPopover) return "bg-transparent! p-3!";
                let cls = "relative! p-0.5 sm:p-1!";
                if (data.isToday)
                  cls += " isolate bg-gray-100! font-semibold text-brand-500";
                if (data.isOther) cls += " bg-transparent!";
                return cls;
              },
              dayCellInnerClass: (data: any) =>
                data.inPopover
                  ? "flex custom-scrollbar max-h-60 flex-col gap-1.5 overflow-y-auto"
                  : "",
              dayCellTopInnerClass: "text-sm!",
              dayMaxEvents: 0,
              rowMoreLinkClass:
                "absolute! -top-1! -start-0.5! z-10! border-0! bg-transparent! p-0!",
              rowMoreLinkInnerClass: "overflow-visible!",
              moreLinkContent() {
                return (
                  <span>
                    <BookmarkIcon className="size-5.5 text-brand-500" />
                  </span>
                );
              },
            },
            dayGridMonth: {
              dayMaxEvents: 2,
              dayHeaderAlign: (data: any) =>
                data.inPopover ? "start" : "center",
              dayHeaderClass: (data: any) =>
                data.inPopover
                  ? "relative! border-b! border-gray-200! bg-gray-50/70! px-4! py-3! text-start! dark:border-gray-800! dark:bg-gray-800/50!"
                  : "border-x-0! border-t border-gray-200! bg-gray-50 dark:border-gray-800! dark:bg-gray-900",
              dayHeaderInnerClass: (data: any) =>
                data.inPopover
                  ? "text-sm! font-semibold! text-gray-800! dark:text-white/90!"
                  : "px-5! py-4! text-sm font-medium text-gray-400 uppercase",
              dayCellClass: (data: any) => {
                if (data.inPopover) return "bg-transparent! p-3!";
                return `bg-transparent! p-2! ${
                  data.isToday ? "bg-gray-100! dark:bg-gray-800/40!" : ""
                }`;
              },
              dayCellInnerClass: (data: any) => {
                if (data.inPopover)
                  return "flex custom-scrollbar max-h-60 flex-col gap-1.5 overflow-y-auto";
                return data.isToday ? "rounded-sm!" : "";
              },
              moreLinkClass:
                "border-0! bg-transparent! p-0! hover:bg-transparent! focus:outline-none",
              moreLinkContent(args: any) {
                return (
                  <span className="fc-more-link-badge inline-flex items-center rounded-sm bg-brand-50 px-1.5 py-0.5 text-xs font-medium text-brand-600 transition-colors hover:bg-brand-100 dark:bg-brand-500/15 dark:text-brand-400 dark:hover:bg-brand-500/25">
                    +{args.num} more
                  </span>
                );
              },
            },
            timeGridWeek: {
              slotDuration: "01:00:00",
              slotMinHeight: 56,
              allDaySlot: true,
              dayHeaderContent: (arg: any) => {
                const weekday = new Intl.DateTimeFormat(locale, {
                  weekday: "short",
                })
                  .format(arg.date)
                  .toUpperCase();
                const day = new Intl.DateTimeFormat(locale, {
                  day: "numeric",
                }).format(arg.date);
                return `${weekday} - ${day}`;
              },
              dayHeaderClass: (data: any) =>
                `border-0! bg-gray-50! dark:bg-gray-900! ${
                  data.isToday ? "bg-gray-100/70! dark:bg-gray-800/60!" : ""
                }`,
              dayHeaderInnerClass: (data: any) =>
                `px-3! py-3.5! text-center! text-xs! font-medium! text-gray-500! uppercase! dark:text-gray-400! ${
                  data.isToday
                    ? "font-semibold! text-brand-500! dark:text-brand-400!"
                    : ""
                }`,
              slotHeaderDividerClass:
                "border-e! border-s-0! border-y-0! border-gray-200! dark:border-gray-800!",
              slotHeaderClass:
                "px-3! py-2! text-start! text-xs! font-medium! text-gray-400! dark:text-gray-500!",
              slotLaneClass: "border-gray-100! dark:border-gray-800/60!",
              dayLaneClass: (data: any) =>
                `border-gray-200! dark:border-gray-800! ${
                  data.isToday
                    ? "bg-brand-50/15! dark:bg-brand-500/[0.03]!"
                    : ""
                }`,
              allDayDividerClass:
                "border-b! border-t-0! border-x-0! border-gray-200! p-0! bg-transparent! dark:border-gray-800!",
              allDayHeaderClass:
                "border-0! bg-gray-50! text-xs! font-medium! text-gray-500! dark:border-0! dark:bg-gray-900! dark:text-gray-400!",
            },
            timeGridDay: {
              slotDuration: "00:30:00",
              slotMinHeight: 48,
              allDaySlot: true,
              dayHeaderContent: (arg: any) => {
                const weekday = new Intl.DateTimeFormat(locale, {
                  weekday: "short",
                })
                  .format(arg.date)
                  .toUpperCase();
                const day = new Intl.DateTimeFormat(locale, {
                  day: "numeric",
                }).format(arg.date);
                return `${weekday} - ${day}`;
              },
              dayHeaderClass: (data: any) =>
                `border-0! bg-gray-50! dark:bg-gray-900! ${
                  data.isToday ? "bg-gray-100/70! dark:bg-gray-800/60!" : ""
                }`,
              dayHeaderInnerClass: (data: any) =>
                `px-4! py-3.5! text-center! text-xs! font-medium! text-gray-500! uppercase! dark:text-gray-400! ${
                  data.isToday
                    ? "font-semibold! text-brand-500! dark:text-brand-400!"
                    : ""
                }`,
              slotHeaderDividerClass:
                "border-e! border-s-0! border-y-0! border-gray-200! dark:border-gray-800!",
              slotHeaderClass:
                "px-3! py-2! text-start! text-xs! font-medium! text-gray-400! dark:text-gray-500!",
              slotLaneClass: "border-gray-100! dark:border-gray-800/60!",
              dayLaneClass: (data: any) =>
                `border-gray-200! dark:border-gray-800! ${
                  data.isToday
                    ? "bg-brand-50/15! dark:bg-brand-500/[0.03]!"
                    : ""
                }`,
              allDayDividerClass:
                "border-b! border-t-0! border-x-0! border-gray-200! p-0! bg-transparent! dark:border-gray-800!",
              allDayHeaderClass:
                "border-0! bg-gray-50! text-xs! font-medium! text-gray-500! dark:border-0! dark:bg-gray-900! dark:text-gray-400!",
            },
          }}
          // Body configuration
          height="auto"
          borderless={true}
          viewClass="border-t! border-b-0! border-x-0! border-gray-200! dark:border-gray-800!"
          dayHeaderDividerClass="border-b! border-t-0! border-x-0! border-gray-200! p-0! bg-transparent! dark:border-gray-800!"
          slotMinHeight={56}
          slotHeaderDividerClass="border-e! border-s-0! border-y-0! border-gray-200! dark:border-gray-800!"
          allDayDividerClass="border-b! border-t-0! border-x-0! border-gray-200! p-0! bg-transparent! dark:border-gray-800!"
          eventClass="focus:shadow-none"
          nowIndicator={false}
          columnEventClass="bg-transparent! border-0! p-1! shadow-none! hover:shadow-none! focus:outline-none"
          columnEventInnerClass="p-0! border-0! bg-transparent! h-full"
          tableHeaderSticky={true}
          tableClass="overflow-hidden"
          rowEventClass="bg-transparent! border-0! px-1! py-0.5! shadow-none! hover:shadow-none! focus:outline-none"
          rowEventInnerClass="p-0! border-0! bg-transparent!"
          popoverFormat={{ month: "short", day: "numeric", year: "numeric" }}
          popoverClass="z-99999! w-72 max-w-[calc(100vw-32px)] overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-theme-lg dark:border-gray-800 dark:bg-gray-900"
          popoverCloseClass="absolute end-3 top-2.5 flex size-7 cursor-pointer items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 focus:outline-none dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-white"
          popoverCloseContent={() => <CloseIcon className="size-4" />}
          datesSet={(arg) => {
            setCurrentView(arg.view.type);
            requestAnimationFrame(() => {
              const chunk = calendarContainerRef.current?.querySelector(
                ".ta-toolbar-section:last-child",
              );
              if (chunk) {
                setPortalNode(chunk);
              }
            });
          }}
          selectable={true}
          events={events}
          select={handleDateSelect}
          eventClick={handleEventClick}
          eventContent={(eventInfo: EventDisplayInfo) => (
            <CalendarEventItem eventInfo={eventInfo} />
          )}
        />

        <CalendarViewSelect
          currentView={currentView}
          onViewChange={handleViewChange}
          portalNode={portalNode}
        />
      </div>

      <CalendarEventModal
        isOpen={isOpen}
        onClose={closeModal}
        selectedEvent={selectedEvent}
        initialStartDate={selectedStartDate}
        initialEndDate={selectedEndDate}
        onSave={handleSaveEvent}
      />
    </div>
  );
};

export default Calendar;
