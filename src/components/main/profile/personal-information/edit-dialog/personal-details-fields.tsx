"use client";

import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { PersonalDetailsFieldsProps } from "./types";

export default function PersonalDetailsFields({
  register,
  errors,
}: PersonalDetailsFieldsProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-base font-medium text-gray-800 dark:text-white/90">
        Personal Information
      </h3>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field data-invalid={Boolean(errors.firstName)}>
          <FieldLabel className="mb-1.5 block">
            First Name <span className="text-red-500">*</span>
          </FieldLabel>
          <Input
            {...register("firstName")}
            type="text"
            placeholder="Enter first name"
            aria-invalid={errors.firstName ? "true" : undefined}
          />
          <FieldError errors={[errors.firstName]} />
        </Field>

        <Field data-invalid={Boolean(errors.lastName)}>
          <FieldLabel className="mb-1.5 block">
            Last Name <span className="text-red-500">*</span>
          </FieldLabel>
          <Input
            {...register("lastName")}
            type="text"
            placeholder="Enter last name"
            aria-invalid={errors.lastName ? "true" : undefined}
          />
          <FieldError errors={[errors.lastName]} />
        </Field>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field data-invalid={Boolean(errors.email)}>
          <FieldLabel className="mb-1.5 block">
            Email Address <span className="text-red-500">*</span>
          </FieldLabel>
          <Input
            {...register("email")}
            type="email"
            placeholder="info@example.com"
            aria-invalid={errors.email ? "true" : undefined}
          />
          <FieldError errors={[errors.email]} />
        </Field>

        <Field data-invalid={Boolean(errors.phone)}>
          <FieldLabel className="mb-1.5 block">
            Phone <span className="text-red-500">*</span>
          </FieldLabel>
          <Input
            {...register("phone")}
            type="text"
            placeholder="+09 363 398 46"
            aria-invalid={errors.phone ? "true" : undefined}
          />
          <FieldError errors={[errors.phone]} />
        </Field>
      </div>

      <Field data-invalid={Boolean(errors.bio)}>
        <FieldLabel className="mb-1.5 block">Bio</FieldLabel>
        <Textarea
          {...register("bio")}
          rows={3}
          placeholder="Write a brief bio..."
          aria-invalid={errors.bio ? "true" : undefined}
        />
        <FieldError errors={[errors.bio]} />
      </Field>
    </div>
  );
}
