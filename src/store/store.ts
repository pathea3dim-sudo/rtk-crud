// src/store/store.ts
import { countSlice } from '@/features/countSlice/countSlice';
import { ecommerceApi } from '@/services/ecommerce';
import { authApi } from '@/services/auth';
import { configureStore } from '@reduxjs/toolkit';
import { uploadApi } from '@/services/uploadApi';  // ← Make sure this matches

export const makeStore = () => {
  return configureStore({
    reducer: {
      count: countSlice.reducer,
      [ecommerceApi.reducerPath]: ecommerceApi.reducer,
      [authApi.reducerPath]: authApi.reducer,
      [uploadApi.reducerPath]: uploadApi.reducer,  // ← Must match the reducerPath
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(
        ecommerceApi.middleware,
        authApi.middleware,
        uploadApi.middleware  // ← Must match
      ),
  });
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];