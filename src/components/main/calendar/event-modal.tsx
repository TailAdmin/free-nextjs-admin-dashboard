"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import flatpickr from "flatpickr";
import React, { useEffect, useRef, useState } from "react";
import { CloseIcon } from "./icons";
import type { CalendarEvent, EventFormData } from "./types";

export interface CalendarEventModalProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  isOpen?: boolean;
  onClose?: () => void;
  selectedEvent: CalendarEvent | null;
  initialStartDate?: string;
  initialEndDate?: string;
  onSave: (data: EventFormData) => void;
}

const EVENT_COLORS = [
  "Primary",
  "Danger",
  "Success",
  "Warning",
  "Info",
] as const;

export default function CalendarEventModal({
  open,
  onOpenChange,
  isOpen,
  onClose,
  selectedEvent,
  initialStartDate = "",
  initialEndDate = "",
  onSave,
}: CalendarEventModalProps) {
  const isModalOpen = open ?? isOpen ?? false;
  const handleOpenChange = (nextOpen: boolean) => {
    onOpenChange?.(nextOpen);
    if (!nextOpen) {
      onClose?.();
    }
  };

  const [eventTitle, setEventTitle] = useState("");
  const [eventStartDate, setEventStartDate] = useState("");
  const [eventEndDate, setEventEndDate] = useState("");
  const [eventLevel, setEventLevel] = useState("Primary");

  const startDateInputRef = useRef<HTMLInputElement>(null);
  const endDateInputRef = useRef<HTMLInputElement>(null);
  const startPickerRef = useRef<flatpickr.Instance | null>(null);
  const endPickerRef = useRef<flatpickr.Instance | null>(null);

  const [prevSyncState, setPrevSyncState] = useState({
    selectedEvent,
    initialStartDate,
    initialEndDate,
    isOpen: isModalOpen,
  });

  if (
    prevSyncState.selectedEvent !== selectedEvent ||
    prevSyncState.initialStartDate !== initialStartDate ||
    prevSyncState.initialEndDate !== initialEndDate ||
    prevSyncState.isOpen !== isModalOpen
  ) {
    setPrevSyncState({
      selectedEvent,
      initialStartDate,
      initialEndDate,
      isOpen: isModalOpen,
    });
    if (selectedEvent) {
      setEventTitle((selectedEvent.title as string) || "");
      const startStr =
        typeof selectedEvent.start === "string"
          ? selectedEvent.start.split("T")[0]
          : selectedEvent.start instanceof Date
            ? selectedEvent.start.toISOString().split("T")[0]
            : "";
      const endStr =
        typeof selectedEvent.end === "string"
          ? selectedEvent.end.split("T")[0]
          : selectedEvent.end instanceof Date
            ? selectedEvent.end.toISOString().split("T")[0]
            : "";
      setEventStartDate(startStr);
      setEventEndDate(endStr || startStr);
      setEventLevel(selectedEvent.extendedProps?.calendar || "Primary");
    } else {
      setEventTitle("");
      setEventStartDate(initialStartDate);
      setEventEndDate(initialEndDate || initialStartDate);
      setEventLevel("Primary");
    }
  }

  const initialDatesRef = useRef({ eventStartDate, eventEndDate });

  useEffect(() => {
    initialDatesRef.current = { eventStartDate, eventEndDate };
  }, [eventStartDate, eventEndDate]);

  // Initialize and tear down flatpickr instances when modal is open
  useEffect(() => {
    if (!isModalOpen) {
      if (startPickerRef.current) {
        startPickerRef.current.destroy();
        startPickerRef.current = null;
      }
      if (endPickerRef.current) {
        endPickerRef.current.destroy();
        endPickerRef.current = null;
      }
      return;
    }

    const prevArrowSvg =
      '<svg class="stroke-current rtl:rotate-180" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12.5 15L7.5 10L12.5 5" stroke="" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';
    const nextArrowSvg =
      '<svg class="stroke-current rtl:rotate-180" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M7.5 15L12.5 10L7.5 5" stroke="" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';

    const timer = setTimeout(() => {
      if (startDateInputRef.current && !startPickerRef.current) {
        const fp = flatpickr(startDateInputRef.current, {
          dateFormat: "Y-m-d",
          defaultDate: initialDatesRef.current.eventStartDate || undefined,
          monthSelectorType: "static",
          static: true,
          clickOpens: true,
          prevArrow: prevArrowSvg,
          nextArrow: nextArrowSvg,
          onChange: (_dates, dateStr) => {
            setEventStartDate(dateStr);
          },
        });
        startPickerRef.current = Array.isArray(fp) ? fp[0] : fp;
      }

      if (endDateInputRef.current && !endPickerRef.current) {
        const fp = flatpickr(endDateInputRef.current, {
          dateFormat: "Y-m-d",
          defaultDate: initialDatesRef.current.eventEndDate || undefined,
          monthSelectorType: "static",
          static: true,
          clickOpens: true,
          prevArrow: prevArrowSvg,
          nextArrow: nextArrowSvg,
          onChange: (_dates, dateStr) => {
            setEventEndDate(dateStr);
          },
        });
        endPickerRef.current = Array.isArray(fp) ? fp[0] : fp;
      }
    }, 10);

    return () => {
      clearTimeout(timer);
      if (startPickerRef.current) {
        startPickerRef.current.destroy();
        startPickerRef.current = null;
      }
      if (endPickerRef.current) {
        endPickerRef.current.destroy();
        endPickerRef.current = null;
      }
    };
  }, [isModalOpen]);

  // Keep flatpickr dates in sync if eventStartDate/eventEndDate changes externally
  useEffect(() => {
    if (startPickerRef.current && eventStartDate) {
      startPickerRef.current.setDate(eventStartDate, false);
    }
  }, [eventStartDate]);

  useEffect(() => {
    if (endPickerRef.current && eventEndDate) {
      endPickerRef.current.setDate(eventEndDate, false);
    }
  }, [eventEndDate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const titleVal =
      eventTitle.trim() || (selectedEvent ? "Event" : "New Event");
    const startDateVal = eventStartDate;
    const endDateVal = eventEndDate || startDateVal;
    const levelVal = eventLevel || "Primary";

    onSave({
      title: titleVal,
      start: startDateVal,
      end: endDateVal,
      level: levelVal,
    });
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={handleOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="overflow-visible border-none bg-transparent p-0 shadow-none sm:max-w-175"
      >
        <Card className="relative w-full rounded-3xl border border-gray-200 bg-white p-6 shadow-theme-lg sm:p-11 dark:border-gray-800 dark:bg-[#1E2635]">
          {/* Top-end circular close button (Figma large design) */}
          <DialogClose
            render={
              <Button
                variant="ghost"
                size="icon-lg"
                className="absolute inset-e-6 top-6 hidden size-11 rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-800 sm:flex dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
              >
                <CloseIcon className="size-6" />
                <span className="sr-only">Close</span>
              </Button>
            }
          />

          {/* Title and subtitle */}
          <div className="flex flex-col gap-2">
            <DialogTitle className="text-title-lg leading-8 font-semibold text-gray-800 sm:text-2xl dark:text-white/90">
              Add / Edit Event
            </DialogTitle>
            <DialogDescription className="text-sm leading-5 font-normal text-gray-500 dark:text-gray-400">
              Plan your next big moment: schedule or edit an event to stay on
              track
            </DialogDescription>
          </div>

          {/* Form fields */}
          <form
            onSubmit={handleSubmit}
            className="mt-6 space-y-5 sm:mt-8 sm:space-y-6"
          >
            {/* Event Title */}
            <div>
              <Label
                htmlFor="event-title"
                className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Event Title
              </Label>
              <Input
                id="event-title"
                value={eventTitle}
                onChange={(e) => setEventTitle(e.target.value)}
                className="h-11 rounded-[10px]"
              />
            </div>

            {/* Event Color */}
            <div>
              <Label className="mb-3 block text-sm font-medium text-gray-700 sm:mb-4 dark:text-gray-300">
                Event Color
              </Label>
              <RadioGroup
                value={eventLevel}
                onValueChange={(val) => setEventLevel(val)}
                className="flex flex-wrap items-center gap-4 sm:gap-5"
              >
                {EVENT_COLORS.map((color) => (
                  <div key={color} className="flex items-center gap-2">
                    <RadioGroupItem
                      value={color}
                      id={`modal-color-${color.toLowerCase()}`}
                    />
                    <Label
                      htmlFor={`modal-color-${color.toLowerCase()}`}
                      className="cursor-pointer text-sm font-normal text-gray-700 dark:text-gray-400"
                    >
                      {color}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            {/* Enter Start Date */}
            <div>
              <Label
                htmlFor="event-start-date"
                className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Enter Start Date
              </Label>
              <Input
                ref={startDateInputRef}
                id="event-start-date"
                placeholder="dd/mm/yyyy"
                value={eventStartDate}
                onChange={(e) => setEventStartDate(e.target.value)}
                className="h-11 rounded-[10px]"
              />
            </div>

            {/* Enter End Date */}
            <div>
              <Label
                htmlFor="event-end-date"
                className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Enter End Date
              </Label>
              <Input
                ref={endDateInputRef}
                id="event-end-date"
                placeholder="dd/mm/yyyy"
                value={eventEndDate}
                onChange={(e) => setEventEndDate(e.target.value)}
                className="h-11 rounded-[10px]"
              />
            </div>

            {/* Action buttons (Small: 2 columns full-width, Large: right-aligned) */}
            <div className="grid grid-cols-2 gap-3 pt-2 sm:flex sm:justify-end sm:pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => handleOpenChange(false)}
                className="h-11 w-full rounded-[10px] px-5 py-3 sm:w-auto"
              >
                Close
              </Button>
              <Button
                type="submit"
                className="h-11 w-full rounded-[10px] px-5 py-3 sm:w-auto"
              >
                {selectedEvent ? "Save Changes" : "Add Event"}
              </Button>
            </div>
          </form>
        </Card>
      </DialogContent>
    </Dialog>
  );
}
