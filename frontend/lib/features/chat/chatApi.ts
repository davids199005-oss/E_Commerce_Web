import { api } from "@/lib/api/api";
import type { ChatAnswer, ChatUsage } from "@/lib/types/api";

export const chatApi = api.injectEndpoints({
  endpoints: (builder) => ({
    sendChatMessage: builder.mutation<ChatAnswer, { message: string }>({
      query: (body) => ({
        url: "/chat/message",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Chat"],
    }),
    getChatUsage: builder.query<ChatUsage, void>({
      query: () => "/chat/usage",
      providesTags: ["Chat"],
    }),
  }),
});

export const { useSendChatMessageMutation, useGetChatUsageQuery } = chatApi;
