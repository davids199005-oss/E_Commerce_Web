import { api } from "@/lib/api/api";
import type {
  LoginPayload,
  MessageResponse,
  RegisterPayload,
  TokenResponse,
} from "@/lib/types/api";

export const authApi = api.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<TokenResponse, LoginPayload>({
      query: (body) => ({
        url: "/auth/login",
        method: "POST",
        body,
      }),
    }),
    register: builder.mutation<MessageResponse, RegisterPayload>({
      query: (body) => ({
        url: "/auth/register",
        method: "POST",
        body,
      }),
    }),
  }),
});

export const { useLoginMutation, useRegisterMutation } = authApi;
