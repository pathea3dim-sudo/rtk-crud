import { countSlice } from '@/features/countSlice/countSlice';
import { ecommerceApi } from '@/services/ecommerce';
import { authApi } from '@/services/auth'; // Make sure this import is correct
import { uploadApi } from '@/services/auth'; // Make sure this import is correct
import { configureStore } from '@reduxjs/toolkit';

// Set up the store
export const makeStore = () => {
  return configureStore({
    reducer: {
      count: countSlice.reducer,
      [uploadApi.reducerPath]: uploadApi.reducer,
      [ecommerceApi.reducerPath]: ecommerceApi.reducer,
      [authApi.reducerPath]: authApi.reducer, // Fixed: removed .reducerPath
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(
        ecommerceApi.middleware,
        uploadApi.middleware,
        authApi.middleware // Fixed: was AuthenticatorAssertionResponse.middleWare
      ),
  });
};

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>;
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];