"use client";

import { Button } from "@/components/ui/button";
import { Field, FieldError } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { basicFormSchema, type BasicFormData } from "./schema";

export default function BasicFormContent() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<BasicFormData>({
    resolver: zodResolver(basicFormSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    mode: "onTouched",
  });

  const onSubmit = (data: BasicFormData) => {
    console.log("Basic Form submitted:", data);
    reset();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <Field data-invalid={Boolean(errors.name)}>
          <Input
            {...register("name")}
            type="text"
            placeholder="Name"
            aria-label="Name"
            aria-invalid={errors.name ? "true" : undefined}
          />
          <FieldError errors={[errors.name]} />
        </Field>

        <Field data-invalid={Boolean(errors.email)}>
          <Input
            {...register("email")}
            type="email"
            placeholder="Email address"
            aria-label="Email address"
            aria-invalid={errors.email ? "true" : undefined}
          />
          <FieldError errors={[errors.email]} />
        </Field>

        <Field
          data-invalid={Boolean(errors.password)}
          className="sm:col-span-2"
        >
          <Input
            {...register("password")}
            type="password"
            placeholder="Password"
            aria-label="Password"
            aria-invalid={errors.password ? "true" : undefined}
          />
          <FieldError errors={[errors.password]} />
        </Field>

        <Field
          data-invalid={Boolean(errors.confirmPassword)}
          className="sm:col-span-2"
        >
          <Input
            {...register("confirmPassword")}
            type="password"
            placeholder="Confirm Password"
            aria-label="Confirm Password"
            aria-invalid={errors.confirmPassword ? "true" : undefined}
          />
          <FieldError errors={[errors.confirmPassword]} />
        </Field>

        <Button
          type="submit"
          className="w-full sm:col-span-2"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Submitting..." : "Submit"}
        </Button>
      </div>
    </form>
  );
}
