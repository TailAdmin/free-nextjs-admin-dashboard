import { z } from "zod";

export const addressSchema = z.object({
  country: z.string().trim().min(1, "Country is required"),
  cityState: z.string().trim().min(1, "City/State is required"),
  postalCode: z.string().trim().min(1, "Postal Code is required"),
  taxId: z.string().trim().min(1, "TAX ID is required"),
});

export type AddressFormData = z.infer<typeof addressSchema>;
