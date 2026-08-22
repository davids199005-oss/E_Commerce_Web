import { api } from "@/lib/api/api"
import type { MessageResponse, User, UserCreate } from "@/lib/types/api"
import type { LoginRequest, TokenResponse } from "@/lib/types/auth"

const authApi = api.injectEndpoints({
  endpoints: (build) => ({
    login: build.mutation<TokenResponse, LoginRequest>({
      query: (credentials) => ({ url: "/auth/login", method: "POST", body: credentials }),
      invalidatesTags: ["Me"],
    }),

    register: build.mutation<MessageResponse, UserCreate>({
      query: (draft) => ({ url: "/auth/register", method: "POST", body: draft }),
    }),

    getMe: build.query<User, void>({
      query: () => "/users/me",
      providesTags: ["Me"],
    }),
  }),
})

export const { useLoginMutation, useRegisterMutation, useGetMeQuery } = authApi
