// src/services/auth.ts
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

// Get base URL with fallback
const getBaseUrl = () => {
  const envUrl = process.env.NEXT_PUBLIC_ISHOP_BASE_URL;
  if (envUrl) {
    console.log("Using env URL:", envUrl);
    return envUrl;
  }
  // Fallback URL
  console.log("Using fallback URL: https://ishop.cheat.casa/api/v1");
  return "https://ishop.cheat.casa/api/v1";
};

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({
    baseUrl: getBaseUrl(),
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
    // Fixed: Changed from /auth/login to /users/login
    loginUser: builder.mutation<LoginResponse, UserLoginType>({
      query: (payload) => ({
        url: `/users/login`,  // ← Fixed endpoint
        method: "POST",
        body: payload,
      }),
      transformResponse: (response: any) => {
        const token = response?.token || response?.accessToken || response?.data?.token;
        if (token && typeof window !== 'undefined') {
          localStorage.setItem('accessToken', token);
          console.log('Token stored successfully');
        }
        return response;
      },
    }),

    // Fixed: Added ?emailVerified=true
    registerUser: builder.mutation<any, UserRegisterType>({
      query: (payload) => ({
        url: `/users/user-signup?emailVerified=true`,  // ← Fixed with parameter
        method: "POST",
        body: payload,
      }),
    }),

    logoutUser: builder.mutation<void, void>({
      query: () => ({
        url: `/users/logout`,
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
  useLogoutUserMutation,
} = authApi;