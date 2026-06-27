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

const formSchema = z.object({
  username: z
    .string()
    .min(3, "Username must be at least 3 characters.")
    .max(32, "Username must be at most 32 characters."),
  phoneNumber: z
    .string()
    .min(10, "Phone number must be at least 10 characters.")
    .max(15, "Phone number must be at most 15 characters."),
  address: z.object({
    addressLine1: z.string().min(1, "Address line 1 is required"),
    addressLine2: z.string().optional(),
    road: z.string().optional(),
    linkAddress: z.string().optional(),
  }),
  email: z.string().email("Invalid email format. Please enter a valid email."),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      "Password must contain at least one uppercase letter, one lowercase letter, one digit, and one special character (@$!%*?&)"
    ),
  confirmPassword: z.string().min(1, "Confirm password is required"),
  profile: z.string().optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export default function RegisterForm() {
  const [register, { isLoading }] = useRegisterUserMutation();
  const [error, setError] = useState<string | null>(null);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "pathea",
      phoneNumber: "023333333333",
      address: {
        addressLine1: "123 Street",
        addressLine2: "Apt 4B",
        road: "Main Road",
        linkAddress: "https://maps.google.com",
      },
      email: "pathea3.dim@gmail.com",
      password: "Cheat@2024", // Use a valid password!
      confirmPassword: "Cheat@2024",
      profile: "https://ui-avatars.com/api/?name=Pathea",
    },
  });

  async function onSubmit(data: z.infer<typeof formSchema>) {
    setError(null);
    try {
      console.log("Sending registration data:", data);
      const result = await register(data).unwrap();
      console.log("Registration success:", result);
      toast.success("Registration successful! Please login.");
      form.reset();
      setTimeout(() => {
        window.location.href = '/login';
      }, 2000);
    } catch (error: any) {
      console.error("Registration failed - Full error:", error);
      
      // Check if it's a network error
      if (error?.status === 'FETCH_ERROR' || error?.message?.includes('fetch')) {
        toast.error("Cannot connect to server. Please check your network.");
        setError("Network error. Please check if the API server is running.");
      } else if (error?.data?.error?.description) {
        const errors = error.data.error.description;
        if (typeof errors === 'object') {
          const firstError = Object.values(errors)[0];
          toast.error(String(firstError));
          setError(String(firstError));
        } else {
          toast.error(String(errors));
          setError(String(errors));
        }
      } else if (error?.data?.message) {
        toast.error(error.data.message);
        setError(error.data.message);
      } else {
        toast.error("Registration failed. Please try again.");
        setError("Registration failed. Please check your inputs.");
      }
    }
  }

  return (
    <Card className="w-full sm:max-w-md">
      <CardHeader>
        <CardTitle>Register Form</CardTitle>
        <CardDescription>Create your account to get started</CardDescription>
      </CardHeader>
      <CardContent>
        <form id="form-rhf-input" onSubmit={form.handleSubmit(onSubmit)}>
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
                  <FieldLabel htmlFor="username">Username</FieldLabel>
                  <Input
                    {...field}
                    id="username"
                    placeholder="Enter username"
                    autoComplete="username"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            
            <Controller
              name="email"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="email">Email</FieldLabel>
                  <Input
                    {...field}
                    id="email"
                    type="email"
                    placeholder="Enter email"
                    autoComplete="email"
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
                    placeholder="Enter phone number"
                    autoComplete="tel"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            
            <Controller
              name="address.addressLine1"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="addressLine1">Address</FieldLabel>
                  <Input
                    {...field}
                    id="addressLine1"
                    placeholder="Enter address"
                    autoComplete="street-address"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            
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
                    placeholder="Enter password"
                    autoComplete="new-password"
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
                    placeholder="Confirm password"
                    autoComplete="new-password"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="profile"
              control={form.control}
              render={({ field }) => (
                <Field>
                  <FieldLabel htmlFor="profile">Profile Image URL (Optional)</FieldLabel>
                  <Input
                    {...field}
                    id="profile"
                    placeholder="https://example.com/avatar.jpg"
                  />
                </Field>
              )}
            />
          </FieldGroup>
        </form>
      </CardContent>
      <CardFooter className="flex justify-end gap-2">
        <Button 
          type="button" 
          variant="outline" 
          onClick={() => form.reset()}
          disabled={isLoading}
        >
          Reset
        </Button>
        <Button 
          type="submit" 
          form="form-rhf-input" 
          disabled={isLoading}
        >
          {isLoading ? "Registering..." : "Register"}
        </Button>
      </CardFooter>
    </Card>
  );
}