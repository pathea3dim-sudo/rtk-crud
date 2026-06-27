// src/app/createproduct/page.tsx
// import CreateProductForm from "@/components/product-form/CreateProductForm";
// import ProductCreateForm from "@/components/product-form/ProductCreateForm";
// import CreateProductPage from "@/components/products/create/page";

import CreateProductForm from "@/components/product-form/CreateProductForm";
import ProductCreateForm from "@/components/product-form/ProductCreateForm";

export const metadata = {
  title: "Create Product",
  description: "Create a new product",
};

export default function CreateProduct() {
  return (
    <div className="container mx-auto py-10 px-4">
      {/* <CreateProductForm/> */}
      <ProductCreateForm/>
    
    </div>
  );
}