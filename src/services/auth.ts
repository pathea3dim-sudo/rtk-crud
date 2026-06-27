// // // import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// // // export type UserLoginType ={ 
// // //     email :string,
// // //     password:string
// // // }
// // // export type UserRegisterType ={
// // //   username: string,
// // //   phoneNumber: string,
// // //   address: {
// // //     addressLine1: string,
// // //     addressLine2: string,
// // //     road: string,
// // //     linkAddress: string
// // //   },
// // //   email: string,
// // //   password: string,
// // //   confirmPassword: string,
// // //   profile: string
// // // }
// // // export const authApi = createApi({
// // //     reducerPath:"authApi",
// // //     baseQuery:fetchBaseQuery({
// // //         baseUrl : `${process.env.NEXT_PUBLIC_ISHOP_BASE_URL}`
// // //     }),
// // //     endpoints:(builder)=>({
// // //         loginUser : builder.mutation<UserLoginType,UserLoginType, unknown>({
// // //             query:(payload)=>({
// // //                 url: `/auth/login`,
// // //                 method:"POST",      
// // //                 body:payload
// // //                 // body:{
// // //                 //     email,
// // //                 //     password
// // //                 // }
// // //             })
// // //         }),

// // //          registerUser : builder.mutation<UserRegisterType,UserRegisterType>({
// // //             query:(payload)=>({
// // //                 url: `/users/user-signup`,
// // //                 method:"POST",      
// // //                 body:payload
// // //             })
// // //         })
// // //     })
// // // })


















// // // // services/auth.ts
// // // import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// // // export type UserLoginType = {
// // //   email: string;
// // //   password: string;
// // // };

// // // export type UserRegisterType = {
// // //   username: string;
// // //   phoneNumber: string;
// // //   address: {
// // //     addressLine1: string;
// // //     addressLine2: string;
// // //     road: string;
// // //     linkAddress: string;
// // //   };
// // //   email: string;
// // //   password: string;
// // //   confirmPassword: string;
// // //   profile: string;
// // // };

// // // export type LoginResponse = {
// // //   token?: string;
// // //   accessToken?: string;
// // //   data?: {
// // //     token?: string;
// // //     accessToken?: string;
// // //   };
// // //   user?: any;
// // // };

// // // export const authApi = createApi({
// // //   reducerPath: "authApi",
// // //   baseQuery: fetchBaseQuery({
// // //     baseUrl: `${process.env.NEXT_PUBLIC_ISHOP_BASE_URL}`,
// // //     credentials: 'include',
// // //     prepareHeaders: (headers) => {
// // //       const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
// // //       if (token) {
// // //         headers.set('authorization', `Bearer ${token}`);
// // //       }
// // //       headers.set('Content-Type', 'application/json');
// // //       return headers;
// // //     },
// // //   }),
// // //   endpoints: (builder) => ({
// // //     loginUser: builder.mutation<LoginResponse, UserLoginType>({
// // //       query: ({ email, password }) => ({
// // //         url: `/auth/login`,
// // //         method: "POST",
// // //         body: { email, password },
// // //       }),
// // //       // Transform response to handle different token formats
// // //       transformResponse: (response: any) => {
// // //         // Store token if present in response
// // //         const token = response?.token || response?.accessToken || response?.data?.token || response?.data?.accessToken;
// // //         if (token && typeof window !== 'undefined') {
// // //           localStorage.setItem('accessToken', token);
// // //           console.log('Token stored successfully');
// // //         }
// // //         return response;
// // //       },
// // //     }),

// // //     registerUser: builder.mutation<any, UserRegisterType>({
// // //       query: (payload) => ({
// // //         url: `/users/user-signup`,
// // //         method: "POST",
// // //         body: payload,
// // //       }),
// // //     }),

// // //     logoutUser: builder.mutation<void, void>({
// // //       query: () => ({
// // //         url: `/auth/logout`,
// // //         method: "POST",
// // //       }),
// // //       // Clear token on logout
// // //       onQueryStarted: async (_, { queryFulfilled }) => {
// // //         await queryFulfilled;
// // //         if (typeof window !== 'undefined') {
// // //           localStorage.removeItem('accessToken');
// // //           console.log('Token removed');
// // //         }
// // //       },
// // //     }),
// // //   }),
// // // });

