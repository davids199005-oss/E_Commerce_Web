import { api } from "@/lib/api/api";
import type { ChurnPrediction } from "@/lib/types/api";

export const analyticsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getChurnPrediction: builder.query<ChurnPrediction, number>({
      query: (userId) => `/analytics/churn/${userId}`,
    }),
  }),
});

export const { useLazyGetChurnPredictionQuery } = analyticsApi;
