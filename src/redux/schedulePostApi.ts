// src/redux/schedulePostApi.ts
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

interface SchedulePostRequest {
  sub: string;
  message: string;
  scheduled_time: string;
}

interface SchedulePostResponse {
  message: string;
  scheduled_time_pkt: string;
  scheduled_time_utc: string;
  schedule_name: string;
}

export const schedulePostApi = createApi({
  reducerPath: "schedulePostApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://s248gcnoqb.execute-api.us-east-1.amazonaws.com/test/",
  }),
  endpoints: (builder) => ({
    schedulePost: builder.mutation<SchedulePostResponse, SchedulePostRequest>({
      query: (body) => ({
        url: "schedule-status",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body,
      }),
    }),
  }),
});

export const { useSchedulePostMutation } = schedulePostApi;
