// src/services/uploadApi.ts
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

// Get base URL with fallback
const getBaseUrl = () => {
  const envUrl = process.env.NEXT_PUBLIC_ISHOP_BASE_URL;
  if (envUrl) {
    console.log("Using env URL for upload:", envUrl);
    return envUrl;
  }
  return "https://ishop.cheat.casa/api/v1";
};

export const uploadApi = createApi({
  reducerPath: "uploadApi",
  baseQuery: fetchBaseQuery({
    baseUrl: getBaseUrl(),
    prepareHeaders: (headers) => {
      const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["Files"],
  endpoints: (builder) => ({
    // Single file upload - used by your component
    uploadSingleFile: builder.mutation<UploadResponse, File>({
      query: (file) => {
        const formData = new FormData();
        formData.append("file", file);
        return {
          url: '/medias/upload-single',
          method: "POST",
          body: formData,
        };
      },
      invalidatesTags: ["Files"],
    }),

    // Multiple files upload
    uploadMultipleFiles: builder.mutation<MultipleUploadResponse, File[]>({
      query: (files) => {
        const formData = new FormData();
        files.forEach((file) => {
          formData.append("files", file);
        });
        return {
          url: '/medias/upload-multiple',
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

// For backward compatibility
export const useUploadFilesMutation = useUploadSingleFileMutation;