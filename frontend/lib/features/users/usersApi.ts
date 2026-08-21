import { api } from "@/lib/api/api";
import { userReceived } from "@/lib/features/auth/authSlice";
import type {
  MessageResponse,
  PasswordChangePayload,
  UserProfile,
  UserUpdatePayload,
  UsersListResponse,
} from "@/lib/types/api";

export const usersApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getMe: builder.query<UserProfile, void>({
      query: () => "/users/me",
      providesTags: ["User"],
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(userReceived(data));
        } catch {
          return;
        }
      },
    }),
    updateMe: builder.mutation<UserProfile, UserUpdatePayload>({
      query: (body) => ({
        url: "/users/me",
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["User"],
    }),
    changePassword: builder.mutation<MessageResponse, PasswordChangePayload>({
      query: (body) => ({
        url: "/users/me/password",
        method: "PATCH",
        body,
      }),
    }),
    deleteAccount: builder.mutation<MessageResponse, void>({
      query: () => ({
        url: "/users/me",
        method: "DELETE",
      }),
    }),
    listUsers: builder.query<UsersListResponse, void>({
      query: () => "/users",
      providesTags: ["UsersList"],
    }),
  }),
});

export const {
  useGetMeQuery,
  useUpdateMeMutation,
  useChangePasswordMutation,
  useDeleteAccountMutation,
  useListUsersQuery,
} = usersApi;
