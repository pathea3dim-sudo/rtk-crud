// src/components/product-form/form-field-config.ts
import { FieldPath } from "react-hook-form";
import { ProductForm } from "./product-form-schema";

export type FieldConfig = {
  name: FieldPath<ProductForm>;
  label: string;
  type?: "text" | "number" | "textarea" | "select";
  placeholder?: string;
  rows?: number;
  className?: string;
  isRequired?: boolean;
  options?: Array<{ value: string; label: string }>;
};

export const productFields: FieldConfig[] = [
  {
    name: "name",
    label: "Product Name",
    type: "text",
    placeholder: "Enter product name",
    isRequired: true,
  },
  {
    name: "description",
    label: "Description",
    type: "textarea",
    placeholder: "Describe your product in detail...",
    rows: 5,
    isRequired: true,
  },
  {
    name: "stockQuantity",
    label: "Stock Quantity",
    type: "number",
    placeholder: "0",
    isRequired: true,
  },
  {
    name: "priceIn",
    label: "Purchase Price (USD)",
    type: "number",
    placeholder: "0.00",
    isRequired: true,
  },
  {
    name: "priceOut",
    label: "Selling Price (USD)",
    type: "number",
    placeholder: "0.00",
    isRequired: true,
  },
  {
    name: "discount",
    label: "Discount (%)",
    type: "number",
    placeholder: "0",
  },
  {
    name: "warranty",
    label: "Warranty",
    type: "text",
    placeholder: "e.g., 2 years warranty",
  },
];