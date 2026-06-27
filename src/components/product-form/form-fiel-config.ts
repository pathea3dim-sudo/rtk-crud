// components/product-form/form-field-config.ts (rename from form-fiel-config.ts)
import { FieldPath } from "react-hook-form";
import { ProductForm } from "./product-form-schema";

export type FieldConfig = {
  name: FieldPath<ProductForm>;
  label: string;
  type?: "text" | "number" | "textarea";
  placeholder?: string;
  rows?: number;
  className?: string;
  isRequired?: boolean;
};

export const productFields: FieldConfig[] = [
  {
    name: "name",
    label: "Product Name",
    type: "text",
    placeholder: "Dell XPS 15 9530",
  },
  {
    name: "description",
    label: "Description",
    type: "textarea",
    placeholder: "Premium ultrabook with a stunning InfinityEdge display ...",
    rows: 5,
  },
  {
    name: "stockQuantity",
    label: "Stock Quantity",
    type: "number",
    placeholder: "0",
  },
  {
    name: "priceIn",
    label: "Purchase Price (USD)",
    type: "number",
    placeholder: "0.00",
  },
  {
    name: "priceOut",
    label: "Selling Price (USD)",
    type: "number",
    placeholder: "0.00",
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
    placeholder: "2 years international warranty",
  },
  {
    name: "categoryUuid",
    label: "Category UUID",
    type: "text",
    placeholder: "Enter category UUID",
  },
  {
    name: "brandUuid",
    label: "Brand UUID",
    type: "text",
    placeholder: "Enter brand UUID",
  },
  {
    name: "supplierUuid",
    label: "Supplier UUID",
    type: "text",
    placeholder: "Enter supplier UUID",
  },
];