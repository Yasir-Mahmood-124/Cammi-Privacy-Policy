// import { configureStore } from "@reduxjs/toolkit";
// import { apiSlice } from "./apiSlice"; // your existing post now slice
// import { schedulePostApi } from "./schedulePostApi";
// import { viewApiSlice } from './viewApiSlice';

// export const store = configureStore({
//   reducer: {
//     [apiSlice.reducerPath]: apiSlice.reducer,
//     [schedulePostApi.reducerPath]: schedulePostApi.reducer,
//     [viewApiSlice.reducerPath]: viewApiSlice.reducer,
//   },
//   middleware: (getDefaultMiddleware) =>
//     getDefaultMiddleware().concat(apiSlice.middleware, schedulePostApi.middleware, viewApiSlice.middleware),
// });

// export type RootState = ReturnType<typeof store.getState>;
// export type AppDispatch = typeof store.dispatch;

// store.ts
import { configureStore } from "@reduxjs/toolkit";
import { apiSlice } from "./apiSlice"; // adjust path if needed

export const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
});

// Types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
