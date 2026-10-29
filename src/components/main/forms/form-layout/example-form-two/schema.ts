import { z } from "zod";

export const exampleFormTwoSchema = z.object({
  firstName: z.string().trim().min(1, "First name is required"),
  lastName: z.string().trim().optional(),
  gender: z.string().optional(),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  category: z.string().min(1, "Please select category"),
  street: z.string().trim().min(1, "Street address is required"),
  city: z.string().trim().min(1, "City is required"),
  state: z.string().trim().min(1, "State is required"),
  postCode: z.string().trim().min(1, "Post code is required"),
  country: z.string().min(1, "Please select country"),
  membership: z.string().min(1, "Membership is required"),
});

export type ExampleFormTwoData = z.infer<typeof exampleFormTwoSchema>;
