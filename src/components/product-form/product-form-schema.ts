// src/components/product-form/product-form-schema.ts
import * as z from "zod";

export const productFormSchema = z.object({
  name: z
    .string()
    .min(3, "Product name must be at least 3 characters.")
    .max(100, "Product name must be at most 100 characters."),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters.")
    .max(1000, "Description must be at most 1000 characters."),
  stockQuantity: z.coerce
    .number()
    .int("Stock must be a whole number")
    .min(0, "Stock quantity cannot be negative")
    .default(0),
  priceIn: z.coerce
    .number()
    .min(0, "Purchase price cannot be negative")
    .default(0),
  priceOut: z.coerce
    .number()
    .min(0, "Selling price cannot be negative")
    .default(0),
  discount: z.coerce
    .number()
    .min(0, "Discount cannot be negative")
    .max(100, "Discount cannot exceed 100%")
    .default(0),
  warranty: z.string().optional().default(""),
  availability: z.boolean().default(true),
  categoryUuid: z.string().min(1, "Please select a category"),
  supplierUuid: z.string().min(1, "Please select a supplier"),
  brandUuid: z.string().min(1, "Please select a brand"),
  thumbnail: z.string().url("Please upload a valid image").optional().or(z.literal("")),
});

export type ProductForm = z.infer<typeof productFormSchema>;