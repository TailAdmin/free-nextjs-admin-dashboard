import { z } from "zod";

export const exampleFormWithIconsSchema = z
  .object({
    username: z.string().trim().min(1, "Username is required"),
    email: z
      .string()
      .trim()
      .min(1, "Email address is required")
      .email("Please enter a valid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
    rememberMe: z.boolean(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type ExampleFormWithIconsData = z.infer<
  typeof exampleFormWithIconsSchema
>;
