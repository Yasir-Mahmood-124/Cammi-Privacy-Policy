//redux/textPostSlice.ts

import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const apiSlice = createApi({
  reducerPath: "api", // name in redux store
  baseQuery: fetchBaseQuery({
    baseUrl: "https://s248gcnoqb.execute-api.us-east-1.amazonaws.com/test",
    prepareHeaders: (headers) => {
      headers.set("Content-Type", "application/json");
      return headers;
    },
  }),
  endpoints: (builder) => ({
    createLinkedInPost: builder.mutation<
      { id: string }, // response type
      { sub: string; post_message: string } // request body type
    >({
      query: (body) => ({
        url: "/text-post",
        method: "POST",
        body,
      }),
    }),
  }),
});

// auto-generated hook
export const { useCreateLinkedInPostMutation } = apiSlice;
