// src/components/product-form/ProductForm.tsx
"use client";

import {
    Field,
    FieldDescription,
    FieldLabel,
    FieldError,
} from "@/components/ui/field";
import {
    InputGroup,
    InputGroupInput,
    InputGroupAddon,
} from "@/components/ui/input-group";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useForm, Controller } from "react-hook-form";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ShoppingCartIcon, Upload, X, Loader2 } from "lucide-react";
import { Card, CardFooter } from "../ui/card";
import { Button } from "../ui/button";
import {
    useCreateProductMutation,
} from "@/services/ecommerce";
import { useUploadFilesMutation } from "../../services/uploadApi";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import UploadFilePage from "@/app/uploadfile/page";

// ============= SCHEMA =============
export const productSchema = z.object({
    name: z.string().min(1, { message: "Name is required" }),
    description: z.string().min(10, "Description must be at least 10 characters"),
    stockQuantity: z
        .number()
        .int()
        .min(0, { message: "Stock cannot be negative" }),
    priceIn: z
        .number()
        .min(0, { message: "Purchase price must be greater than 0" }),
    priceOut: z
        .number()
        .min(0, { message: "Selling price must be greater than 0" }),
    discount: z
        .number()
        .min(0)
        .max(100, { message: "Discount must be between 0 and 100" })
        .default(0),
    warranty: z.string().optional(),
    thumbnail: z.string().min(1, "Thumbnail is required"),
    availability: z.boolean().default(true),
    images: z.array(z.string()).min(1, "At least one image is required"),
});

type ProductFormValues = z.infer<typeof productSchema>;

