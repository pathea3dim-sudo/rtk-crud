// import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";



// interface   UploadResponse{
//     name:string
// }

// export const uploadApi=createApi({
//     reducerPath: "uploadApi",
//     baseQuery: fetchBaseQuery({
//         baseUrl: `${process.env.NEXT_PUBLIC_ISHOP_BASE_URL}`,
//     }),
//     tagTypes: ["Files"],
//     endpoints: (builder)=>({
//         uploadFile: builder.mutation<UploadResponse,File>({
//             query: (files)=>{
//                 const formData=new FormData();
//                 formData.append("files", files);

//                 return {
//                     url: "/medias/upload-multiple",
//                     method: "POST",
//                     headers: {
//                         // Remove Content-Type header to let browser set it with boundary
//                     },
//                     body: formData
//                 }
//             },
//             invalidatesTags: ["Files"],
//         })
//     })
// })

// export const {
//      useUploadFilesMutation
// }=uploadApi;



import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface UploadResponse {
  success: boolean;
  data?: {
    url: string;
    name: string;
    size: number;
    type: string;
  };
  message?: string;
}

export interface MultipleUploadResponse {
  success: boolean;
  data?: Array<{
    url: string;
    name: string;
    size: number;
    type: string;
  }>;
  message?: string;
}

export const uploadApi = createApi({
  reducerPath: "uploadApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.NEXT_PUBLIC_ISHOP_BASE_URL}`,
  }),
  tagTypes: ["Files"],
  endpoints: (builder) => ({
    uploadSingleFile: builder.mutation<UploadResponse, File>({
      query: (file) => {
        const formData = new FormData();
        formData.append("file", file);
        
        return {
          url: "/medias/upload-single",
          method: "POST",
          body: formData,
        };
      },
      invalidatesTags: ["Files"],
    }),
    uploadMultipleFiles: builder.mutation<MultipleUploadResponse, File[]>({
      query: (files) => {
        const formData = new FormData();
        files.forEach(file => {
          formData.append("files", file);
        });
        
        return {
          url: "/medias/upload-multiple",
          method: "POST",
          body: formData,
        };
      },
      invalidatesTags: ["Files"],
    }),
  }),
});

// Export all hooks
export const { 
  useUploadSingleFileMutation, 
  useUploadMultipleFilesMutation,
} = uploadApi;

// If you want to use a different name, export it separately
export const useUploadFilesMutation = useUploadMultipleFilesMutation;