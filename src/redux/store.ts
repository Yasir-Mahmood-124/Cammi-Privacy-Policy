// import { configureStore } from "@reduxjs/toolkit";
// import { apiSlice } from "./apiSlice"; // your existing post now slice
// import { schedulePostApi } from "./schedulePostApi";
// import { viewApiSlice } from './viewApiSlice';
// // import { postApi } from "./linkedin/postApi";
// import { linkedinPostApi } from "./textPostSlice";


// export const store = configureStore({
//   reducer: {
//     [apiSlice.reducerPath]: apiSlice.reducer,
//     [schedulePostApi.reducerPath]: schedulePostApi.reducer,
//     [viewApiSlice.reducerPath]: viewApiSlice.reducer,
//     // [postApi.reducerPath]: postApi.reducer,
//     [linkedinPostApi.reducerPath]: linkedinPostApi.reducer, 
//   },
//   middleware: (getDefaultMiddleware) =>
//     getDefaultMiddleware().concat(
//       apiSlice.middleware,
//       schedulePostApi.middleware,
//       viewApiSlice.middleware,
//       // postApi.middleware,
//       linkedinPostApi.middleware,
//     ),

// });

// export type RootState = ReturnType<typeof store.getState>;
// export type AppDispatch = typeof store.dispatch;


// src/redux/store.ts
import { configureStore } from "@reduxjs/toolkit";
import { linkedinPostApi } from "./services/linkedinPostApi";
import { schedulePostApi } from "./services/schedulePostApi";
import { linkedinLoginApi } from "./services/linkedinLoginApi";
import { viewApiSlice } from './services/viewApiSlice';


export const store = configureStore({
  reducer: {
    [linkedinPostApi.reducerPath]: linkedinPostApi.reducer,
    [schedulePostApi.reducerPath]: schedulePostApi.reducer,
    [linkedinLoginApi.reducerPath]: linkedinLoginApi.reducer,
    [viewApiSlice.reducerPath]: viewApiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(linkedinPostApi.middleware)
      .concat(schedulePostApi.middleware)
      .concat(linkedinLoginApi.middleware)
      .concat(viewApiSlice.middleware)
});

// Types for use throughout app
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;


