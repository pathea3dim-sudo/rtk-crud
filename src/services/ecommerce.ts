
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


















// services/ecommerce.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const ecommerceApi = createApi({
  reducerPath: 'ecommerceApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.NEXT_PUBLIC_ISHOP_BASE_URL}`,
    credentials: 'include',
    prepareHeaders: (headers) => {
      const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      headers.set('Content-Type', 'application/json');
      return headers;
    },
  }),
  tagTypes: ["Products"],
  endpoints: (builder) => ({
    getAllProduct: builder.query<any, { page?: number; size?: number }>({
      query: ({ page = 1, size = 10 } = {}) => ({
        url: `/products?page=${page}&size=${size}`,
        method: 'GET',
      }),
      providesTags: ["Products"],
    }),

    getProductByUuid: builder.query<any, string>({
      query: (uuid) => ({
        url: `/products/${uuid}`,
        method: 'GET',
      }),
      providesTags: (result, error, uuid) => [{ type: 'Products', id: uuid }],
    }),

    createProduct: builder.mutation<any, any>({
      query: (newProduct) => ({
        url: `/products`,
        method: 'POST',
        body: newProduct,
      }),
      invalidatesTags: ["Products"],
    }),

    updateProduct: builder.mutation<any, { uuid: string; data: any }>({
      query: ({ uuid, data }) => ({
        url: `/products/${uuid}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { uuid }) => [{ type: 'Products', id: uuid }],
    }),

    deleteProduct: builder.mutation<void, string>({
      query: (uuid) => ({
        url: `/products/${uuid}`,
        method: 'DELETE',
      }),
      invalidatesTags: ["Products"],
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