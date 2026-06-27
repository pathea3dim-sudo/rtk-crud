// src/components/auth/register-form.tsx
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import * as z from "zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRegisterUserMutation } from "@/services/auth";
import { FileUploadFillProgressDemo } from "@/components/example-form/UploadFile";
import { toast } from "sonner";
import { useState } from "react";
import { useRouter } from "next/navigation";

const formSchema = z.object({
  username: z
    .string()
    .min(3, "Username must be at least 3 characters.")
    .max(32, "Username must be at most 32 characters."),
  phoneNumber: z
    .string()
    .min(10, "Phone number must be at least 10 characters."),
  address: z.object({
    addressLine1: z.string().min(1, "Address is required"),
    addressLine2: z.string().optional(),
    road: z.string().optional(),
    linkAddress: z.string().optional(),
  }),
  email: z.string().email("Invalid email format"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      "Password must contain uppercase, lowercase, digit, and special character (@$!%*?&)"
    ),
  confirmPassword: z.string().min(1, "Confirm password is required"),
  profile: z.string().optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export function RegisterForm() {
  const router = useRouter();
  const [register, { isLoading: isRegistering }] = useRegisterUserMutation();
  const [error, setError] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "pathea",
      phoneNumber: "0123122513",
      address: {
        addressLine1: "123 Street",
        addressLine2: "Optional",
        road: "Optional",
        linkAddress: "Optional",
      },
      email: "pathea3.dim@gmail.com",
      password: "Cheat@2024",
      confirmPassword: "Cheat@2024",
      profile: "https://i.pinimg.com/736x/17/23/43/1723437d84a4428547624048da09ca61.jpg",
    },
  });

  async function onSubmit(data: z.infer<typeof formSchema>) {
    setError(null);
    try {
      console.log("Registering with:", data);
      const result = await register(data).unwrap();
      console.log("Registration success:", result);
      toast.success("Registration successful! 🎉");
      form.reset();
      setTimeout(() => {
        router.push('/login');
      }, 1500);
    } catch (error: any) {
      console.error("Registration failed:", error);
      
      if (error?.status === 'FETCH_ERROR') {
        setError("Cannot connect to server. Please check your network.");
        toast.error("Network error!");
      } else if (error?.data?.error?.description) {
        const errMsg = typeof error.data.error.description === 'object'
          ? Object.values(error.data.error.description)[0]
          : error.data.error.description;
        setError(String(errMsg));
        toast.error(String(errMsg));
      } else if (error?.data?.message) {
        setError(error.data.message);
        toast.error(error.data.message);
      } else {
        setError("Registration failed. Please try again.");
        toast.error("Registration failed!");
      }
    }
  }

  return (
    <Card className="w-full sm:max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">REGISTER FORM</CardTitle>
        <CardDescription className="text-center">============= Welcome ============</CardDescription>
      </CardHeader>
      <CardContent>
        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-600 p-3 rounded-lg text-sm">
            {error}
          </div>
        )}
        <form id="register-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FieldGroup className="space-y-4">
            {/* Profile URL */}
            <Controller
              name="profile"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="profile">Profile URL</FieldLabel>
                  <Input
                    {...field}
                    id="profile"
                    aria-invalid={fieldState.invalid}
                    placeholder="Enter profile URL or upload image"
                    autoComplete="profile"
                    disabled={isRegistering}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            {/* File Upload Component */}
            {/* <FileUploadFillProgressDemo /> */}

            {/* Username & Phone Number */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Controller
                name="username"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="username">Username</FieldLabel>
                    <Input
                      {...field}
                      id="username"
                      aria-invalid={fieldState.invalid}
                      placeholder="Enter username"
                      autoComplete="username"
                      disabled={isRegistering}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <Controller
                name="phoneNumber"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="phoneNumber">Phone Number</FieldLabel>
                    <Input
                      {...field}
                      id="phoneNumber"
                      aria-invalid={fieldState.invalid}
                      placeholder="Enter Phone Number"
                      autoComplete="tel"
                      disabled={isRegistering}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </div>

            {/* Email */}
            <Controller
              name="email"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="email">Email</FieldLabel>
                  <Input
                    {...field}
                    id="email"
                    aria-invalid={fieldState.invalid}
                    placeholder="Enter Email"
                    autoComplete="email"
                    disabled={isRegistering}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            {/* Address */}
            <Controller
              name="address.addressLine1"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="address">Address</FieldLabel>
                  <Input
                    {...field}
                    id="address"
                    aria-invalid={fieldState.invalid}
                    placeholder="Enter address"
                    autoComplete="street-address"
                    disabled={isRegistering}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            {/* Password & Confirm Password */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Controller
                name="password"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="password">Password</FieldLabel>
                    <Input
                      {...field}
                      type="password"
                      id="password"
                      aria-invalid={fieldState.invalid}
                      placeholder="Enter Password"
                      autoComplete="new-password"
                      disabled={isRegistering}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <Controller
                name="confirmPassword"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="confirmPassword">Confirm Password</FieldLabel>
                    <Input
                      {...field}
                      type="password"
                      id="confirmPassword"
                      aria-invalid={fieldState.invalid}
                      placeholder="Enter Confirm Password"
                      autoComplete="new-password"
                      disabled={isRegistering}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </div>
          </FieldGroup>
        </form>
      </CardContent>
      <CardFooter className="flex justify-end gap-3 border-t pt-6">
        <Button
          type="button"
          variant="outline"
          onClick={() => form.reset()}
          disabled={isRegistering}
        >
          Reset
        </Button>
        <Button
          type="submit"
          form="register-form"
          disabled={isRegistering}
          className="min-w-[120px]"
        >
          {isRegistering ? "Registering..." : "Register"}
        </Button>
      </CardFooter>
    </Card>
  );
}