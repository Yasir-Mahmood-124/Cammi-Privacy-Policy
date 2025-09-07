// src/redux/services/linkedinLoginApi.ts
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const linkedinLoginApi = createApi({
  reducerPath: "linkedinLoginApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://s248gcnoqb.execute-api.us-east-1.amazonaws.com/test/",
  }),
  endpoints: (builder) => ({
    getLoginUrl: builder.query<{ login_url: string }, void>({
      query: () => ({
        url: "login",
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }),
    }),
  }),
});

export const { useGetLoginUrlQuery, useLazyGetLoginUrlQuery } = linkedinLoginApi;
