import { api } from "@/lib/api/api"
import type { ChurnPrediction } from "@/lib/types/api"

const analyticsApi = api.injectEndpoints({
  endpoints: (build) => ({
    getChurn: build.query<ChurnPrediction, number>({
      query: (userId) => `/analytics/churn/${userId}`,
      providesTags: (_result, _error, userId) => [{ type: "Churn" as const, id: userId }],
    }),
  }),
})

export const { useGetChurnQuery } = analyticsApi
