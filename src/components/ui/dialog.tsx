"use client";

import { Button } from "@/components/ui/button";
import { XIcon } from "@/icons";
import { cn } from "@/utils";
import { Dialog as DialogPrimitive } from "@base-ui/react/dialog";
import * as React from "react";

function Dialog({ ...props }: DialogPrimitive.Root.Props) {
  return <DialogPrimitive.Root data-slot="dialog" {...props} />;
}

function DialogTrigger({ ...props }: DialogPrimitive.Trigger.Props) {
  return <DialogPrimitive.Trigger data-slot="dialog-trigger" {...props} />;
}

function DialogPortal({ ...props }: DialogPrimitive.Portal.Props) {
  return <DialogPrimitive.Portal data-slot="dialog-portal" {...props} />;
}

function DialogClose({ ...props }: DialogPrimitive.Close.Props) {
  return <DialogPrimitive.Close data-slot="dialog-close" {...props} />;
}

function DialogOverlay({
  className,
  ...props
}: DialogPrimitive.Backdrop.Props) {
  return (
    <DialogPrimitive.Backdrop
      data-slot="dialog-overlay"
      className={cn(
        "fixed inset-0 isolate z-100 bg-black/50 duration-100 data-closed:animate-out data-closed:fade-out-0 data-open:animate-in data-open:fade-in-0 supports-backdrop-filter:backdrop-blur-xs dark:bg-black/70",
        className,
      )}
      {...props}
    />
  );
}

function DialogContent({
  className,
  children,
  showCloseButton = true,
  fullScreen = false,
  ...props
}: DialogPrimitive.Popup.Props & {
  showCloseButton?: boolean;
  fullScreen?: boolean;
}) {
  return (
    <DialogPortal>
      <DialogOverlay />
      <DialogPrimitive.Popup
        data-slot="dialog-content"
        className={cn(
          fullScreen
            ? "fixed inset-0 z-101 flex flex-col justify-between w-screen h-dvh max-w-none rounded-none border-none bg-white p-6 sm:p-10 text-sm text-gray-700 shadow-none duration-100 outline-none overflow-y-auto data-closed:animate-out data-closed:fade-out-0 data-open:animate-in data-open:fade-in-0 dark:bg-[#1E2635] dark:text-gray-300"
            : "fixed inset-s-1/2 top-1/2 z-101 grid w-full max-w-[calc(100%-2rem)] -translate-x-1/2 -translate-y-1/2 gap-4 rounded-2xl border border-gray-200 bg-white p-6 text-sm text-gray-700 shadow-theme-lg duration-100 outline-none data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 sm:max-w-lg rtl:translate-x-1/2 dark:border-gray-800 dark:bg-[#1E2635] dark:text-gray-300",
          className,
        )}
        {...props}
      >
        {children}
        {showCloseButton && (
          <DialogPrimitive.Close
            data-slot="dialog-close"
            render={
              <Button
                variant="ghost"
                className={cn(
                  "rounded-full text-gray-400 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white",
                  fullScreen
                    ? "absolute inset-e-4 top-4 sm:inset-e-6 sm:top-6 size-11 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700"
                    : "absolute inset-e-3 top-3",
                )}
                size={fullScreen ? "icon-lg" : "icon-sm"}
              >
                <XIcon className={fullScreen ? "size-6" : undefined} />
                <span className="sr-only">Close</span>
              </Button>
            }
          />
        )}
      </DialogPrimitive.Popup>
    </DialogPortal>
  );
}

function DialogHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="dialog-header"
      className={cn("flex flex-col gap-2", className)}
      {...props}
    />
  );
}

function DialogFooter({
  className,
  showCloseButton = false,
  children,
  ...props
}: React.ComponentProps<"div"> & {
  showCloseButton?: boolean;
}) {
  return (
    <div
      data-slot="dialog-footer"
      className={cn(
        "-mx-6 -mb-6 flex flex-col-reverse gap-3 rounded-b-2xl p-4 sm:flex-row sm:justify-end",
        className,
      )}
      {...props}
    >
      {children}
      {showCloseButton && (
        <DialogPrimitive.Close
          render={<Button variant="outline">Close</Button>}
        />
      )}
    </div>
  );
}

function DialogTitle({ className, ...props }: DialogPrimitive.Title.Props) {
  return (
    <DialogPrimitive.Title
      data-slot="dialog-title"
      className={cn(
        "text-lg font-semibold text-gray-800 dark:text-white/90",
        className,
      )}
      {...props}
    />
  );
}

function DialogDescription({
  className,
  ...props
}: DialogPrimitive.Description.Props) {
  return (
    <DialogPrimitive.Description
      data-slot="dialog-description"
      className={cn("text-sm text-gray-500 dark:text-gray-400", className)}
      {...props}
    />
  );
}

export {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
};
