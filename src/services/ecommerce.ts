// src/services/ecommerce.ts
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export type ProductType = {
  name: string;
  description: string;
  stockQuantity: number;
  priceIn: number;
  priceOut: number;
  discount: number;
  warranty: string;
  availability: boolean;
  categoryUuid: string;
  supplierUuid: string;
  brandUuid: string;
  thumbnail: string;
};

export type CategoryType = {
  uuid: string;
  name: string;
  description?: string;
};

export type BrandType = {
  uuid: string;
  name: string;
  description?: string;
};

export type SupplierType = {
  uuid: string;
  name: string;
  contact?: string;
};

export const ecommerceApi = createApi({
  reducerPath: "ecommerceApi",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_ISHOP_BASE_URL || "https://ishop.cheat.casa/api/v1",
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
  tagTypes: ["Products", "Categories", "Brands", "Suppliers"],
  endpoints: (builder) => ({
    // Create Product - POST /api/v1/products
    createProduct: builder.mutation<any, ProductType>({
      query: (productData) => ({
        url: `/products`,
        method: "POST",
        body: productData,
      }),
      invalidatesTags: ["Products"],
    }),

    getProducts: builder.query<any[], void>({
      query: () => `/products`,
      providesTags: ["Products"],
    }),

    getProductById: builder.query<any, string>({
      query: (uuid) => `/products/${uuid}`,
      providesTags: ["Products"],
    }),

    updateProduct: builder.mutation<any, { uuid: string; data: Partial<ProductType> }>({
      query: ({ uuid, data }) => ({
        url: `/products/${uuid}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Products"],
    }),

    deleteProduct: builder.mutation<any, string>({
      query: (uuid) => ({
        url: `/products/${uuid}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Products"],
    }),

    getCategories: builder.query<CategoryType[], void>({
      query: () => `/categories`,
      providesTags: ["Categories"],
    }),

    getBrands: builder.query<BrandType[], void>({
      query: () => `/brands`,
      providesTags: ["Brands"],
    }),

    getSuppliers: builder.query<SupplierType[], void>({
      query: () => `/suppliers`,
      providesTags: ["Suppliers"],
    }),
  }),
});

export const {
  useCreateProductMutation,
  useGetProductsQuery,
  useGetProductByIdQuery,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useGetCategoriesQuery,
  useGetBrandsQuery,
  useGetSuppliersQuery,
} = ecommerceApi;