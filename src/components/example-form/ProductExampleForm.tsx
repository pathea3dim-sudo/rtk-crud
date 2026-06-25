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


"use client";

import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useLoginUserMutation } from "@/services/auth";

type formData = {
    email: string,
    password: string
}

export default function FormExampleComponent() {

    // 1. calling login custom hook
    const [loginRequest, { data: loginResponse, error, isLoading }] = useLoginUserMutation();

    // 2. declare object using useForm
    const {
        register,
        handleSubmit,
        reset,
        setError
    } = useForm<formData>({

        // 3. set default values
        defaultValues: {

            email: "",

            password: ""

        }

    });

    // 4. create handle submit
    const onSubmit = async (data: formData) => {

        try {

            // 5. calling login api
            const response = await loginRequest({

                email: data.email,

                password: data.password

            }).unwrap();

            console.log("Login Response :", response);

            toast.success("You have login successfully!");

            reset();

        } catch (err: any) {

            console.log("Login Error :", err);

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

        <div>

            <form onSubmit={handleSubmit(onSubmit)}>

                {/* email */}

                <label htmlFor="email">
                    Email
                </label>

                <input

                    {...register("email")}

                    type="email"

                    id="email"

                    className="border"

                />

                <br />

                {/* password */}

                <label htmlFor="password">
                    Password
                </label>

                <input

                    {...register("password")}

                    type="password"

                    id="password"

                    className="border"

                />

                <br />

                {/* submit */}

                <button
                    type="submit"
                    className="border px-3 py-2"
                    disabled={isLoading}
                >
                    {isLoading ? "Loading..." : "Login"}
                </button>

            </form>

        </div>

    );
}