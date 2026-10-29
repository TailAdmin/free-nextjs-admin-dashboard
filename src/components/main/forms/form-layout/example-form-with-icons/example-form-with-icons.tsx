"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { ArrowRightIcon, EnvelopeIcon, LockIcon, UserIcon } from "@/icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import {
  exampleFormWithIconsSchema,
  type ExampleFormWithIconsData,
} from "./schema";

export default function ExampleFormWithIconsContent() {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ExampleFormWithIconsData>({
    resolver: zodResolver(exampleFormWithIconsSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      rememberMe: false,
    },
    mode: "onTouched",
  });

  const onSubmit = (data: ExampleFormWithIconsData) => {
    console.log("Example Form with Icons submitted:", data);
    reset();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className="space-y-6">
        <Field data-invalid={Boolean(errors.username)}>
          <InputGroup>
            <InputGroupAddon align="inline-start">
              <UserIcon className="size-5 text-gray-500 dark:text-gray-400" />
            </InputGroupAddon>
            <InputGroupInput
              {...register("username")}
              type="text"
              placeholder="Username"
              aria-label="Username"
              aria-invalid={errors.username ? "true" : undefined}
            />
          </InputGroup>
          <FieldError errors={[errors.username]} />
        </Field>

        <Field data-invalid={Boolean(errors.email)}>
          <InputGroup>
            <InputGroupAddon align="inline-start">
              <EnvelopeIcon className="size-5 text-gray-500 dark:text-gray-400" />
            </InputGroupAddon>
            <InputGroupInput
              {...register("email")}
              type="email"
              placeholder="Email address"
              aria-label="Email address"
              aria-invalid={errors.email ? "true" : undefined}
            />
          </InputGroup>
          <FieldError errors={[errors.email]} />
        </Field>

        <Field data-invalid={Boolean(errors.password)}>
          <InputGroup>
            <InputGroupAddon align="inline-start">
              <LockIcon className="size-5 text-gray-500 dark:text-gray-400" />
            </InputGroupAddon>
            <InputGroupInput
              {...register("password")}
              type="password"
              placeholder="Password"
              aria-label="Password"
              aria-invalid={errors.password ? "true" : undefined}
            />
          </InputGroup>
          <FieldError errors={[errors.password]} />
        </Field>

        <Field data-invalid={Boolean(errors.confirmPassword)}>
          <InputGroup>
            <InputGroupAddon align="inline-start">
              <LockIcon className="size-5 text-gray-500 dark:text-gray-400" />
            </InputGroupAddon>
            <InputGroupInput
              {...register("confirmPassword")}
              type="password"
              placeholder="Confirm Password"
              aria-label="Confirm Password"
              aria-invalid={errors.confirmPassword ? "true" : undefined}
            />
          </InputGroup>
          <FieldError errors={[errors.confirmPassword]} />
        </Field>

        <div className="flex items-center justify-between">
          <Field orientation="horizontal" className="w-auto items-center gap-3">
            <Controller
              control={control}
              name="rememberMe"
              render={({ field }) => (
                <Checkbox
                  id="remember-me"
                  checked={field.value}
                  onCheckedChange={(checked) =>
                    field.onChange(Boolean(checked))
                  }
                  aria-invalid={errors.rememberMe ? true : undefined}
                />
              )}
            />
            <FieldLabel
              htmlFor="remember-me"
              className="text-theme-sm cursor-pointer font-normal text-gray-700 dark:text-gray-400"
            >
              Remember me
            </FieldLabel>
          </Field>

          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Creating..." : "Create Account"}
            <ArrowRightIcon className="size-5 rtl:rotate-180" />
          </Button>
        </div>
      </div>
    </form>
  );
}