// // // export const { 
// // //   useLoginUserMutation, 
// // //   useRegisterUserMutation,
// // //   useLogoutUserMutation 
// // // } = authApi;








// // import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// // export type UserLoginType = {
// //   email: string;
// //   password: string;
// // };

// // export type UserRegisterType = {
// //   username: string;
// //   phoneNumber: string;
// //   address: {
// //     addressLine1: string;
// //     addressLine2: string;
// //     road: string;
// //     linkAddress: string;
// //   };
// //   email: string;
// //   password: string;
// //   confirmPassword: string;
// //   profile: string;
// // };

// // export type LoginResponse = {
// //   token?: string;
// //   accessToken?: string;
// //   data?: {
// //     token?: string;
// //     accessToken?: string;
// //   };
// //   user?: any;
// // };

// // export const authApi = createApi({
// //   reducerPath: "authApi",
// //   baseQuery: fetchBaseQuery({
// //     baseUrl: process.env.NEXT_PUBLIC_ISHOP_BASE_URL || "http://localhost:5000/api",
// //     credentials: 'include',
// //     prepareHeaders: (headers) => {
// //       const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
// //       if (token) {
// //         headers.set('authorization', `Bearer ${token}`);
// //       }
// //       headers.set('Content-Type', 'application/json');
// //       return headers;
// //     },
// //   }),
// //   endpoints: (builder) => ({
// //     loginUser: builder.mutation<LoginResponse, UserLoginType>({
// //       query: ({ email, password }) => ({
// //         url: `/auth/login`,
// //         method: "POST",
// //         body: { email, password },
// //       }),
// //       transformResponse: (response: any) => {
// //         const token = response?.token || response?.accessToken || response?.data?.token || response?.data?.accessToken;
// //         if (token && typeof window !== 'undefined') {
// //           localStorage.setItem('accessToken', token);
// //           console.log('Token stored successfully');
// //         }
// //         return response;
// //       },
// //     }),

// //     registerUser: builder.mutation<any, UserRegisterType>({
// //       query: (payload) => {
// //         console.log("Registering user with payload:", payload);
// //         return {
// //           url: `/auth/register`, // Make sure this matches your backend route
// //           method: "POST",
// //           body: payload,
// //         };
// //       },
// //     }),

// //     logoutUser: builder.mutation<void, void>({
// //       query: () => ({
// //         url: `/auth/logout`,
// //         method: "POST",
// //       }),
// //       onQueryStarted: async (_, { queryFulfilled }) => {
// //         await queryFulfilled;
// //         if (typeof window !== 'undefined') {
// //           localStorage.removeItem('accessToken');
// //           console.log('Token removed');
// //         }
// //       },
// //     }),
// //   }),
// // });

// // export const { 
// //   useLoginUserMutation, 
// //   useRegisterUserMutation,
// //   useLogoutUserMutation 
// // } = authApi;







// import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// export type UserLoginType = {
//   email: string;
//   password: string;
// };

// export type UserRegisterType = {
//   username: string;
//   phoneNumber: string;
//   address: {
//     addressLine1: string;
//     addressLine2: string;
//     road: string;
//     linkAddress: string;
//   };
//   email: string;
//   password: string;
//   confirmPassword: string;
//   profile: string;
// };

// export type LoginResponse = {
//   token?: string;
//   accessToken?: string;
//   data?: {
//     token?: string;
//     accessToken?: string;
//   };
//   user?: any;
// };

// export const authApi = createApi({
//   reducerPath: "authApi",
//   baseQuery: fetchBaseQuery({
//     // Use the actual API URL
//     baseUrl: process.env.NEXT_PUBLIC_ISHOP_BASE_URL || "https://ishop.cheat.casa/api/v1",
//     credentials: 'include',
//     prepareHeaders: (headers) => {
//       const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
//       if (token) {
//         headers.set('authorization', `Bearer ${token}`);
//       }
//       headers.set('Content-Type', 'application/json');
//       return headers;
//     },
//   }),
//   endpoints: (builder) => ({
//     loginUser: builder.mutation<LoginResponse, UserLoginType>({
//       query: ({ email, password }) => ({
//         url: `/auth/login`, // Make sure this endpoint exists
//         method: "POST",
//         body: { email, password },
//       }),
//       transformResponse: (response: any) => {
//         const token = response?.token || response?.accessToken || response?.data?.token || response?.data?.accessToken;
//         if (token && typeof window !== 'undefined') {
//           localStorage.setItem('accessToken', token);
//           console.log('Token stored successfully');
//         }
//         return response;
//       },
//     }),

