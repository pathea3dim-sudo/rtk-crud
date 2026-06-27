// "use client"
// // import { useLoginUserMutation } from "@/services/auth";
// import { error } from "console";
// import { useForm } from "react-hook-form"
// import { toast } from "sonner";
// import { email } from "zod";
// import { useLoginUserMutation } from "@/services/auth";

// type formData = {
//   email: string,
//   password: string
// }

// export default function FormExampleComponent() {
//   // calling login custom hook
//   const [loginRequest, {data:loginResponse,error}] = useLoginUserMutation();
//   // 1. delcare object using with useForm
//   const {
//     register,
//     handleSubmit,
//     reset,
//     setError
//   }= useForm({
//     // 2. set default values
//     defaultValues:{
//       email: "",
//       password: ""
//     }
//   });

//   // 3. create handleSubmit to track value from input form 
//   const onSubmit = (data: formData)=> {
//       try{
//         loginRequest(
//         {
//           email: data?.email,
//           password: data?.password
//         }
//        )
//        console.log(error)

//        if(data != null){
//          toast("You have login successfully!")
//        }
//       }catch(error){
//         toast.error("You need to login again!")
//       }
//       //  console.log("===> Form Data Email: ", data?.email);
//       //  console.log("===> Form Data Password: ", data?.password);
//   }
//   return (
//     <div>
//       <form onSubmit={handleSubmit(onSubmit)}>
//         {/* input email */}
//         <label htmlFor="email">Email</label>
//         <input 
//         {...register("email")}
//         type="email"
//         name="email" 
//         id="email" 
//         className="border"
//         />

//         {/* password */}
//         <label htmlFor="password">Password</label>
//         <input 
//         {...register("password")}
//         type="password"
//         name="password" 
//         id="password"
//          className="border"
//          />

//         {/* submit */}
//         <button type="submit"  className="border">Submit</button>
//       </form>
      
//     </div>
//   )
// }

// components/example-form/ProductExampleForm.tsx
"use client";

import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useLoginUserMutation } from "@/services/auth";
import { useRouter } from "next/navigation";

type formData = {
    email: string,
    password: string
}

export default function ProductExampleComponent() {
    const router = useRouter();
    const [loginRequest, { isLoading }] = useLoginUserMutation();

    const {
        register,
        handleSubmit,
        reset,
        setError,
        formState: { errors }
    } = useForm<formData>({
        defaultValues: {
            email: "",
            password: ""
        }
    });

    const onSubmit = async (data: formData) => {
        try {
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
                toast.success("Login successful!");
                reset();
                
                // Redirect to create product page
                router.push('/createproduct');
            } else {
                toast.error("No token received from server");
            }

        } catch (err: any) {
            console.log("Login Error:", err);
            toast.error("Email or Password is incorrect!");

            setError("email", {
                message: "Invalid Email"
            });
            setError("password", {
                message: "Invalid Password"
            });
        }
    }

    return (
        <div className="w-full max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                    <label htmlFor="email" className="block text-sm font-medium mb-1">
                        Email
                    </label>
                    <input
                        {...register("email", { required: "Email is required" })}
                        type="email"
                        id="email"
                        className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter your email"
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
                        {...register("password", { required: "Password is required" })}
                        type="password"
                        id="password"
                        className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter your password"
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
            </form>
        </div>
    );
}