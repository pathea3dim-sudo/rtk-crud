

import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";



type UserLoginType={
    email:string,
    password:string 

}


const authApi=createApi({
    reducerPath: "authApi",

    baseQuery: fetchBaseQuery({baseUrl:process.env.NEXT_PUBLIC_ISHOP_BASE_URL}),
    endpoints: (builder)=>({
        //login
        logininUser:builder.mutation<UserLoginType, unknown>({
            query: ({email, password})=>({
                url: `/auth`,
                method: "POST",
                body:{
                    email,
                    password
                }
            })
        })
    })
})


const {
    userLoginUserMutation
}=authApi;