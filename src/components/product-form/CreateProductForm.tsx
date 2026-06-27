"use client";

import { Resolver, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import { ImagePlus, X } from "lucide-react";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { productFields } from "./form-fiel-config";
import { DynamicFormField } from "./DynamicFormField";
import { ProductForm, productFormSchema } from "./product-form-schema";
import { useUploadSingleFileMutation } from "@/services/uploadApi";
import { useCreateProductMutation } from "@/services/ecommerce";
import { Field, FieldLabel } from "@/components/ui/field";

type ProductFormValue = z.infer<typeof productFormSchema>;

export default function CreateProductForm() {
  const [uploadSingleFile, { isLoading: isUploading }] = useUploadSingleFileMutation();
  const [createProduct, { isLoading: isCreating }] = useCreateProductMutation();
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

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

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      toast.error("Please login first");
    } else {
      console.log("Token found:", token.substring(0, 20) + "...");
    }
  }, []);

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
      toast.error("Failed to upload thumbnail image");
      setPreviewUrl(null);
    }
  };

  const removeThumbnail = () => {
    setPreviewUrl(null);
    form.setValue("thumbnail", "");
  };

  const onSubmit = async (data: ProductForm) => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        toast.error("Please login first");
        window.location.href = '/login';
        return;
      }

      console.log("Token being used:", token.substring(0, 20) + "...");
      console.log("Submitting product data:", data);

      if (!data.thumbnail) {
        toast.error("Please upload a thumbnail image");
        return;
      }

      const result = await createProduct(data).unwrap();
      console.log("Product created:", result);
      toast.success("Product created successfully!");
      form.reset();
      setPreviewUrl(null);
    } catch (error: any) {
      console.error("Create product error - Full:", error);
      
      if (error?.status === 'FETCH_ERROR') {
        toast.error("Cannot connect to server. Please check your network.");
      } else if (error?.status === 401) {
        toast.error("Unauthorized. Please login again.");
        localStorage.removeItem('accessToken');
        window.location.href = '/login';
      } else if (error?.status === 403) {
        toast.error("You don't have permission to create products.");
      } else if (error?.data?.message) {
        toast.error(error.data.message);
      } else {
        toast.error("Failed to create product");
      }
    }
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Create New Product</CardTitle>
        <CardDescription>
          Fill in all the necessary information for the new product.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form
          id="product-form"
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6"
        >
          {productFields.map((fieldConfig) => (
            <DynamicFormField
              key={fieldConfig.name}
              fieldConfig={fieldConfig}
              control={form.control}
            />
          ))}

          <Field className="border-t pt-4">
            <FieldLabel>Product Thumbnail</FieldLabel>
            <div className="flex items-start gap-4 mt-2">
              <div className="flex-1">
                <div className="flex items-center gap-4">
                  <Button
                    type="button"
                    variant="outline"
                    disabled={isUploading || isCreating}
                    onClick={() => document.getElementById("thumbnail-picker")?.click()}
                  >
                    <ImagePlus className="h-4 w-4 mr-2" />
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
              </div>
              
              {previewUrl && (
                <div className="relative w-20 h-20 flex-shrink-0">
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
          disabled={isCreating || isUploading} 
          onClick={() => { form.reset(); setPreviewUrl(null); }}
        >
          Reset
        </Button>
        <Button 
          type="submit" 
          form="product-form" 
          disabled={isCreating || isUploading}
        >
          {isCreating ? "Creating..." : "Create Product"}
        </Button>
      </CardFooter>
    </Card>
  );
}