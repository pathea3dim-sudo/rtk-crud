// app/createproduct/page.tsx
"use client";

import CreateProductForm from "@/components/product-form/CreateProductForm";

export default function CreateProductPage() {
  return (
    <div className="container mx-auto py-10">
      <CreateProductForm />
    </div>
  );
}