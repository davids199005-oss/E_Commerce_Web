import { api } from "@/lib/api/api"
import { isHttpStatus } from "@/lib/api/errorMessage"
import { config } from "@/lib/config/config"
import type { ChatAnswer, ChatUsage } from "@/lib/types/chat"

export const CHAT_MESSAGE_MAX_LENGTH = 1000

const chatApi = api.injectEndpoints({
  endpoints: (build) => ({
    sendMessage: build.mutation<ChatAnswer, string>({
      query: (message) => ({
        url: "/chat/message",
        method: "POST",
        body: { message },
        timeout: config.chatTimeoutMs,
      }),
      invalidatesTags: (result, error) =>
        result !== undefined || isHttpStatus(error, 429) ? ["ChatUsage"] : [],
    }),

    getChatUsage: build.query<ChatUsage, void>({
      query: () => "/chat/usage",
      providesTags: ["ChatUsage"],
    }),
  }),
})

export const { useSendMessageMutation, useGetChatUsageQuery } = chatApi
