
// import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
// import { CreateProductType, ProductResponse, ProductType, UpdateProductType } from '@/lib/products';

// export const ecommerceApi = createApi({
//   reducerPath: 'ecommerceApi',
//   baseQuery: fetchBaseQuery({
//     baseUrl: `${process.env.NEXT_PUBLIC_ISHOP_BASE_URL}`,
//     prepareHeaders: (headers) => {
//       const token = process.env.NEXT_PUBLIC_ACCESS_TOKEN;
//       if (token) {
//         headers.set('authorization', `Bearer ${token}`);
//       }
//       headers.set('content-type', 'application/json');
//       return headers;
//     },
//   }),
//   tagTypes: ["Products"],
  
//   endpoints: (builder) => ({
//     getAllProduct: builder.query<ProductResponse, { page: number; size: number }>({
//       query: ({ page, size }) => `/products?page=${page}&size=${size}`,
//       providesTags: ["Products"],
//     }),

//     getProductByUuid: builder.query<ProductType, string>({
//       query: (uuid: string) => ({
//         url: `/products/${uuid}`,
//       }),
//       providesTags: (result, error, uuid) => [{ type: 'Products', id: uuid }],
//     }),

//     createProduct: builder.mutation<ProductType, CreateProductType>({
//       query: (newProduct) => ({
//         url: `/products`,
//         method: 'POST',
//         body: newProduct,
//       }),
//       invalidatesTags: ["Products"],
//     }),

//     updateProduct: builder.mutation<ProductType, { uuid: string; data: UpdateProductType }>({
//       query: ({ uuid, data }) => ({
//         url: `/products/${uuid}`,
//         method: 'PUT',
//         body: data,
//       }),
//       invalidatesTags: ["Products"],
//     }),

//     deleteProduct: builder.mutation<void, string>({
//       query: (uuid) => ({
//         url: `/products/${uuid}`,
//         method: 'DELETE',
//       }),
//       invalidatesTags: ["Products"],
//     }),
//   }),
// });

// export const {
//   useGetAllProductQuery,
//   useGetProductByUuidQuery,
//   useCreateProductMutation,
//   useUpdateProductMutation,
//   useDeleteProductMutation,
// } = ecommerceApi;















import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { ProductForm } from "@/components/product-form/product-form-schema";

// Define the API response interface matching your backend design
export interface ProductResponse {
  success: boolean;
  message?: string;
  data?: ProductForm & {
    id?: number;
    uuid?: string;
    createdAt?: string;
    updatedAt?: string;
  };
}

export const ecommerceApi = createApi({
  reducerPath: "ecommerceApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.NEXT_PUBLIC_ISHOP_BASE_URL}`,
    prepareHeaders: (headers) => {
      // Automatically grab the token on every request if it exists
      const token = localStorage.getItem("accessToken");
      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["Products"],
  endpoints: (builder) => ({
    // Mutation matching your component's useCreateProductMutation() hook
    createProduct: builder.mutation<ProductResponse, ProductForm>({
      query: (newProduct) => ({
        url: "/products", // Adjust the endpoint mapping to your actual API route
        method: "POST",
        body: newProduct,
      }),
      // Invalidates the list cache so the updated view pulls fresh data automatically
      invalidatesTags: ["Products"],
    }),
  }),
});

export const { useCreateProductMutation } = ecommerceApi;