// src/components/auth/register-form.tsx - Simplified
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
} from "../ui/card";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "../ui/field";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useRegisterUserMutation } from "../../services/auth";
import { toast } from "sonner";
import { useState } from "react";
import { useRouter } from "next/navigation";

// Simplified schema
const formSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  phoneNumber: z.string().min(10, "Phone number must be at least 10 characters"),
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

export default function RegisterForm() {
  const router = useRouter();
  const [register, { isLoading }] = useRegisterUserMutation();
  const [error, setError] = useState<string | null>(null);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "sokcheat",
      phoneNumber: "023333333333",
      address: {
        addressLine1: "123 Street",
        addressLine2: "",
        road: "",
        linkAddress: "",
      },
      email: "sokcheatsrorng@gmail.com",
      password: "Cheat@2024",
      confirmPassword: "Cheat@2024",
      profile: "https://ui-avatars.com/api/?name=Sok+Cheat",
    },
  });

  async function onSubmit(data: z.infer<typeof formSchema>) {
    setError(null);
    try {
      console.log("Registering:", data);
      const result = await register(data).unwrap();
      console.log("Registration success:", result);
      toast.success("Registration successful! Please login.");
      form.reset();
      setTimeout(() => router.push('/login'), 1500);
    } catch (error: any) {
      console.error("Registration failed:", error);
      
      if (error?.data?.error?.description) {
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
        toast.error("Registration failed");
      }
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Create Account</CardTitle>
        <CardDescription>Register to get started</CardDescription>
      </CardHeader>
      <CardContent>
        <form id="register-form" onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup className="space-y-4">
            {error && (
              <div className="bg-destructive/10 text-destructive p-3 rounded-md text-sm">
                {error}
              </div>
            )}
            
            <Controller
              name="username"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Username *</FieldLabel>
                  <Input {...field} placeholder="Enter username" disabled={isLoading} />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
            
            <Controller
              name="email"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Email *</FieldLabel>
                  <Input {...field} type="email" placeholder="Enter email" disabled={isLoading} />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
            
            <Controller
              name="phoneNumber"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Phone Number *</FieldLabel>
                  <Input {...field} placeholder="Enter phone number" disabled={isLoading} />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
            
            <Controller
              name="address.addressLine1"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Address *</FieldLabel>
                  <Input {...field} placeholder="Enter address" disabled={isLoading} />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
            
            <Controller
              name="password"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Password *</FieldLabel>
                  <Input {...field} type="password" placeholder="Enter password" disabled={isLoading} />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
            
            <Controller
              name="confirmPassword"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Confirm Password *</FieldLabel>
                  <Input {...field} type="password" placeholder="Confirm password" disabled={isLoading} />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
          </FieldGroup>
        </form>
      </CardContent>
      <CardFooter className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={() => form.reset()} disabled={isLoading}>
          Reset
        </Button>
        <Button type="submit" form="register-form" disabled={isLoading}>
          {isLoading ? "Registering..." : "Create Account"}
        </Button>
      </CardFooter>
    </Card>
  );
}