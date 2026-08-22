import { api } from "@/lib/api/api"
import { loggedOut, userReceived } from "@/lib/features/auth/authSlice"
import type { MessageResponse, User } from "@/lib/types/api"
import type { ChangePasswordRequest, UsersListResponse, UserUpdate } from "@/lib/types/users"

const usersApi = api.injectEndpoints({
  endpoints: (build) => ({
    updateMe: build.mutation<User, UserUpdate>({
      query: (changes) => ({ url: "/users/me", method: "PATCH", body: changes }),
      invalidatesTags: ["Me"],
      async onQueryStarted(_changes, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled
          dispatch(userReceived(data))
        } catch {
          return
        }
      },
    }),

    changePassword: build.mutation<MessageResponse, ChangePasswordRequest>({
      query: (body) => ({ url: "/users/me/password", method: "PATCH", body }),
    }),

    deleteMe: build.mutation<MessageResponse, void>({
      query: () => ({ url: "/users/me", method: "DELETE" }),
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled
          dispatch(loggedOut())
        } catch {
          return
        }
      },
    }),

    listUsers: build.query<UsersListResponse, void>({
      query: () => "/users",
      providesTags: ["UsersList"],
    }),
  }),
})

export const {
  useUpdateMeMutation,
  useChangePasswordMutation,
  useDeleteMeMutation,
  useListUsersQuery,
} = usersApi