//     registerUser: builder.mutation<any, UserRegisterType>({
//       query: (payload) => {
//         // Add emailVerified=true to the URL
//         return {
//           url: `/users/user-signup?emailVerified=true`,
//           method: "POST",
//           body: {
//             username: payload.username,
//             phoneNumber: payload.phoneNumber,
//             address: payload.address,
//             email: payload.email,
//             password: payload.password,
//             confirmPassword: payload.confirmPassword,
//             profile: payload.profile || "https://ui-avatars.com/api/?name=" + payload.username,
//           },
//         };
//       },
//     }),

//     logoutUser: builder.mutation<void, void>({
//       query: () => ({
//         url: `/auth/logout`,
//         method: "POST",
//       }),
//       onQueryStarted: async (_, { queryFulfilled }) => {
//         await queryFulfilled;
//         if (typeof window !== 'undefined') {
//           localStorage.removeItem('accessToken');
//           console.log('Token removed');
//         }
//       },
//     }),
//   }),
// });

// export const { 
//   useLoginUserMutation, 
//   useRegisterUserMutation,
//   useLogoutUserMutation 
// } = authApi;








import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export type UserLoginType = {
  email: string;
  password: string;
};

export type UserRegisterType = {
  username: string;
  phoneNumber: string;
  address: {
    addressLine1: string;
    addressLine2: string;
    road: string;
    linkAddress: string;
  };
  email: string;
  password: string;
  confirmPassword: string;
  profile: string;
};

export type LoginResponse = {
  token?: string;
  accessToken?: string;
  data?: {
    token?: string;
    accessToken?: string;
  };
  user?: any;
};

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({
    // Use relative URL for proxy
    baseUrl: '/api/v1', // This will use the proxy
    // OR use the full URL if proxy doesn't work:
    // baseUrl: process.env.NEXT_PUBLIC_ISHOP_BASE_URL || "https://ishop.cheat.casa/api/v1",
    credentials: 'include',
    prepareHeaders: (headers) => {
      const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      headers.set('Content-Type', 'application/json');
      return headers;
    },
  }),
  endpoints: (builder) => ({
    loginUser: builder.mutation<LoginResponse, UserLoginType>({
      query: ({ email, password }) => ({
        url: `/auth/login`,
        method: "POST",
        body: { email, password },
      }),
      transformResponse: (response: any) => {
        const token = response?.token || response?.accessToken || response?.data?.token || response?.data?.accessToken;
        if (token && typeof window !== 'undefined') {
          localStorage.setItem('accessToken', token);
          console.log('Token stored successfully');
        }
        return response;
      },
    }),

    registerUser: builder.mutation<any, UserRegisterType>({
      query: (payload) => ({
        url: `/users/user-signup?emailVerified=true`,
        method: "POST",
        body: {
          username: payload.username,
          phoneNumber: payload.phoneNumber,
          address: payload.address,
          email: payload.email,
          password: payload.password,
          confirmPassword: payload.confirmPassword,
          profile: payload.profile || `https://ui-avatars.com/api/?name=${payload.username}`,
        },
      }),
    }),

    logoutUser: builder.mutation<void, void>({
      query: () => ({
        url: `/auth/logout`,
        method: "POST",
      }),
      onQueryStarted: async (_, { queryFulfilled }) => {
        await queryFulfilled;
        if (typeof window !== 'undefined') {
          localStorage.removeItem('accessToken');
          console.log('Token removed');
        }
      },
    }),
  }),
});

export const { 
  useLoginUserMutation, 
  useRegisterUserMutation,
  useLogoutUserMutation 
} = authApi;