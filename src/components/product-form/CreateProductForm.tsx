// src/components/product-form/CreateProductForm.tsx
"use client";

import { Resolver, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import { ImagePlus, X, Loader2 } from "lucide-react";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
// import { productFields } from "./form-field-config";
import { productFields } from "./form-fiel-config";
import { DynamicFormField } from "./DynamicFormField";
import { ProductForm, productFormSchema } from "./product-form-schema";
import { useUploadSingleFileMutation } from "@/services/uploadApi";
import { 
  useCreateProductMutation,
  useGetCategoriesQuery,
  useGetBrandsQuery,
  useGetSuppliersQuery
} from "@/services/ecommerce";
import { Field, FieldLabel } from "@/components/ui/field";
import { useRouter } from "next/navigation";

type ProductFormValue = z.infer<typeof productFormSchema>;

export default function CreateProductForm() {
  const router = useRouter();
  const [uploadSingleFile, { isLoading: isUploading }] = useUploadSingleFileMutation();
  const [createProduct, { isLoading: isCreating }] = useCreateProductMutation();
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // Fetch dropdown data
  const { data: categories = [], isLoading: isLoadingCategories } = useGetCategoriesQuery();
  const { data: brands = [], isLoading: isLoadingBrands } = useGetBrandsQuery();
  const { data: suppliers = [], isLoading: isLoadingSuppliers } = useGetSuppliersQuery();

  const form = useForm<ProductForm>({
    resolver: zodResolver(productFormSchema) as Resolver<ProductFormValue>,
    defaultValues: {
      name: "",
      description: "",
      stockQuantity: 0,
      priceIn: 0,
      priceOut: 0,
      discount: 0,
      warranty: "",
      availability: true,
      categoryUuid: "",
      supplierUuid: "",
      brandUuid: "",
      thumbnail: "",
    },
  });

  // Check authentication on mount
  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      toast.error("Please login first");
      router.push('/login');
    }
  }, [router]);

  const handleThumbnailUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size must be less than 5MB");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => setPreviewUrl(reader.result as string);
    reader.readAsDataURL(file);

    setUploadError(null);

    try {
      const response = await uploadSingleFile(file).unwrap();
      console.log("Upload response:", response);
      
      if (response.success && response.data?.url) {
        form.setValue("thumbnail", response.data.url, { shouldValidate: true });
        toast.success("Thumbnail uploaded successfully!");
      } else {
        throw new Error(response.message || "Upload failed");
      }
    } catch (error: any) {
      console.error("Upload error:", error);
      
      if (error?.status === 0 || error?.status === 'FETCH_ERROR') {
        setUploadError("Cannot connect to server. Please check if the backend is running.");
        toast.error("Server connection failed. Please try again.");
      } else if (error?.status === 401) {
        toast.error("Unauthorized. Please login again.");
        localStorage.removeItem('accessToken');
        router.push('/login');
      } else {
        toast.error(error?.data?.message || "Failed to upload thumbnail image");
      }
      
      setPreviewUrl(null);
    }
  };

  const removeThumbnail = () => {
    setPreviewUrl(null);
    form.setValue("thumbnail", "");
    setUploadError(null);
  };

  const onSubmit = async (data: ProductForm) => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        toast.error("Please login first");
        router.push('/login');
        return;
      }

      if (!data.thumbnail) {
        toast.error("Please upload a thumbnail image");
        return;
      }

      console.log("Submitting product data:", data);

      const result = await createProduct(data).unwrap();
      console.log("Product created:", result);
      
      toast.success("Product created successfully! 🎉");
      form.reset();
      setPreviewUrl(null);
      
      setTimeout(() => {
        router.push('/products');
      }, 2000);
      
    } catch (error: any) {
      console.error("Create product error - Full:", error);
      
      if (error?.status === 'FETCH_ERROR' || error?.status === 0) {
        toast.error("Cannot connect to server. Please check your network.");
      } else if (error?.status === 401) {
        toast.error("Unauthorized. Please login again.");
        localStorage.removeItem('accessToken');
        router.push('/login');
      } else if (error?.status === 403) {
        toast.error("You don't have permission to create products.");
      } else if (error?.data?.message) {
        toast.error(error.data.message);
      } else {
        toast.error("Failed to create product. Please try again.");
      }
    }
  };

  const isLoading = isCreating || isUploading || isLoadingCategories || isLoadingBrands || isLoadingSuppliers;

  // Prepare select options
  const categoryOptions = categories.map((cat: any) => ({
    value: cat.uuid,
    label: cat.name,
  }));

  const brandOptions = brands.map((brand: any) => ({
    value: brand.uuid,
    label: brand.name,
  }));

  const supplierOptions = suppliers.map((supplier: any) => ({
    value: supplier.uuid,
    label: supplier.name,
  }));

  // Add dropdown fields to the form
  const allFields = [
    ...productFields,
    {
      name: "categoryUuid" as const,
      label: "Category",
      type: "select" as const,
      placeholder: "Select a category",
      isRequired: true,
      options: categoryOptions,
    },
    {
      name: "brandUuid" as const,
      label: "Brand",
      type: "select" as const,
      placeholder: "Select a brand",
      isRequired: true,
      options: brandOptions,
    },
    {
      name: "supplierUuid" as const,
      label: "Supplier",
      type: "select" as const,
      placeholder: "Select a supplier",
      isRequired: true,
      options: supplierOptions,
    },
  ];

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl">Create New Product</CardTitle>
        <CardDescription>
          Fill in all the necessary information for the new product. Fields with <span className="text-destructive">*</span> are required.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form
          id="product-form"
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6"
        >
          {allFields.map((fieldConfig) => (
            <DynamicFormField
              key={fieldConfig.name}
              fieldConfig={fieldConfig}
              control={form.control}
              isLoading={isLoading}
            />
          ))}

          {/* Thumbnail Upload */}
          <Field className="border-t pt-4">
            <FieldLabel>
              Product Thumbnail <span className="text-destructive">*</span>
            </FieldLabel>
            <div className="flex items-start gap-4 mt-2">
              <div className="flex-1">
                <div className="flex items-center gap-4">
                  <Button
                    type="button"
                    variant="outline"
                    disabled={isLoading}
                    onClick={() => document.getElementById("thumbnail-picker")?.click()}
                  >
                    {isUploading ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <ImagePlus className="h-4 w-4 mr-2" />
                    )}
                    {isUploading ? "Uploading..." : "Select Thumbnail"}
                  </Button>
                  <input
                    id="thumbnail-picker"
                    type="file"
                    accept="image/*"
                    onChange={handleThumbnailUpload}
                    className="hidden"
                  />
                  {previewUrl && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={removeThumbnail}
                      disabled={isCreating}
                    >
                      <X className="h-4 w-4 text-destructive" />
                    </Button>
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Max 5MB. Supported format: JPG, PNG, WebP
                </p>
                {uploadError && (
                  <p className="text-xs text-destructive mt-1">{uploadError}</p>
                )}
                {form.formState.errors.thumbnail && (
                  <p className="text-xs text-destructive mt-1">
                    {form.formState.errors.thumbnail.message}
                  </p>
                )}
              </div>
              
              {previewUrl && (
                <div className="relative w-24 h-24 flex-shrink-0">
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="w-full h-full object-cover rounded-lg border"
                  />
                </div>
              )}
            </div>
            <input type="hidden" {...form.register("thumbnail")} />
          </Field>
        </form>
      </CardContent>

      <CardFooter className="flex justify-end gap-2 border-t pt-4">
        <Button 
          variant="outline" 
          type="button" 
          disabled={isLoading} 
          onClick={() => { 
            form.reset(); 
            setPreviewUrl(null); 
            setUploadError(null);
          }}
        >
          Reset
        </Button>
        <Button 
          type="submit" 
          form="product-form" 
          disabled={isLoading}
          className="min-w-[120px]"
        >
          {isCreating ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Creating...
            </>
          ) : (
            "Create Product"
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}