// ============= MAIN COMPONENT =============
export default function ProductCreateForm() {
    const router = useRouter();
    const [pendingFiles, setPendingFiles] = useState<File[]>([]);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadedUrls, setUploadedUrls] = useState<string[]>([]);

    // API Hooks
    const [createProduct, { isLoading: isCreating }] = useCreateProductMutation();
    const [uploadFile] = useUploadFilesMutation();

    const form = useForm<ProductFormValues>({
        resolver: zodResolver(productSchema),
        defaultValues: {
            name: "",
            description: "",
            stockQuantity: 0,
            priceIn: 0,
            priceOut: 0,
            discount: 0,
            warranty: "",
            thumbnail: "",
            availability: true,
            images: [],
        },
    });

    const isLoading = isCreating || isUploading;

    // ===== FILE HANDLING =====
    const handleFileUpload = async (files: File[]) => {
        if (files.length === 0) return;
        
        setIsUploading(true);
        toast.loading("Uploading images...");

        try {
            const urls = await Promise.all(
                files.map(async (file) => {
                    const result = await uploadFile(file).unwrap();
                    console.log("Upload result:", result);
                    return result?.location || result?.data?.url || result?.url || "";
                })
            );

            const validUrls = urls.filter(url => url !== "");
            setUploadedUrls(validUrls);
            setPendingFiles(files);
            
            // Set thumbnail to first uploaded image
            if (validUrls.length > 0) {
                form.setValue("thumbnail", validUrls[0]);
                form.setValue("images", validUrls);
            }

            toast.dismiss();
            toast.success(`${validUrls.length} image(s) uploaded successfully! 🎉`);
        } catch (error: any) {
            toast.dismiss();
            console.error("Upload error:", error);
            toast.error("Failed to upload images. Please try again.");
        } finally {
            setIsUploading(false);
        }
    };

    const handleFileRemove = (index: number) => {
        const newFiles = pendingFiles.filter((_, i) => i !== index);
        const newUrls = uploadedUrls.filter((_, i) => i !== index);
        setPendingFiles(newFiles);
        setUploadedUrls(newUrls);
        
        if (newUrls.length > 0) {
            form.setValue("thumbnail", newUrls[0]);
            form.setValue("images", newUrls);
        } else {
            form.setValue("thumbnail", "");
            form.setValue("images", []);
        }
    };

    // ===== SUBMIT =====
    async function onSubmit(values: ProductFormValues) {
        try {
            // Check token
            const token = localStorage.getItem("accessToken");
            if (!token) {
                toast.error("Please login first");
                router.push("/login");
                return;
            }

            if (uploadedUrls.length === 0) {
                toast.error("Please upload at least one product image.");
                return;
            }

            toast.loading("Creating product...");

            const payload = {
                ...values,
                images: uploadedUrls,
                thumbnail: uploadedUrls[0] || "",
                availability: true,
            };

            console.log("Product payload:", payload);

            await createProduct(payload).unwrap();

            toast.dismiss();
            toast.success("Product Created Successfully! 🎉");
            
            // Reset everything
            setPendingFiles([]);
            setUploadedUrls([]);
            form.reset();

            setTimeout(() => {
                router.push("/products");
            }, 2000);

        } catch (error: any) {
            toast.dismiss();
            console.error("Failed to create product:", error);

            if (error?.status === 401) {
                toast.error("Unauthorized. Please login again.");
                localStorage.removeItem("accessToken");
                router.push("/login");
            } else if (error?.status === "FETCH_ERROR") {
                toast.error("Network error. Please check your connection.");
            } else if (error?.data?.message) {
                toast.error(error.data.message);
            } else {
                toast.error("Something went wrong while creating the product.");
            }
        }
    }

    function onReset() {
        form.reset();
        form.clearErrors();
        setPendingFiles([]);
        setUploadedUrls([]);
        toast.info("Form has been reset");
    }

    return (
        <Card className="w-full max-w-4xl mx-auto p-6">
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                onReset={onReset}
                className="space-y-6"
            >
                <div className="mb-6">
                    <h2 className="text-2xl font-bold">Create Product</h2>
                    <p className="text-sm text-muted-foreground">
                        Fill in the details to add a new product to your store
                    </p>
                </div>

                {/* Product Name */}
                <Controller
                    control={form.control}
                    name="name"
                    render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                            <FieldLabel>
                                Product Name <span className="text-destructive">*</span>
                            </FieldLabel>
                            <Input
                                placeholder="Enter product name"
                                {...field}
                                disabled={isLoading}
                            />
                            {fieldState.invalid && (
                                <FieldError errors={[fieldState.error]} />
                            )}
                        </Field>
                    )}
                />

                {/* Description */}
                <Controller
                    control={form.control}
                    name="description"
                    render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                            <FieldLabel>
                                Description <span className="text-destructive">*</span>
                            </FieldLabel>
                            <Textarea
                                placeholder="Describe your product in detail..."
                                rows={4}
                                {...field}
                                disabled={isLoading}
                            />
                            {fieldState.invalid && (
                                <FieldError errors={[fieldState.error]} />
                            )}
                        </Field>
                    )}
                />

                {/* Price Fields */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Controller
                        control={form.control}
                        name="priceIn"
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel>
                                    Purchase Price ($) <span className="text-destructive">*</span>
                                </FieldLabel>
                                <Input
                                    type="number"
                                    step="0.01"
                                    placeholder="0.00"
                                    {...field}
                                    onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                                    disabled={isLoading}
                                />
                                {fieldState.invalid && (
                                    <FieldError errors={[fieldState.error]} />
                                )}
                            </Field>
                        )}
                    />

                    <Controller
                        control={form.control}
                        name="priceOut"
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel>
                                    Selling Price ($) <span className="text-destructive">*</span>
                                </FieldLabel>
                                <Input
                                    type="number"
                                    step="0.01"
                                    placeholder="0.00"
                                    {...field}
                                    onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                                    disabled={isLoading}
                                />
                                {fieldState.invalid && (
                                    <FieldError errors={[fieldState.error]} />
                                )}
                            </Field>
                        )}
                    />

                    <Controller
                        control={form.control}
                        name="stockQuantity"
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel>
                                    Stock Quantity <span className="text-destructive">*</span>
                                </FieldLabel>
                                <InputGroup>
                                    <InputGroupInput
                                        type="number"
                                        placeholder="0"
                                        value={field.value ?? ""}
                                        onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                                        onBlur={field.onBlur}
                                        name={field.name}
                                        ref={field.ref}
                                        disabled={isLoading}
                                    />
                                    <InputGroupAddon align="inline-start">
                                        <ShoppingCartIcon className="size-4" strokeWidth={2} />
                                    </InputGroupAddon>
                                </InputGroup>
                                {fieldState.invalid && (
                                    <FieldError errors={[fieldState.error]} />
                                )}
                            </Field>
                        )}
                    />
                </div>

                {/* Discount & Warranty */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Controller
                        control={form.control}
                        name="discount"
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel>Discount (%)</FieldLabel>
                                <Input
                                    type="number"
                                    placeholder="0"
                                    {...field}
                                    onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                                    disabled={isLoading}
                                />
                                {fieldState.invalid && (
                                    <FieldError errors={[fieldState.error]} />
                                )}
                            </Field>
                        )}
                    />

                    <Controller
                        control={form.control}
                        name="warranty"
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel>Warranty</FieldLabel>
                                <Input
                                    placeholder="e.g., 2 years"
                                    {...field}
                                    disabled={isLoading}
                                />
                                {fieldState.invalid && (
                                    <FieldError errors={[fieldState.error]} />
                                )}
                            </Field>
                        )}
                    />
                </div>

                {/* Image Upload */}
                <UploadFilePage 
                    onFileUpload={handleFileUpload}
                    onFileRemove={handleFileRemove}
                    pendingFiles={pendingFiles}
                    uploadedUrls={uploadedUrls}
                />

                {/* Submit Buttons */}
                <CardFooter className="flex justify-end gap-4 px-0">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={onReset}
                        disabled={isLoading}
                    >
                        Reset
                    </Button>
                    <Button
                        type="submit"
                        disabled={isLoading || uploadedUrls.length === 0}
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
            </form>
        </Card>
    );
}