"use client";

import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { SendIcon } from "@/icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { exampleFormSchema, type ExampleFormData } from "./schema";

const subjectOptions = [
  { value: "option-1", label: "Option 1" },
  { value: "option-2", label: "Option 2" },
  { value: "option-3", label: "Option 3" },
];

export default function ExampleFormContent() {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ExampleFormData>({
    resolver: zodResolver(exampleFormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      subject: "",
      message: "",
    },
    mode: "onTouched",
  });

  const onSubmit = (data: ExampleFormData) => {
    console.log("Example Form submitted:", data);
    reset();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <Field data-invalid={Boolean(errors.firstName)}>
          <FieldLabel htmlFor="firstName">
            First Name<span className="text-red-500">*</span>
          </FieldLabel>
          <Input
            {...register("firstName")}
            id="firstName"
            type="text"
            placeholder="Enter first name"
            aria-invalid={errors.firstName ? "true" : undefined}
          />
          <FieldError errors={[errors.firstName]} />
        </Field>

        <Field data-invalid={Boolean(errors.lastName)}>
          <FieldLabel htmlFor="lastName">
            Last Name<span className="text-red-500">*</span>
          </FieldLabel>
          <Input
            {...register("lastName")}
            id="lastName"
            type="text"
            placeholder="Enter last name"
            aria-invalid={errors.lastName ? "true" : undefined}
          />
          <FieldError errors={[errors.lastName]} />
        </Field>

        <Field data-invalid={Boolean(errors.email)} className="sm:col-span-2">
          <FieldLabel htmlFor="email">
            Email<span className="text-red-500">*</span>
          </FieldLabel>
          <Input
            {...register("email")}
            id="email"
            type="email"
            placeholder="Enter email address"
            aria-invalid={errors.email ? "true" : undefined}
          />
          <FieldError errors={[errors.email]} />
        </Field>

        <Field data-invalid={Boolean(errors.subject)} className="sm:col-span-2">
          <FieldLabel htmlFor="subject">
            Select Subject<span className="text-red-500">*</span>
          </FieldLabel>
          <Controller
            name="subject"
            control={control}
            render={({ field }) => (
              <Select
                value={field.value}
                onValueChange={(val) => field.onChange(val ?? "")}
                items={subjectOptions}
              >
                <SelectTrigger
                  id="subject"
                  aria-invalid={errors.subject ? "true" : undefined}
                >
                  <SelectValue placeholder="Option 1" />
                </SelectTrigger>
                <SelectContent>
                  {subjectOptions.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          <FieldError errors={[errors.subject]} />
        </Field>

        <Field data-invalid={Boolean(errors.message)} className="sm:col-span-2">
          <FieldLabel htmlFor="message">
            Message<span className="text-red-500">*</span>
          </FieldLabel>
          <Textarea
            {...register("message")}
            id="message"
            placeholder="Enter your message"
            rows={6}
            aria-invalid={errors.message ? "true" : undefined}
          />
          <FieldError errors={[errors.message]} />
        </Field>

        <Button
          type="submit"
          className="w-full sm:col-span-2"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Sending..." : "Send Message"}
          <SendIcon className="size-5" />
        </Button>
      </div>
    </form>
  );
}
