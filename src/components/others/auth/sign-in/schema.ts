import { z } from "zod";

export const signInSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
  keepLoggedIn: z.boolean().optional(),
});

export type SignInFormData = z.infer<typeof signInSchema>;
