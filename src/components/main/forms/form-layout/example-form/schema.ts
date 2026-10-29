import { z } from "zod";

export const exampleFormSchema = z.object({
  firstName: z.string().trim().min(1, "First name is required"),
  lastName: z.string().trim().min(1, "Last name is required"),
  email: z
    .string()
    .trim()
    .min(1, "Email address is required")
    .email("Please enter a valid email address"),
  subject: z.string().min(1, "Please select a subject"),
  message: z.string().trim().min(1, "Message is required"),
});

export type ExampleFormData = z.infer<typeof exampleFormSchema>;
