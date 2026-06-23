
import { CreateProductType, ProductResponse, ProductType } from '@/lib/products';
import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react'


export const ecommerceApi= createApi({
  reducerPath: 'ecommerceApi',
  baseQuery: fetchBaseQuery({baseUrl: `${process.env.NEXT_PUBLIC_ISHOP_BASE_URL}`}),
  endpoints: (builder)=>({
    // getAllProducts
     getAllProduct: builder.query<ProductResponse,{page:number,size:number}>({
      query: ({page, size}) => `/products?page=${page}&size=${size}`
     }),
    //  getProductByUUid
    getProductByUuid: builder.query<ProductType, string>({
      query: (uuid: string) => ({
        url: `/products/${uuid}`
      })
    }),
    // create Product
    createProduct : builder.mutation<CreateProductType,unknown,unknown>({
      query: (newProduct:CreateProductType)=> ({
         url: `/products`,
         method: 'POST',
         headers: {
          'content-type': 'application/json',
          'authentication': `bearer ${process.env.ACCESS_TOEKN}`
         },
         body: newProduct
      })
    })
  })
})

export const {
 useGetAllProductQuery,
 useGetProductByUuidQuery, 
 useCreateProductMutation
} = ecommerceApi;