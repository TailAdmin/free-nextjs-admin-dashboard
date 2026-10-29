"use client";

import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CalendarIcon } from "@/icons";
import { zodResolver } from "@hookform/resolvers/zod";
import flatpickr from "flatpickr";
import { useEffect, useRef } from "react";
import { Controller, useForm } from "react-hook-form";
import { exampleFormTwoSchema, type ExampleFormTwoData } from "./schema";

const genderOptions = [
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
];

const categoryOptions = [
  { value: "category-1", label: "Category 1" },
  { value: "category-2", label: "Category 2" },
  { value: "category-3", label: "Category 3" },
];

const countryOptions = [
  { value: "usa", label: "United States" },
  { value: "uk", label: "United Kingdom" },
  { value: "canada", label: "Canada" },
  { value: "bd", label: "Bangladesh" },
];

export default function ExampleFormTwoContent() {
  const datePickerRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ExampleFormTwoData>({
    resolver: zodResolver(exampleFormTwoSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      gender: "",
      dateOfBirth: "",
      category: "",
      street: "",
      city: "",
      state: "",
      postCode: "",
      country: "",
      membership: "free",
    },
    mode: "onTouched",
  });

  useEffect(() => {
    let fp: flatpickr.Instance | undefined;
    if (datePickerRef.current) {
      fp = flatpickr(datePickerRef.current, {
        dateFormat: "d/m/Y",
        onChange: (_, dateStr) => {
          setValue("dateOfBirth", dateStr, { shouldValidate: true });
        },
      });
    }

    return () => {
      fp?.destroy();
    };
  }, [setValue]);

  const onSubmit = (data: ExampleFormTwoData) => {
    console.log("Example Form Two submitted:", data);
    reset();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className="space-y-6">
        {/* Personal Info Section */}
        <div className="border-b border-gray-200 pb-4 dark:border-gray-800">
          <h4 className="text-base font-medium text-gray-800 dark:text-white/90">
            Personal Info
          </h4>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <Field data-invalid={Boolean(errors.firstName)}>
            <FieldLabel htmlFor="two-firstName">
              First Name<span className="text-red-500">*</span>
            </FieldLabel>
            <Input
              {...register("firstName")}
              id="two-firstName"
              type="text"
              placeholder="Enter first name"
              aria-invalid={errors.firstName ? "true" : undefined}
            />
            <FieldError errors={[errors.firstName]} />
          </Field>

          <Field data-invalid={Boolean(errors.lastName)}>
            <FieldLabel htmlFor="two-lastName">Last Name</FieldLabel>
            <Input
              {...register("lastName")}
              id="two-lastName"
              type="text"
              placeholder="Enter last name"
              aria-invalid={errors.lastName ? "true" : undefined}
            />
            <FieldError errors={[errors.lastName]} />
          </Field>
        </div>

        <Field data-invalid={Boolean(errors.gender)}>
          <FieldLabel htmlFor="two-gender">Gender</FieldLabel>
          <Controller
            name="gender"
            control={control}
            render={({ field }) => (
              <Select
                value={field.value}
                onValueChange={(val) => field.onChange(val ?? "")}
                items={genderOptions}
              >
                <SelectTrigger
                  id="two-gender"
                  aria-invalid={errors.gender ? "true" : undefined}
                >
                  <SelectValue placeholder="Select Gender" />
                </SelectTrigger>
                <SelectContent>
                  {genderOptions.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          <FieldError errors={[errors.gender]} />
        </Field>

        <Field data-invalid={Boolean(errors.dateOfBirth)}>
          <FieldLabel htmlFor="two-dob">
            Date of Birth<span className="text-red-500">*</span>
          </FieldLabel>
          <InputGroup>
            <InputGroupInput
              {...register("dateOfBirth")}
              ref={(e) => {
                register("dateOfBirth").ref(e);
                (
                  datePickerRef as React.MutableRefObject<HTMLInputElement | null>
                ).current = e;
              }}
              id="two-dob"
              type="text"
              placeholder="dd/mm/yyyy"
              aria-invalid={errors.dateOfBirth ? "true" : undefined}
            />
            <InputGroupAddon align="inline-end">
              <CalendarIcon className="size-5 text-gray-500 dark:text-gray-400" />
            </InputGroupAddon>
          </InputGroup>
          <FieldError errors={[errors.dateOfBirth]} />
        </Field>

        <Field data-invalid={Boolean(errors.category)}>
          <FieldLabel htmlFor="two-category">
            Category<span className="text-red-500">*</span>
          </FieldLabel>
          <Controller
            name="category"
            control={control}
            render={({ field }) => (
              <Select
                value={field.value}
                onValueChange={(val) => field.onChange(val ?? "")}
                items={categoryOptions}
              >
                <SelectTrigger
                  id="two-category"
                  aria-invalid={errors.category ? "true" : undefined}
                >
                  <SelectValue placeholder="Select Category" />
                </SelectTrigger>
                <SelectContent>
                  {categoryOptions.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          <FieldError errors={[errors.category]} />
        </Field>

        {/* Address Section */}
        <div className="border-b border-gray-200 pb-4 dark:border-gray-800">
          <h4 className="text-base font-medium text-gray-800 dark:text-white/90">
            Address
          </h4>
        </div>

        <Field data-invalid={Boolean(errors.street)}>
          <FieldLabel htmlFor="two-street">
            Street<span className="text-red-500">*</span>
          </FieldLabel>
          <Input
            {...register("street")}
            id="two-street"
            type="text"
            placeholder="Enter street"
            aria-invalid={errors.street ? "true" : undefined}
          />
          <FieldError errors={[errors.street]} />
        </Field>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <Field data-invalid={Boolean(errors.city)}>
            <FieldLabel htmlFor="two-city">
              City<span className="text-red-500">*</span>
            </FieldLabel>
            <Input
              {...register("city")}
              id="two-city"
              type="text"
              placeholder="Enter city"
              aria-invalid={errors.city ? "true" : undefined}
            />
            <FieldError errors={[errors.city]} />
          </Field>

          <Field data-invalid={Boolean(errors.state)}>
            <FieldLabel htmlFor="two-state">
              State<span className="text-red-500">*</span>
            </FieldLabel>
            <Input
              {...register("state")}
              id="two-state"
              type="text"
              placeholder="Enter state"
              aria-invalid={errors.state ? "true" : undefined}
            />
            <FieldError errors={[errors.state]} />
          </Field>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <Field data-invalid={Boolean(errors.postCode)}>
            <FieldLabel htmlFor="two-postCode">
              Post Code<span className="text-red-500">*</span>
            </FieldLabel>
            <Input
              {...register("postCode")}
              id="two-postCode"
              type="text"
              placeholder="Enter post code"
              aria-invalid={errors.postCode ? "true" : undefined}
            />
            <FieldError errors={[errors.postCode]} />
          </Field>

          <Field data-invalid={Boolean(errors.country)}>
            <FieldLabel htmlFor="two-country">
              Country<span className="text-red-500">*</span>
            </FieldLabel>
            <Controller
              name="country"
              control={control}
              render={({ field }) => (
                <Select
                  value={field.value}
                  onValueChange={(val) => field.onChange(val ?? "")}
                  items={countryOptions}
                >
                  <SelectTrigger
                    id="two-country"
                    aria-invalid={errors.country ? "true" : undefined}
                  >
                    <SelectValue placeholder="Select Country" />
                  </SelectTrigger>
                  <SelectContent>
                    {countryOptions.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            <FieldError errors={[errors.country]} />
          </Field>
        </div>

        {/* Membership Section */}
        <div className="flex items-center gap-4 pt-1">
          <FieldLabel className="mb-0 text-sm font-medium text-gray-800 dark:text-white/90">
            Membership:
          </FieldLabel>
          <Controller
            name="membership"
            control={control}
            render={({ field }) => (
              <RadioGroup
                value={field.value}
                onValueChange={(val) => field.onChange(val as string)}
                className="flex flex-row items-center gap-6"
              >
                <Field orientation="horizontal" className="w-auto gap-2">
                  <RadioGroupItem
                    value="free"
                    id="two-membership-free"
                    aria-invalid={errors.membership ? "true" : undefined}
                  />
                  <FieldLabel
                    htmlFor="two-membership-free"
                    className="cursor-pointer text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Free
                  </FieldLabel>
                </Field>
                <Field orientation="horizontal" className="w-auto gap-2">
                  <RadioGroupItem
                    value="premium"
                    id="two-membership-premium"
                    aria-invalid={errors.membership ? "true" : undefined}
                  />
                  <FieldLabel
                    htmlFor="two-membership-premium"
                    className="cursor-pointer text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Premium
                  </FieldLabel>
                </Field>
              </RadioGroup>
            )}
          />
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Save Changes"}
          </Button>
          <Button type="button" variant="outline" onClick={() => reset()}>
            Cancel
          </Button>
        </div>
      </div>
    </form>
  );
}
