

"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { profile } from "console";
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
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "../ui/field";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useMutation, useRegisterUserMutation } from ".././../services/auth";

const formSchema = z.object({
  username: z
    .string()
    .min(5, "Username must be at least 5 characters.")
    .max(32, "Username must be at most 32 characters."),
  phoneNumber: z
    .string()
    .min(10, "Phone number must be at least 10 characters."),
  address: z.object({
    addressLine1: z.string(),
    addressLine2: z.string(),
    road: z.string(),
    linkAddress: z.string(),
  }),
  email: z.email(),
  password: z.string().min(4, "Password at least 4 characters"),
  confirmPassword: z.string().min(4, "Confirm password at least 4 characters"),
  profile: z.string(),
});

export function RegisterForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "pathea",
      phoneNumber: "023333333333",
      address: {
        addressLine1: "Optional",
        addressLine2: "Optional",
        road: "Optional",
        linkAddress: "Optional",
      },
      email: "dim.pathea@gmail.com",
      password: "pathea@123",
      confirmPassword: "pathea@123",
      profile:"https://img.magnific.com/free-vector/cute-dino-dracula-vampire-cartoon-vector-icon-illustration-animal-holiday-icon-isolated-flat-vector_138676-11365.jpg?semt=ais_hybrid&w=740&q=80"
    },
  });
//   const [register] = useRegisterUserMutation();
const [registe]=useRegisterUserMutation();
  function onSubmit(data: z.infer<typeof formSchema>) {
    try {
      console.log(data);
      register(data);
      console.log("Registration success");
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
                    Profile Url
                  </FieldLabel>
                  <Input
                    {...field}
                    id="form-rhf-input-profile"
                    aria-invalid={fieldState.invalid}
                    placeholder="Enter profile"
                    autoComplete="profile"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <div className="flex gap-5">
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
                      placeholder="Enter uername"
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
                      autoComplete="phoneNumber"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </div>
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
                    Confirm Password
                  </FieldLabel>
                  <Input
                    {...field}
                    id="form-rhf-input-password"
                    aria-invalid={fieldState.invalid}
                    placeholder="Enter Password"
                    autoComplete="password"
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
                    id="form-rhf-input-confirmPassword"
                    aria-invalid={fieldState.invalid}
                    placeholder="Enter Confirm Password"
                    autoComplete="confirmPassword"
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
          <Button type="submit" form="form-rhf-input">
            Save
          </Button>
        </Field>
      </CardFooter>
    </Card>
  );
}
