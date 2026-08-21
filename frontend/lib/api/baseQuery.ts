import {
  fetchBaseQuery,
  type BaseQueryFn,
  type FetchArgs,
  type FetchBaseQueryError,
} from "@reduxjs/toolkit/query";

import { config } from "@/lib/config/config";
import { loggedOut } from "@/lib/features/auth/authSlice";
import { authStorage } from "@/lib/features/auth/authStorage";

const rawBaseQuery = fetchBaseQuery({
  baseUrl: config.apiBaseUrl,
  timeout: config.requestTimeoutMs,
  prepareHeaders: (headers) => {
    const token = authStorage.read();
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

function requestUrl(args: string | FetchArgs): string {
  return typeof args === "string" ? args : args.url;
}

export const baseQuery: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  const result = await rawBaseQuery(args, api, extraOptions);
  const url = requestUrl(args);
  const isAuthAttempt =
    url.includes("/auth/login") || url.includes("/auth/register");

  if (result.error && result.error.status === 401 && !isAuthAttempt) {
    authStorage.clear();
    api.dispatch(loggedOut());
  }

  return result;
};
