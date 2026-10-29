"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { changePasswordSchema } from "./schema";
import type { ChangePasswordFormData, ChangePasswordModalProps } from "./types";

export default function ChangePasswordModal({
  isOpen,
  onOpenChange,
  onSubmitSuccess,
}: ChangePasswordModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
    mode: "onTouched",
  });

  useEffect(() => {
    if (isOpen) {
      reset({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    }
  }, [isOpen, reset]);

  const onSubmit = (data: ChangePasswordFormData) => {
    onSubmitSuccess?.(data);
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[calc(100%-2rem)] rounded-3xl p-6 sm:max-w-146 sm:p-10">
        <DialogHeader className="gap-2 pe-14 text-start">
          <DialogTitle className="text-xl sm:text-2xl font-semibold text-gray-800 dark:text-white/90">
            Change Password
          </DialogTitle>
          <DialogDescription className="text-sm text-gray-500 dark:text-gray-400">
            Use a strong password to protect your account
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
          <Field data-invalid={Boolean(errors.currentPassword)} className="gap-1.5">
            <FieldLabel>Current Password</FieldLabel>
            <Input
              type="password"
              {...register("currentPassword")}
              placeholder="Enter current password"
              aria-invalid={errors.currentPassword ? "true" : undefined}
            />
            <FieldError errors={[errors.currentPassword]} />
          </Field>

          <Field data-invalid={Boolean(errors.newPassword)} className="gap-1.5">
            <FieldLabel>New Password</FieldLabel>
            <Input
              type="password"
              {...register("newPassword")}
              placeholder="Enter new password"
              aria-invalid={errors.newPassword ? "true" : undefined}
            />
            <FieldError errors={[errors.newPassword]} />
          </Field>

          <Field data-invalid={Boolean(errors.confirmPassword)} className="gap-1.5">
            <FieldLabel>Confirm Password</FieldLabel>
            <Input
              type="password"
              {...register("confirmPassword")}
              placeholder="Confirm new password"
              aria-invalid={errors.confirmPassword ? "true" : undefined}
            />
            <FieldError errors={[errors.confirmPassword]} />
          </Field>

          <DialogFooter className="mx-0 mb-0 gap-3 p-0 pt-2 sm:justify-end">
            <DialogClose
              render={
                <Button variant="outline" type="button">
                  Close
                </Button>
              }
            />
            <Button type="submit" disabled={isSubmitting}>
              Save Changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
