// // import { UpdateProductType } from './../components/tables/Columns';

// import { UpdateProductType } from '@/lib/products';
// import { CreateProductType, ProductResponse, ProductType } from '@/lib/products';
// import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react'


// export const ecommerceApi= createApi({
//   reducerPath: 'ecommerceApi',
//   baseQuery: fetchBaseQuery({baseUrl: `${process.env.NEXT_PUBLIC_ISHOP_BASE_URL}`}),
//     tagTypes: ["Products"],

//   endpoints: (builder)=>({
//     // getAllProducts
//      getAllProduct: builder.query<ProductResponse,{page:number,size:number}>({
//       query: ({page, size}) => `/products?page=${page}&size=${size}`,
//        providesTags: ["Products"]
//      }),
//     //  getProductByUUid
//     getProductByUuid: builder.query<ProductType, string>({
//       query: (uuid: string) => ({
//         url: `/products/${uuid}`,providesTags: ["Products"]
//       })
//     }),
//     // create Product
//     createProduct : builder.mutation<CreateProductType,unknown,unknown>({
//       query: (newProduct:CreateProductType)=> ({
//          url: `/products`,
//          method: 'POST',
//          headers: {
//           'content-type': 'application/json',
//           Authorization: `bearer ${process.env.NEXT_PUBLIC_ACCESS_TOKEN}`
//          },
//          body: newProduct
//       }),
//             invalidatesTags: ["Products"]
//     }),
//     updateProduct: builder.mutation<
//       ProductType, 
//       { uuid: string; data: UpdateProductType }>({
//       query: ({ uuid, data }) => ({
//         url: `/products/${uuid}`,
//         method: "PUT",
//            headers: {
//             "Content-Type": "application/json",
//             Authorization: `bearer ${process.env.NEXT_PUBLIC_ACCESS_TOKEN}`,
//           },
//         body: data,
//       }),
//             invalidatesTags: ["Products"]
//     }),
//     deleteProduct: builder.mutation<void, string>({
//       query: (uuid) => ({
//         url: `/products/${uuid}`,
//           method: "DELETE",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `bearer ${process.env.NEXT_PUBLIC_ACCESS_TOKEN}`,
//           },
//       }),
//             invalidatesTags: ["Products"]
//     })
//   })
// })

// export const {
//  useGetAllProductQuery,
//  useGetProductByUuidQuery, 
//  useCreateProductMutation,
//  useDeleteProductMutation,
//  useUpdateProductMutation
// } = ecommerceApi;


// services/ecommerce.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { CreateProductType, ProductResponse, ProductType, UpdateProductType } from '@/lib/products';

export const ecommerceApi = createApi({
  reducerPath: 'ecommerceApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.NEXT_PUBLIC_ISHOP_BASE_URL}`,
    prepareHeaders: (headers) => {
      const token = process.env.NEXT_PUBLIC_ACCESS_TOKEN;
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      headers.set('content-type', 'application/json');
      return headers;
    },
  }),
  endpoints: (builder) => ({
    // ===== READ - Get All Products =====
    getAllProduct: builder.query<ProductResponse, { page: number; size: number }>({
      query: ({ page, size }) => `/products?page=${page}&size=${size}`,
    }),

    // ===== READ - Get Product by UUID =====
    getProductByUuid: builder.query<ProductType, string>({
      query: (uuid: string) => ({
        url: `/products/${uuid}`,
      }),
    }),

    // ===== CREATE - Create Product =====
    createProduct: builder.mutation<CreateProductType, any>({
      query: (newProduct) => ({
        url: `/products`,
        method: 'POST',
        body: newProduct,
      }),
    }),

    // ===== UPDATE - Update Product =====
    updateProduct: builder.mutation<UpdateProductType, { uuid: string; data: UpdateProductType }>({
      query: ({ uuid, data }) => ({
        url: `/products/${uuid}`,
        method: 'PUT',
        body: data,
      }),
    }),

    // ===== DELETE - Delete Product =====
    deleteProduct: builder.mutation<string, string>({
      query: (uuid) => ({
        url: `/products/${uuid}`,
        method: 'DELETE',
      }),
    }),
  }),
});

export const {
  useGetAllProductQuery,
  useGetProductByUuidQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
} = ecommerceApi;