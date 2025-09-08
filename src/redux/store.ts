
// src/redux/store.ts
import { configureStore } from "@reduxjs/toolkit";
import { linkedinPostApi } from "./services/linkedinPostApi";
import { schedulePostApi } from "./services/schedulePostApi";
import { linkedinLoginApi } from "./services/linkedinLoginApi";
import { viewApiSlice } from './services/viewApiSlice';
import { aiGenerateApi } from "./services/aiGenerateApi";


export const store = configureStore({
  reducer: {
    [linkedinPostApi.reducerPath]: linkedinPostApi.reducer,
    [schedulePostApi.reducerPath]: schedulePostApi.reducer,
    [linkedinLoginApi.reducerPath]: linkedinLoginApi.reducer,
    [viewApiSlice.reducerPath]: viewApiSlice.reducer,
    [aiGenerateApi.reducerPath]: aiGenerateApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(linkedinPostApi.middleware)
      .concat(schedulePostApi.middleware)
      .concat(linkedinLoginApi.middleware)
      .concat(viewApiSlice.middleware)
      .concat(aiGenerateApi.middleware),
});

// Types for use throughout app
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;


