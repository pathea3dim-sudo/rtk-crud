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

const formSchema = z.object({
  username: z
    .string()
    .min(5, "Username must be at least 5 characters.")
    .max(32, "Username must be at most 32 characters."),
  phoneNumber: z
    .string()
    .min(10, "Phone number must be at least 10 characters."),
  address: z.object({
    addressLine1: z.string().optional(),
    addressLine2: z.string().optional(),
    road: z.string().optional(),
    linkAddress: z.string().optional(),
  }),
  email: z.string().email("Invalid email address"),
  password: z.string().min(4, "Password at least 4 characters"),
  confirmPassword: z.string().min(4, "Confirm password at least 4 characters"),
  profile: z.string().optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export default function RegisterForm() {
  const [register, { isLoading }] = useRegisterUserMutation();
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      phoneNumber: "",
      address: {
        addressLine1: "",
        addressLine2: "",
        road: "",
        linkAddress: "",
      },
      email: "",
      password: "",
      confirmPassword: "",
      profile: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSmQiqtKTYEE5qoxNlNQEcvI7VPyYjAHjbVY5gh_7_MAw&s=10",
    },
  });

  async function onSubmit(data: z.infer<typeof formSchema>) {
    try {
      console.log("Sending registration data:", data);
      const result = await register(data).unwrap();
      console.log("Registration success:", result);
      form.reset();
    } catch (error) {
      console.error("Registration failed:", error);
    }
  }

  return (
    <Card className="w-full sm:max-w-md">
      <CardHeader>
        <CardTitle>Register Form</CardTitle>
        <CardDescription>======== WELCOME ==========</CardDescription>
      </CardHeader>
      <CardContent>
        <form id="form-rhf-input" onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            <Controller
              name="profile"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-rhf-input-profile">
                    Profile Url (Optional)
                  </FieldLabel>
                  <Input
                    {...field}
                    id="form-rhf-input-profile"
                    aria-invalid={fieldState.invalid}
                    placeholder="Enter profile URL"
                    autoComplete="profile"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            
            <Controller
              name="username"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-rhf-input-username">
                    Username
                  </FieldLabel>
                  <Input
                    {...field}
                    id="form-rhf-input-username"
                    aria-invalid={fieldState.invalid}
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
              name="phoneNumber"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-rhf-input-phoneNumber">
                    Phone Number
                  </FieldLabel>
                  <Input
                    {...field}
                    id="form-rhf-input-phoneNumber"
                    aria-invalid={fieldState.invalid}
                    placeholder="Enter Phone Number"
                    autoComplete="tel"
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
                  <FieldLabel htmlFor="form-rhf-input-email">Email</FieldLabel>
                  <Input
                    {...field}
                    id="form-rhf-input-email"
                    aria-invalid={fieldState.invalid}
                    placeholder="Enter Email"
                    autoComplete="email"
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
                  <FieldLabel htmlFor="form-rhf-input-password">
                    Password
                  </FieldLabel>
                  <Input
                    {...field}
                    type="password"
                    id="form-rhf-input-password"
                    aria-invalid={fieldState.invalid}
                    placeholder="Enter Password"
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
                  <FieldLabel htmlFor="form-rhf-input-confirmPassword">
                    Confirm Password
                  </FieldLabel>
                  <Input
                    {...field}
                    type="password"
                    id="form-rhf-input-confirmPassword"
                    aria-invalid={fieldState.invalid}
                    placeholder="Enter Confirm Password"
                    autoComplete="new-password"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </FieldGroup>
        </form>
      </CardContent>
      <CardFooter>
        <Field orientation="horizontal">
          <Button type="button" variant="outline" onClick={() => form.reset()}>
            Reset
          </Button>
          <Button type="submit" form="form-rhf-input" disabled={isLoading}>
            {isLoading ? "Registering..." : "Register"}
          </Button>
        </Field>
      </CardFooter>
    </Card>
  );
}