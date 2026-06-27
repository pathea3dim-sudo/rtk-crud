// components/example-form/ProductExampleForm.tsx
"use client";

import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useLoginUserMutation } from "@/services/auth";
import { useRouter } from "next/navigation";
import { useState } from "react";

type formData = {
    email: string,
    password: string
}

export default function ProductExampleComponent() {
    const router = useRouter();
    const [loginRequest, { isLoading }] = useLoginUserMutation();
    const [loginError, setLoginError] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm<formData>({
        defaultValues: {
            email: "sokcheatsrorng@gmail.com",
            password: "Cheat@2024"
        }
    });

    const onSubmit = async (data: formData) => {
        setLoginError(null);
        try {
            console.log("Attempting login with:", data.email);
            
            const response = await loginRequest({
                email: data.email,
                password: data.password
            }).unwrap();

            console.log("Login Response:", response);

            // Store token
            const token = response?.token || response?.accessToken || response?.data?.token;
            if (token) {
                localStorage.setItem('accessToken', token);
                console.log("Token stored:", token.substring(0, 20) + "...");
                toast.success("Login successful! 🎉");
                reset();
                
                // Redirect to create product page
                setTimeout(() => {
                    router.push('/createproduct');
                }, 500);
            } else {
                toast.error("No token received from server");
                setLoginError("No token received from server");
            }

        } catch (err: any) {
            console.log("Login Error:", err);
            
            // Only show the error message, don't set form errors
            if (err?.status === 401) {
                setLoginError("Invalid email or password. Please check your credentials.");
                toast.error("Invalid email or password!");
            } else if (err?.status === 404) {
                setLoginError("Login endpoint not found. Please contact support.");
                toast.error("Login endpoint not found!");
            } else if (err?.status === 'FETCH_ERROR') {
                setLoginError("Cannot connect to server. Please check your network.");
                toast.error("Network error!");
            } else if (err?.data?.error?.description) {
                const errMsg = typeof err.data.error.description === 'object' 
                    ? Object.values(err.data.error.description)[0] 
                    : err.data.error.description;
                setLoginError(String(errMsg));
                toast.error(String(errMsg));
            } else if (err?.data?.message) {
                setLoginError(err.data.message);
                toast.error(err.data.message);
            } else {
                setLoginError("Login failed. Please try again.");
                toast.error("Login failed!");
            }
        }
    }

    return (
        <div className="w-full max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
            
            {loginError && (
                <div className="mb-4 bg-red-50 border border-red-200 text-red-600 p-3 rounded-lg text-sm">
                    {loginError}
                </div>
            )}
            
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                    <label htmlFor="email" className="block text-sm font-medium mb-1">
                        Email
                    </label>
                    <input
                        {...register("email", { 
                            required: "Email is required",
                            pattern: {
                                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                message: "Please enter a valid email address"
                            }
                        })}
                        type="email"
                        id="email"
                        className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter your email"
                        disabled={isLoading}
                    />
                    {errors.email && (
                        <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                    )}
                </div>

                <div>
                    <label htmlFor="password" className="block text-sm font-medium mb-1">
                        Password
                    </label>
                    <input
                        {...register("password", { 
                            required: "Password is required",
                            minLength: {
                                value: 8,
                                message: "Password must be at least 8 characters"
                            }
                        })}
                        type="password"
                        id="password"
                        className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter your password"
                        disabled={isLoading}
                    />
                    {errors.password && (
                        <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
                    )}
                </div>

                <button
                    type="submit"
                    className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
                    disabled={isLoading}
                >
                    {isLoading ? "Logging in..." : "Login"}
                </button>
                
                <p className="text-sm text-gray-500 text-center mt-2">
                    Don't have an account?{" "}
                    <a href="/register" className="text-blue-500 hover:underline">
                        Create Account
                    </a>
                </p>
            </form>
        </div>
    );
}